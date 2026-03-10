package cloud.xcan.agentx.core.agent;

import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.agent.runtime.AgentChatService;
import cloud.xcan.agentx.core.agent.runtime.AgentInstance;
import cloud.xcan.agentx.core.agent.runtime.AgentStreamingChatService;
import cloud.xcan.agentx.core.guardrail.GuardrailChain;
import cloud.xcan.agentx.core.guardrail.GuardrailResult;
import cloud.xcan.agentx.core.knowledge.ContentRetrieverFactory;
import cloud.xcan.agentx.core.memory.MemoryFactory;
import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.agentx.core.model.ModelRegistry;
import cloud.xcan.agentx.core.prompt.PromptVariableResolver;
import cloud.xcan.agentx.core.skill.SkillRegistry;
import cloud.xcan.agentx.core.tool.ToolRegistry;
import cloud.xcan.agentx.core.workflow.WorkflowDefinitionProvider;
import cloud.xcan.agentx.core.workflow.dsl.WorkflowDefinition;
import cloud.xcan.agentx.core.workflow.engine.WorkflowEngine;
import cloud.xcan.agentx.core.workflow.engine.WorkflowExecutionResult;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.tool.ToolExecutor;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Agent 注册中心 — 管理所有 Agent 实例的生命周期。
 * <p>
 * 模型通过 {@link ModelRegistry} 从数据库配置动态获取， 不再要求外部传入 ChatModel / StreamingChatModel。
 * </p>
 */
@Slf4j
@RequiredArgsConstructor
public class AgentRegistry {

  private static final String WORKFLOW_MODE_BEFORE = "BEFORE_CHAT";
  private static final String WORKFLOW_MODE_AFTER = "AFTER_CHAT";
  private static final String WORKFLOW_MODE_INSTEAD = "INSTEAD_OF_CHAT";
  private static final String SESSION_DEFAULT = "default";
  private static final int RAG_TOP_K = 5;
  private static final String GUARDRAIL_PREFIX = "[Guardrail] ";

  private record GuardrailApplyResult(boolean passed, String result) {}

  private final Map<String, AgentInstance> agents = new ConcurrentHashMap<>();
  private final ToolRegistry toolRegistry;
  private final MemoryFactory memoryFactory;
  private final ModelRegistry modelRegistry;
  private final SkillRegistry skillRegistry;
  private final GuardrailChain guardrailChain;
  private final ContentRetrieverFactory contentRetrieverFactory;
  private final WorkflowEngine workflowEngine;
  private final WorkflowDefinitionProvider workflowDefinitionProvider;

  /**
   * 注册并构建 Agent 实例 — 从 AgentDefinition.model 配置中解析模型
   */
  public AgentInstance register(AgentDefinition definition) {
    log.info("Registering agent: {} ({})", definition.getName(), definition.getId());

    // 从 ModelRegistry 获取模型
    AgentDefinition.ModelConfig modelConfig = definition.getModel();
    ModelProvider provider = modelConfig != null && modelConfig.getProvider() != null
        ? modelConfig.getProvider() : ModelProvider.OPEN_AI;

    ChatModel chatModel;
    StreamingChatModel streamingModel = null;

    if (modelConfig != null && modelConfig.getModelName() != null) {
      // 基于 definition 中指定的 configId 或 provider+modelName 查找
      chatModel = modelRegistry.getDefaultChatModel(provider)
          .orElseThrow(() -> new IllegalStateException(
              "No model config found for provider: " + provider));
      streamingModel = modelRegistry.getDefaultStreamingChatModel(provider)
          .orElse(null);
    } else {
      chatModel = modelRegistry.getDefaultChatModel(provider)
          .orElseThrow(() -> new IllegalStateException(
              "No default model config found for provider: " + provider));
      streamingModel = modelRegistry.getDefaultStreamingChatModel(provider)
          .orElse(null);
    }

    return register(definition, chatModel, streamingModel);
  }

