package cloud.xcan.core.agent;

import cloud.xcan.core.agent.definition.AgentDefinition;
import cloud.xcan.core.agent.runtime.AgentChatService;
import cloud.xcan.core.agent.runtime.AgentInstance;
import cloud.xcan.core.agent.runtime.AgentStreamingChatService;
import cloud.xcan.core.guardrail.GuardrailChain;
import cloud.xcan.core.guardrail.GuardrailResult;
import cloud.xcan.core.knowledge.ContentRetrieverFactory;
import cloud.xcan.core.memory.MemoryFactory;
import cloud.xcan.core.model.ModelProvider;
import cloud.xcan.core.model.ModelRegistry;
import cloud.xcan.core.prompt.PromptVariableResolver;
import cloud.xcan.core.skill.SkillRegistry;
import cloud.xcan.core.tool.ToolRegistry;
import cloud.xcan.core.workflow.WorkflowDefinitionProvider;
import cloud.xcan.core.workflow.dsl.WorkflowDefinition;
import cloud.xcan.core.workflow.engine.WorkflowEngine;
import cloud.xcan.core.workflow.engine.WorkflowExecutionResult;
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
      int topK = 5;
      contentRetrieverFactory.createContentRetriever(
              definition.getKnowledgeBaseIds(), embeddingProvider, topK)
          .ifPresent(syncBuilder::contentRetriever);
    }

    // 系统消息：当有技能时追加技能提示
    String systemPrompt = definition.getSystemPrompt();
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      String skillsHint = skillRegistry.formatAvailableSkills(definition.getSkillIds());
      if (!skillsHint.isEmpty()) {
        String skillsInstruction = "\n\nYou have access to the following skills:\n" + skillsHint
            + "\nWhen the user's request relates to one of these skills, activate it first using the `activate_skill` tool before proceeding.";
        systemPrompt = (systemPrompt != null ? systemPrompt : "") + skillsInstruction;
      }
    }
    systemPrompt = PromptVariableResolver.resolve(systemPrompt, definition.getVariables());
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
                definition.getKnowledgeBaseIds(), embProvider, 5)
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

  public String chat(String agentId, String sessionId, String message) {
    AgentInstance instance = agents.get(agentId);
    if (instance == null) {
      throw new IllegalArgumentException("Agent not found: " + agentId);
    }
    instance.recordInvocation();

    // 输入护栏
    String inputToUse = message;
    if (guardrailChain != null) {
      var guardrails = instance.getDefinition().getGuardrails();
      if (guardrails != null && guardrails.getInputGuardrailIds() != null
          && !guardrails.getInputGuardrailIds().isEmpty()) {
        GuardrailResult inputResult = guardrailChain.checkInput(message,
            guardrails.getInputGuardrailIds());
        if (!inputResult.isPassed()) {
          return "[Guardrail] " + (inputResult.getReason() != null ? inputResult.getReason()
              : "Input blocked");
        }
        if (inputResult.getSanitizedContent() != null) {
          inputToUse = inputResult.getSanitizedContent();
        }
      }
    }

    Object memoryId = sessionId != null && !sessionId.isBlank() ? sessionId : "default";
    String sessionIdStr = sessionId != null && !sessionId.isBlank() ? sessionId : "default";
    var definition = instance.getDefinition();
    var trigger = definition.getWorkflowTrigger();
    String wfMode = trigger != null && trigger.getMode() != null ? trigger.getMode() : "AFTER_CHAT";

    // BEFORE_CHAT：LLM 前执行工作流（输出可合并到上下文，当前仅执行）
    if (definition.getWorkflowId() != null && "BEFORE_CHAT".equals(wfMode)) {
      runWorkflowIfConfigured(definition, Map.of("message", inputToUse, "sessionId", sessionIdStr));
    }

    // INSTEAD_OF_CHAT：直接执行工作流并返回输出，不调用 LLM
    if (definition.getWorkflowId() != null && "INSTEAD_OF_CHAT".equals(wfMode)) {
      String wfResponse = runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "sessionId", sessionIdStr));
      return wfResponse != null ? wfResponse : "";
    }

    AgentChatService service = (AgentChatService) instance.getAiServiceProxy();
    String response = service.chat(memoryId, inputToUse);

    // AFTER_CHAT：LLM 后执行工作流（通知、记录等）
    if (definition.getWorkflowId() != null && "AFTER_CHAT".equals(wfMode)) {
      runWorkflowIfConfigured(definition,
          Map.of("message", inputToUse, "response", response, "sessionId", sessionIdStr));
    }

    // 输出护栏
    if (guardrailChain != null) {
      var guardrails = instance.getDefinition().getGuardrails();
      if (guardrails != null && guardrails.getOutputGuardrailIds() != null
          && !guardrails.getOutputGuardrailIds().isEmpty()) {
        GuardrailResult outputResult = guardrailChain.checkOutput(response,
            guardrails.getOutputGuardrailIds());
        if (!outputResult.isPassed()) {
          return "[Guardrail] " + (outputResult.getReason() != null ? outputResult.getReason()
              : "Output blocked");
        }
        if (outputResult.getSanitizedContent() != null) {
          response = outputResult.getSanitizedContent();
        }
      }
    }
    return response;
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

    // 输入护栏（输出护栏需先缓冲完整响应，流式场景下不执行）
    String inputToUse = message;
    if (guardrailChain != null) {
      var guardrails = instance.getDefinition().getGuardrails();
      if (guardrails != null && guardrails.getInputGuardrailIds() != null
          && !guardrails.getInputGuardrailIds().isEmpty()) {
        GuardrailResult inputResult = guardrailChain.checkInput(message,
            guardrails.getInputGuardrailIds());
        if (!inputResult.isPassed()) {
          throw new IllegalStateException(
              "[Guardrail] " + (inputResult.getReason() != null ? inputResult.getReason()
                  : "Input blocked"));
        }
        if (inputResult.getSanitizedContent() != null) {
          inputToUse = inputResult.getSanitizedContent();
        }
      }
    }

    Object memoryId = sessionId != null && !sessionId.isBlank() ? sessionId : "default";
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
}
