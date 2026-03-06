package com.agentx.core.agent;

import com.agentx.core.agent.definition.AgentDefinition;
import com.agentx.core.agent.runtime.AgentChatService;
import com.agentx.core.agent.runtime.AgentInstance;
import com.agentx.core.memory.MemoryFactory;
import com.agentx.core.model.ModelRegistry;
import com.agentx.core.skill.SkillRegistry;
import com.agentx.core.tool.ToolRegistry;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolProvider;
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

  /**
   * 注册并构建 Agent 实例 — 从 AgentDefinition.model 配置中解析模型
   */
  public AgentInstance register(AgentDefinition definition) {
    log.info("Registering agent: {} ({})", definition.getName(), definition.getId());

    // 从 ModelRegistry 获取模型
    AgentDefinition.ModelConfig modelConfig = definition.getModel();
    String provider = modelConfig != null && modelConfig.getProvider() != null
        ? modelConfig.getProvider() : "openai";

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
      ChatModel chatModel,
      StreamingChatModel streamingModel) {
    log.info("Registering agent: {} ({})", definition.getName(), definition.getId());

    AgentInstance instance = new AgentInstance(definition);

    // Build sync chat service
    var syncBuilder = AiServices.builder(AgentChatService.class)
        .chatModel(chatModel);

    // Bind direct tools (skillIds 仅用于 LangChain4j Skills，不再关联额外 toolIds)
    List<String> allToolIds = definition.getToolIds() != null
        ? new ArrayList<>(definition.getToolIds()) : new ArrayList<>();

    for (String toolId : allToolIds) {
      toolRegistry.getTool(toolId).ifPresent(syncBuilder::tools);
    }

    // Bind LangChain4j Skills (activate_skill, read_skill_resource)
    // skillIds 即技能名称（Skill.name()）
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      skillRegistry.resolveSkillsToolProvider(definition.getSkillIds())
          .ifPresent(syncBuilder::toolProvider);
    }

    // Bind memory
    ChatMemoryProvider memoryProvider = memoryFactory.create(definition.getMemory());
    syncBuilder.chatMemoryProvider(memoryProvider);

    // System message — include skills hint when skills are present
    String systemPrompt = definition.getSystemPrompt();
    if (definition.getSkillIds() != null && !definition.getSkillIds().isEmpty()) {
      String skillsHint = skillRegistry.formatAvailableSkills(definition.getSkillIds());
      if (!skillsHint.isEmpty()) {
        String skillsInstruction = "\n\nYou have access to the following skills:\n" + skillsHint
            + "\nWhen the user's request relates to one of these skills, activate it first using the `activate_skill` tool before proceeding.";
        systemPrompt = (systemPrompt != null ? systemPrompt : "") + skillsInstruction;
      }
    }
    if (systemPrompt != null && !systemPrompt.isBlank()) {
      final String finalPrompt = systemPrompt;
      syncBuilder.systemMessageProvider(memoryId -> finalPrompt);
    }

    instance.setAiServiceProxy(syncBuilder.build());
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
    AgentChatService service = (AgentChatService) instance.getAiServiceProxy();
    return service.chat(message);
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
}