  /**
   * 注册并构建 Agent 实例（显式传入模型实例）
   */
  public AgentInstance register(AgentDefinition definition,
      ChatModel chatModel, StreamingChatModel streamingModel) {
    log.info("Registering agent: {} ({})", definition.getName(), definition.getId());

    AgentInstance instance = new AgentInstance(definition);

    // 构建同步对话服务
    var syncBuilder = AiServices.builder(AgentChatService.class)
        .chatModel(chatModel);

    // 绑定工具：@Tool beans 作为 tools(objects)，仅执行器插件作为 tools(Map)
    List<String> allToolIds = definition.getToolIds() != null
        ? new ArrayList<>(definition.getToolIds()) : new ArrayList<>();

    List<Object> toolObjects = toolRegistry.getToolObjectsForIds(allToolIds);
    Map<ToolSpecification, ToolExecutor> toolMap = toolRegistry.getToolMapForIds(allToolIds);

    if (!toolObjects.isEmpty()) {
      syncBuilder.tools(toolObjects);
    }
    if (!toolMap.isEmpty()) {
      syncBuilder.tools(toolMap);
    }

    // 绑定 LangChain4j 技能（activate_skill、read_skill_resource）
    // skillIds 即技能名称（Skill.name()）
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      skillRegistry.resolveSkillsToolProvider(definition.getSkillIds())
          .ifPresent(syncBuilder::toolProvider);
    }

    // 绑定记忆
    ChatMemoryProvider memoryProvider = memoryFactory.create(definition.getMemory());
    syncBuilder.chatMemoryProvider(memoryProvider);

    // RAG：当存在 knowledgeBaseIds 时绑定 contentRetriever
    AgentDefinition.ModelConfig defModel = definition.getModel();
    if (contentRetrieverFactory != null && definition.getKnowledgeBaseIds() != null
        && !definition.getKnowledgeBaseIds().isEmpty()) {
      ModelProvider embeddingProvider = defModel != null && defModel.getProvider() != null
          ? defModel.getProvider() : ModelProvider.DEEPSEEK;
      contentRetrieverFactory.createContentRetriever(
              definition.getKnowledgeBaseIds(), embeddingProvider, RAG_TOP_K)
          .ifPresent(syncBuilder::contentRetriever);
    }

    String systemPrompt = resolveSystemPromptWithSkills(definition, null);
    if (systemPrompt != null && !systemPrompt.isBlank()) {
      final String finalPrompt = systemPrompt;
      syncBuilder.systemMessageProvider(memoryId -> finalPrompt);
    }

    instance.setAiServiceProxy(syncBuilder.build());

