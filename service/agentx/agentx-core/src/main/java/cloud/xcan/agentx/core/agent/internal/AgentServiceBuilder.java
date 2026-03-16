package cloud.xcan.agentx.core.agent.internal;

import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.agent.runtime.AgentChatService;
import cloud.xcan.agentx.core.agent.runtime.AgentStreamingChatService;
import cloud.xcan.agentx.core.knowledge.ContentRetrieverFactory;
import cloud.xcan.agentx.core.memory.MemoryFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.agentx.core.skill.SkillRegistry;
import cloud.xcan.agentx.core.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolExecutor;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;

/**
 * Agent 对话服务构建器 — 将 AgentDefinition 与外部依赖组装成 LangChain4j AiServices 实例。
 * <p>
 * 职责：工具、技能、记忆、RAG、系统提示词的统一配置，消除 AgentRegistry 中重复的 builder 逻辑。
 * </p>
 */
@RequiredArgsConstructor
public class AgentServiceBuilder {

  private static final int RAG_TOP_K = 5;

  private final ToolRegistry toolRegistry;
  private final SkillRegistry skillRegistry;
  private final MemoryFactory memoryFactory;
  private final ContentRetrieverFactory contentRetrieverFactory;

  /**
   * 构建同步对话服务
   */
  public AgentChatService buildChatService(AgentDefinition definition, ChatModel chatModel,
      String systemPromptOverride, SystemPromptResolver systemPromptResolver) {
    var builder = AiServices.builder(AgentChatService.class).chatModel(chatModel);
    applyCommonConfig(builder, definition, systemPromptOverride, systemPromptResolver);
    return builder.build();
  }

  /**
   * 构建流式对话服务
   */
  public AgentStreamingChatService buildStreamingChatService(AgentDefinition definition,
      StreamingChatModel streamingModel, String systemPromptOverride,
      SystemPromptResolver systemPromptResolver) {
    var builder = AiServices.builder(AgentStreamingChatService.class)
        .streamingChatModel(streamingModel);
    applyCommonConfig(builder, definition, systemPromptOverride, systemPromptResolver);
    return builder.build();
  }

  /**
   * 统一配置：工具、技能、记忆、RAG、系统提示词
   */
  private void applyCommonConfig(Object builder, AgentDefinition definition,
      String systemPromptOverride, SystemPromptResolver systemPromptResolver) {
    List<String> toolIds = definition.getToolIds() != null
        ? new ArrayList<>(definition.getToolIds()) : new ArrayList<>();

    List<Object> toolObjects = toolRegistry.getToolObjectsForIds(toolIds);
    Map<ToolSpecification, ToolExecutor> toolMap = toolRegistry.getToolMapForIds(toolIds);

    bindTools(builder, toolObjects, toolMap);
    bindSkills(builder, definition.getSkillIds());
    bindMemory(builder, definition);
    bindContentRetriever(builder, definition);
    bindSystemPrompt(builder, definition, systemPromptOverride, systemPromptResolver);
  }

  private void bindTools(Object builder, List<Object> toolObjects,
      Map<ToolSpecification, ToolExecutor> toolMap) {
    if (!toolObjects.isEmpty()) {
      invokeBuilderMethod(builder, "tools", new Class[]{Object[].class},
          toolObjects.toArray());
    }
    if (!toolMap.isEmpty()) {
      invokeBuilderMethod(builder, "tools", new Class[]{Map.class}, toolMap);
    }
  }

  private void bindSkills(Object builder, List<String> skillIds) {
    if (skillIds != null && !skillIds.isEmpty()) {
      skillRegistry.resolveSkillsToolProvider(skillIds)
          .ifPresent(tp -> invokeBuilderMethod(builder, "toolProvider",
              new Class[]{dev.langchain4j.service.tool.ToolProvider.class}, tp));
    }
  }

  private void bindMemory(Object builder, AgentDefinition definition) {
    ChatMemoryProvider memoryProvider = memoryFactory.create(definition.getMemory());
    invokeBuilderMethod(builder, "chatMemoryProvider",
        new Class[]{ChatMemoryProvider.class}, memoryProvider);
  }

  private void bindContentRetriever(Object builder, AgentDefinition definition) {
    if (contentRetrieverFactory == null || definition.getKnowledgeBaseIds() == null
        || definition.getKnowledgeBaseIds().isEmpty()) {
      return;
    }
    var defModel = definition.getModel();
    ModelProvider embeddingProvider = defModel != null && defModel.getProvider() != null
        ? defModel.getProvider() : ModelProvider.DEEPSEEK;
    contentRetrieverFactory.createContentRetriever(
            definition.getKnowledgeBaseIds(), embeddingProvider, RAG_TOP_K)
        .ifPresent(cr -> invokeBuilderMethod(builder, "contentRetriever",
            new Class[]{dev.langchain4j.rag.content.retriever.ContentRetriever.class}, cr));
  }

  private void bindSystemPrompt(Object builder, AgentDefinition definition,
      String systemPromptOverride, SystemPromptResolver systemPromptResolver) {
    String systemPrompt = systemPromptResolver.resolve(definition, systemPromptOverride);
    if (systemPrompt != null && !systemPrompt.isBlank()) {
      final String finalPrompt = systemPrompt;
      invokeBuilderMethod(builder, "systemMessageProvider",
          new Class[]{java.util.function.Function.class},
          (java.util.function.Function<Object, String>) memoryId -> finalPrompt);
    }
  }

  private void invokeBuilderMethod(Object builder, String methodName, Class<?>[] paramTypes,
      Object... args) {
    try {
      var method = builder.getClass().getMethod(methodName, paramTypes);
      method.invoke(builder, args);
    } catch (Exception e) {
      throw new IllegalStateException("Failed to configure AiServices builder: " + methodName, e);
    }
  }

  /**
   * 系统提示词解析器（含技能指令）
   */
  @FunctionalInterface
  public interface SystemPromptResolver {

    String resolve(AgentDefinition definition, String override);
  }
}
