package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_MEMORY_DEFAULT_MAX_TOKENS;
import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_MEMORY_DEFAULT_WINDOW_SIZE;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.model.Model;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Agent 实体 → AgentDefinition（用于 AgentRegistry 注册）
 * <p>
 * TODO: ModelConfigProvider.loadById(String.valueOf(modelId)) 需支持平台 Model.id，
 * 否则 ModelRegistry.getChatModel 可能失败，需降级到 getDefaultChatModel(provider)
 * </p>
 */
public class AgentDefinitionConverter {

  public static AgentDefinition toDefinition(Agent agent, Model model) {
    AgentDefinition.ModelConfig modelConfig = AgentDefinition.ModelConfig.builder()
        .provider(model != null
            ? model.getProvider() : ModelProvider.DEEPSEEK)
        .modelName(model != null && model.getConfig() != null
            ? model.getConfig().getModelName() : null)
        .temperature(model != null && model.getConfig() != null
            ? model.getConfig().getTemperature() : 0.7)
        .maxTokens(model != null && model.getConfig() != null
            ? model.getConfig().getMaxTokens() : 4096)
        .build();

    AgentDefinition.MemoryConfig memoryConfig = AgentDefinition.MemoryConfig.builder()
        .strategy(agent.getMemoryStrategy() != null
            ? agent.getMemoryStrategy() : MemoryStrategy.TOKEN_WINDOW)
        .windowSize(agent.getMemoryWindowSize() != null
            ? agent.getMemoryWindowSize() : AGENT_MEMORY_DEFAULT_WINDOW_SIZE)
        .maxTokens(agent.getMemoryMaxTokens() != null
            ? agent.getMemoryMaxTokens() : AGENT_MEMORY_DEFAULT_MAX_TOKENS)
        .summaryPrompt(agent.getMemorySummaryPrompt())
        .build();

    AgentDefinition.GuardrailConfig guardrailConfig = AgentDefinition.GuardrailConfig.builder()
        .inputGuardrailIds(nullSafe(agent.getInputGuardrailIds()))
        .outputGuardrailIds(nullSafe(agent.getOutputGuardrailIds()))
        .build();

    List<String> kbIds = agent.getKnowledgeBaseIds() != null
        ? agent.getKnowledgeBaseIds().stream().map(String::valueOf).collect(Collectors.toList())
        : Collections.emptyList();
    List<String> dsIds = agent.getDatasetIds() != null
        ? agent.getDatasetIds().stream().map(String::valueOf).collect(Collectors.toList())
        : Collections.emptyList();
    List<String> apiIds = agent.getApiCollectionIds() != null
        ? agent.getApiCollectionIds().stream().map(String::valueOf).collect(Collectors.toList())
        : Collections.emptyList();

    return AgentDefinition.builder()
        .id(String.valueOf(agent.getId()))
        .name(agent.getName())
        .description(agent.getDescription())
        .interactionMode(agent.getInteractionMode())
        .reasoningStrategy(agent.getReasoningStrategy())
        .autonomyLevel(agent.getAutonomyLevel())
        .model(modelConfig)
        .systemPrompt(agent.getSystemPrompt())
        .welcomeMessage(agent.getWelcomeMessage())
        .suggestedQuestions(nullSafe(agent.getSuggestedQuestions()))
        .workflowId(agent.getWorkflowId())
        .toolIds(nullSafe(agent.getToolIds()))
        .skillIds(nullSafe(agent.getSkillIds()))
        .knowledgeBaseIds(kbIds)
        .datasetIds(dsIds)
        .openApiIds(apiIds)
        .memory(memoryConfig)
        .guardrails(guardrailConfig)
        .variables(nullSafe(agent.getVariables()))
        .tenantId(String.valueOf(agent.getTenantId()))
        .build();
  }

}