    // 构建流式服务（当有 StreamingChatModel 时）
    if (streamingModel != null) {
      var streamBuilder = AiServices.builder(AgentStreamingChatService.class)
          .streamingChatModel(streamingModel);

      if (contentRetrieverFactory != null && definition.getKnowledgeBaseIds() != null
          && !definition.getKnowledgeBaseIds().isEmpty()) {
        ModelProvider embProvider = defModel != null && defModel.getProvider() != null
            ? defModel.getProvider() : ModelProvider.DEEPSEEK;
        contentRetrieverFactory.createContentRetriever(
                definition.getKnowledgeBaseIds(), embProvider, RAG_TOP_K)
            .ifPresent(streamBuilder::contentRetriever);
      }
      if (!toolObjects.isEmpty()) {
        streamBuilder.tools(toolObjects);
      }
      if (!toolMap.isEmpty()) {
        streamBuilder.tools(toolMap);
      }
      if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
        skillRegistry.resolveSkillsToolProvider(definition.getSkillIds())
            .ifPresent(streamBuilder::toolProvider);
      }
      streamBuilder.chatMemoryProvider(memoryProvider);
      if (systemPrompt != null && !systemPrompt.isBlank()) {
        final String finalPrompt = systemPrompt;
        streamBuilder.systemMessageProvider(memoryId -> finalPrompt);
      }
      instance.setStreamingServiceProxy(streamBuilder.build());
    }

    instance.activate();

    agents.put(definition.getId(), instance);
    log.info("Agent registered and activated: {}", definition.getId());
    return instance;
  }

  public Optional<AgentInstance> get(String agentId) {
    return Optional.ofNullable(agents.get(agentId));
  }

  /**
   * 同步对话（支持配置覆盖）
   *
   * @param defaultModelId 智能体默认模型配置 ID，用于加载基础配置并与 override 合并
   * @param override       配置覆盖，null 则使用 Agent 注册时的模型
   */
  public String chat(String agentId, String sessionId, String message,
      String defaultModelId, ChatConfigOverride override) {
    if (override == null) {
      return chat(agentId, sessionId, message);
    }
    AgentInstance instance = agents.get(agentId);
    if (instance == null) {
      throw new IllegalArgumentException("Agent not found: " + agentId);
    }
    if (defaultModelId == null || defaultModelId.isBlank()) {
      throw new IllegalArgumentException("modelConfigId required when override is provided");
    }
    instance.recordInvocation();

    GuardrailApplyResult inputGuard = applyInputGuardrail(instance, message);
    if (!inputGuard.passed()) {
      return inputGuard.result();
    }
    String inputToUse = inputGuard.result();

    Object memoryId = normalizeSessionId(sessionId);
    String sessionIdStr = (String) memoryId;
    var definition = instance.getDefinition();
    String wfMode = getWorkflowMode(definition);
    if (definition.getWorkflowId() != null && WORKFLOW_MODE_BEFORE.equals(wfMode)) {
      runWorkflowIfConfigured(definition, Map.of("message", inputToUse, "sessionId", sessionIdStr));
    }
    if (definition.getWorkflowId() != null && WORKFLOW_MODE_INSTEAD.equals(wfMode)) {
      String wfResponse = runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "sessionId", sessionIdStr));
      return wfResponse != null ? wfResponse : "";
    }

    ModelConfigDefinition baseConfig = modelRegistry.loadConfigById(defaultModelId)
        .orElseThrow(
            () -> new IllegalArgumentException("Model config not found: " + defaultModelId));

    ModelConfigDefinition mergedConfig = applyOverride(baseConfig, override);
    ChatModel chatModel = modelRegistry.createChatModelFromConfig(mergedConfig);
    String systemPromptOverride = override.getSystemPrompt();
    AgentChatService service = buildChatService(definition, chatModel, systemPromptOverride);
    String response = service.chat(memoryId, inputToUse);

    if (definition.getWorkflowId() != null && WORKFLOW_MODE_AFTER.equals(wfMode)) {
      runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "response", response, "sessionId", sessionIdStr));
    }

    GuardrailApplyResult outputGuard = applyOutputGuardrail(instance, response);
    if (!outputGuard.passed()) {
      return outputGuard.result();
    }
    return outputGuard.result();
  }

  private ModelConfigDefinition applyOverride(ModelConfigDefinition base,
      ChatConfigOverride override) {
    if (override == null) {
      return base;
    }
    ModelConfigDefinition.ModelConfigDefinitionBuilder b = ModelConfigDefinition.builder()
        .id(base.getId())
        .provider(base.getProvider())
        .type(base.getType())
        .modelName(base.getModelName())
        .apiKey(base.getApiKey())
        .baseUrl(base.getBaseUrl())
        .embeddingModelName(base.getEmbeddingModelName())
        .defaultConfig(base.isDefaultConfig())
        .priority(base.getPriority())
        .tenantId(base.getTenantId());
    b.temperature(orDefault(override.getTemperature(), base.getTemperature(), 0.7));
    b.maxTokens(orDefault(override.getMaxTokens(), base.getMaxTokens(), 4096));
    if (override.getTimeoutMs() != null && override.getTimeoutMs() > 0) {
      b.timeoutSeconds((int) Math.max(1, override.getTimeoutMs() / 1000));
    } else if (base.getTimeoutSeconds() != null) {
      b.timeoutSeconds(base.getTimeoutSeconds());
    }
    b.topP(orDefault(override.getTopP(), base.getTopP(), null));
    b.frequencyPenalty(orDefault(override.getFrequencyPenalty(), base.getFrequencyPenalty(), null));
    b.presencePenalty(orDefault(override.getPresencePenalty(), base.getPresencePenalty(), null));
    b.inputPricePerMillionTokens(base.getInputPricePerMillionTokens());
    b.outputPricePerMillionTokens(base.getOutputPricePerMillionTokens());
    b.extraProperties(base.getExtraProperties());
    return b.build();
  }

  private AgentChatService buildChatService(AgentDefinition definition, ChatModel chatModel,
      String systemPromptOverride) {
    var syncBuilder = AiServices.builder(AgentChatService.class).chatModel(chatModel);
    List<String> allToolIds = definition.getToolIds() != null
        ? new ArrayList<>(definition.getToolIds()) : new ArrayList<>();
    List<Object> toolObjects = toolRegistry.getToolObjectsForIds(allToolIds);
    Map<ToolSpecification, ToolExecutor> toolMap = toolRegistry.getToolMapForIds(allToolIds);
    if (!toolObjects.isEmpty()) {
      syncBuilder.tools(toolObjects);
    }
    if (!toolMap.isEmpty()) {
      syncBuilder.tools(toolMap);
    }
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      skillRegistry.resolveSkillsToolProvider(definition.getSkillIds())
          .ifPresent(syncBuilder::toolProvider);
    }
    ChatMemoryProvider memoryProvider = memoryFactory.create(definition.getMemory());
    syncBuilder.chatMemoryProvider(memoryProvider);
    AgentDefinition.ModelConfig defModel = definition.getModel();
    if (contentRetrieverFactory != null && definition.getKnowledgeBaseIds() != null
        && !definition.getKnowledgeBaseIds().isEmpty()) {
      ModelProvider embeddingProvider = defModel != null && defModel.getProvider() != null
          ? defModel.getProvider() : ModelProvider.DEEPSEEK;
      contentRetrieverFactory.createContentRetriever(
              definition.getKnowledgeBaseIds(), embeddingProvider, RAG_TOP_K)
          .ifPresent(syncBuilder::contentRetriever);
    }
    String systemPrompt = resolveSystemPromptWithSkills(definition, systemPromptOverride);
    if (systemPrompt != null && !systemPrompt.isBlank()) {
      final String finalPrompt = systemPrompt;
      syncBuilder.systemMessageProvider(memoryId -> finalPrompt);
    }
    return syncBuilder.build();
  }

  public String chat(String agentId, String sessionId, String message) {
    AgentInstance instance = agents.get(agentId);
    if (instance == null) {
      throw new IllegalArgumentException("Agent not found: " + agentId);
    }
    instance.recordInvocation();

    GuardrailApplyResult inputGuard = applyInputGuardrail(instance, message);
    if (!inputGuard.passed()) {
      return inputGuard.result();
    }
    String inputToUse = inputGuard.result();

    Object memoryId = normalizeSessionId(sessionId);
    String sessionIdStr = (String) memoryId;
    var definition = instance.getDefinition();
    String wfMode = getWorkflowMode(definition);
    if (definition.getWorkflowId() != null && WORKFLOW_MODE_BEFORE.equals(wfMode)) {
      runWorkflowIfConfigured(definition, Map.of("message", inputToUse, "sessionId", sessionIdStr));
    }

    if (definition.getWorkflowId() != null && WORKFLOW_MODE_INSTEAD.equals(wfMode)) {
      String wfResponse = runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "sessionId", sessionIdStr));
      return wfResponse != null ? wfResponse : "";
    }

    AgentChatService service = (AgentChatService) instance.getAiServiceProxy();
    String response = service.chat(memoryId, inputToUse);

    // AFTER_CHAT：LLM 后执行工作流（通知、记录等）
    if (definition.getWorkflowId() != null && WORKFLOW_MODE_AFTER.equals(wfMode)) {
      runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "response", response, "sessionId", sessionIdStr));
    }

    GuardrailApplyResult outputGuard = applyOutputGuardrail(instance, response);
    if (!outputGuard.passed()) {
      return outputGuard.result();
    }
    return outputGuard.result();
  }

  /**
   * 流式对话（支持配置覆盖）
   */
  public TokenStream chatStream(String agentId, String sessionId, String message,
      String defaultModelId, ChatConfigOverride override) {
    if (override == null) {
      return chatStream(agentId, sessionId, message);
    }
    AgentInstance instance = agents.get(agentId);
    if (instance == null) {
      throw new IllegalArgumentException("Agent not found: " + agentId);
    }
    if (defaultModelId == null || defaultModelId.isBlank()) {
      throw new IllegalArgumentException("modelConfigId required when override is provided");
    }
    instance.recordInvocation();

    GuardrailApplyResult inputGuard = applyInputGuardrail(instance, message);
    if (!inputGuard.passed()) {
      throw new IllegalStateException(inputGuard.result());
    }
    String inputToUse = inputGuard.result();

    Object memoryId = normalizeSessionId(sessionId);
    var definition = instance.getDefinition();
    ModelConfigDefinition baseConfig = modelRegistry.loadConfigById(defaultModelId)
        .orElseThrow(
            () -> new IllegalArgumentException("Model config not found: " + defaultModelId));
    ModelConfigDefinition mergedConfig = applyOverride(baseConfig, override);
    StreamingChatModel streamingModel = modelRegistry.createStreamingChatModelFromConfig(
        mergedConfig);
    String systemPromptOverride = override.getSystemPrompt();
    AgentStreamingChatService service = buildStreamingChatService(definition, streamingModel,
        systemPromptOverride);
    return service.chatStream(memoryId, inputToUse);
  }

  private AgentStreamingChatService buildStreamingChatService(AgentDefinition definition,
      StreamingChatModel streamingModel, String systemPromptOverride) {
    var streamBuilder = AiServices.builder(AgentStreamingChatService.class)
        .streamingChatModel(streamingModel);
    List<String> allToolIds = definition.getToolIds() != null
        ? new ArrayList<>(definition.getToolIds()) : new ArrayList<>();
    List<Object> toolObjects = toolRegistry.getToolObjectsForIds(allToolIds);
    Map<ToolSpecification, ToolExecutor> toolMap = toolRegistry.getToolMapForIds(allToolIds);
    if (!toolObjects.isEmpty()) {
      streamBuilder.tools(toolObjects);
    }
    if (!toolMap.isEmpty()) {
      streamBuilder.tools(toolMap);
    }
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      skillRegistry.resolveSkillsToolProvider(definition.getSkillIds())
          .ifPresent(streamBuilder::toolProvider);
    }
    ChatMemoryProvider memoryProvider = memoryFactory.create(definition.getMemory());
    streamBuilder.chatMemoryProvider(memoryProvider);
    AgentDefinition.ModelConfig defModel = definition.getModel();
    if (contentRetrieverFactory != null && definition.getKnowledgeBaseIds() != null
        && !definition.getKnowledgeBaseIds().isEmpty()) {
      ModelProvider embProvider = defModel != null && defModel.getProvider() != null
          ? defModel.getProvider() : ModelProvider.DEEPSEEK;
      contentRetrieverFactory.createContentRetriever(
              definition.getKnowledgeBaseIds(), embProvider, RAG_TOP_K)
          .ifPresent(streamBuilder::contentRetriever);
    }
    String systemPrompt = resolveSystemPromptWithSkills(definition, systemPromptOverride);
    if (systemPrompt != null && !systemPrompt.isBlank()) {
      final String finalPrompt = systemPrompt;
      streamBuilder.systemMessageProvider(memoryId -> finalPrompt);
    }
    return streamBuilder.build();
  }

  /**
   * 流式对话 — 返回 TokenStream，无流式模型时抛异常。 注意：输出护栏在流式场景下暂不执行（需先缓冲完整响应），仅执行输入护栏。
   */
  public TokenStream chatStream(String agentId, String sessionId, String message) {
    AgentInstance instance = agents.get(agentId);
    if (instance == null) {
      throw new IllegalArgumentException("Agent not found: " + agentId);
    }
    if (instance.getStreamingServiceProxy() == null) {
      throw new IllegalStateException("Streaming not supported for agent: " + agentId
          + " (no StreamingChatModel configured)");
    }
    instance.recordInvocation();

    GuardrailApplyResult inputGuard = applyInputGuardrail(instance, message);
    if (!inputGuard.passed()) {
      throw new IllegalStateException(inputGuard.result());
    }
    String inputToUse = inputGuard.result();

    Object memoryId = normalizeSessionId(sessionId);
    AgentStreamingChatService service = (AgentStreamingChatService) instance.getStreamingServiceProxy();
    return service.chatStream(memoryId, inputToUse);
  }

  public void unregister(String agentId) {
    AgentInstance removed = agents.remove(agentId);
    if (removed != null) {
      removed.archive();
      log.info("Agent unregistered: {}", agentId);
    }
  }

  public Map<String, AgentInstance> listAll() {
    return Map.copyOf(agents);
  }

  /**
   * 当 Agent 配置了 workflowId 时执行工作流。
   *
   * @param definition     Agent 定义
   * @param inputVariables 入参（message、sessionId、response 等）
   * @return 工作流输出中的 response 或 text，供 INSTEAD_OF_CHAT 使用；其他模式返回 null
   */
  private String runWorkflowIfConfigured(AgentDefinition definition,
      Map<String, Object> inputVariables) {
    if (workflowEngine == null || workflowDefinitionProvider == null) {
      return null;
    }
    Long workflowId = definition.getWorkflowId();
    if (workflowId == null) {
      return null;
    }
    WorkflowDefinition wfDef = workflowDefinitionProvider.loadByLongId(workflowId).orElse(null);
    if (wfDef == null) {
      log.warn("Workflow not found for workflowId: {}", workflowId);
      return null;
    }
    try {
      WorkflowExecutionResult result = workflowEngine.execute(wfDef, inputVariables);
      Map<String, Object> output = result.getOutput();
      if (output == null) {
        return null;
      }
      Object resp = output.get("response");
      if (resp instanceof String) {
        return (String) resp;
      }
      Object text = output.get("text");
      if (text instanceof String) {
        return (String) text;
      }
      return null;
    } catch (Exception e) {
      log.error("Workflow execution failed for workflowId {}: {}", workflowId, e.getMessage(), e);
      return null;
    }
  }

  private static String normalizeSessionId(String sessionId) {
    return sessionId != null && !sessionId.isBlank() ? sessionId : SESSION_DEFAULT;
  }

  private static String getWorkflowMode(AgentDefinition definition) {
    var trigger = definition.getWorkflowTrigger();
    return trigger != null && trigger.getMode() != null ? trigger.getMode() : WORKFLOW_MODE_AFTER;
  }

  private static <T> T orDefault(T override, T base, T defaultValue) {
    return override != null ? override : (base != null ? base : defaultValue);
  }

  private GuardrailApplyResult applyInputGuardrail(AgentInstance instance, String message) {
    if (guardrailChain == null) {
      return new GuardrailApplyResult(true, message);
    }
    var guardrails = instance.getDefinition().getGuardrails();
    if (guardrails == null || guardrails.getInputGuardrailIds() == null
        || guardrails.getInputGuardrailIds().isEmpty()) {
      return new GuardrailApplyResult(true, message);
    }
    GuardrailResult r = guardrailChain.checkInput(message, guardrails.getInputGuardrailIds());
    if (!r.isPassed()) {
      return new GuardrailApplyResult(false,
          GUARDRAIL_PREFIX + (r.getReason() != null ? r.getReason() : "Input blocked"));
    }
    return new GuardrailApplyResult(true,
        r.getSanitizedContent() != null ? r.getSanitizedContent() : message);
  }

  private GuardrailApplyResult applyOutputGuardrail(AgentInstance instance, String response) {
    if (guardrailChain == null) {
      return new GuardrailApplyResult(true, response);
    }
    var guardrails = instance.getDefinition().getGuardrails();
    if (guardrails == null || guardrails.getOutputGuardrailIds() == null
        || guardrails.getOutputGuardrailIds().isEmpty()) {
      return new GuardrailApplyResult(true, response);
    }
    GuardrailResult r = guardrailChain.checkOutput(response, guardrails.getOutputGuardrailIds());
    if (!r.isPassed()) {
      return new GuardrailApplyResult(false,
          GUARDRAIL_PREFIX + (r.getReason() != null ? r.getReason() : "Output blocked"));
    }
    return new GuardrailApplyResult(true,
        r.getSanitizedContent() != null ? r.getSanitizedContent() : response);
  }

  /**
   * 解析系统提示词（含技能指令），用于同步/流式服务构建
   */
  private String resolveSystemPromptWithSkills(AgentDefinition definition, String systemPromptOverride) {
    String systemPrompt = systemPromptOverride != null && !systemPromptOverride.isBlank()
        ? systemPromptOverride : definition.getSystemPrompt();
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      String skillsHint = skillRegistry.formatAvailableSkills(definition.getSkillIds());
      if (!skillsHint.isEmpty()) {
        String skillsInstruction = "\n\nYou have access to the following skills:\n" + skillsHint
            + "\nWhen the user's request relates to one of these skills, activate it first using the `activate_skill` tool before proceeding.";
        systemPrompt = (systemPrompt != null ? systemPrompt : "") + skillsInstruction;
      }
    }
    return PromptVariableResolver.resolve(systemPrompt, definition.getVariables());
  }
}
