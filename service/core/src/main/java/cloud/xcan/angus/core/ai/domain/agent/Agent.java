package cloud.xcan.angus.core.ai.domain.agent;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_ENCODING_MAX_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.angus.core.ai.application.converter.AgentConverter;
import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 智能体实体 — 用户可创建的智能体，持久化存储
 *
 * @see AgentConverter
 */
@Entity
@Table(name = "ai_agent")
@Setter
@Getter
@Accessors(chain = true)
public class Agent extends TenantAuditingEntity<Agent, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = MAX_NAME_LENGTH)
  private String name;

  @Column(name = "encoding", nullable = false, length = AGENT_ENCODING_MAX_LENGTH)
  private String encoding;

  @Column(name = "description", length = MAX_DESC_LENGTH_X4)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private AgentStatus status = AgentStatus.INACTIVE;

  @Enumerated(EnumType.STRING)
  @Column(name = "interaction_mode", length = 30)
  private InteractionMode interactionMode = InteractionMode.CHATBOT;

  @Enumerated(EnumType.STRING)
  @Column(name = "reasoning_strategy", length = 30)
  private ReasoningStrategy reasoningStrategy = ReasoningStrategy.FUNCTION_CALLING;

  @Enumerated(EnumType.STRING)
  @Column(name = "autonomy_level", length = 30)
  private AutonomyLevel autonomyLevel = AutonomyLevel.ASSISTANT;

  @Column(name = "default_model_id")
  private Long defaultModelId;

  @Column(name = "system_prompt", length = Constants.AGENT_SYSTEM_PROMPT_MAX_LENGTH)
  private String systemPrompt;

  @Column(name = "welcome_message", length = Constants.AGENT_WELCOME_MESSAGE_MAX_LENGTH)
  private String welcomeMessage;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "question")
  private List<String> suggestedQuestions = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "knowledge_base_id")
  private List<Long> knowledgeBaseIds = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tool_id")
  private List<String> toolIds = new ArrayList<>();

  @Column(name = "workflow_id")
  private Long workflowId;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "skill_id")
  private List<String> skillIds = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "dataset_id")
  private List<Long> datasetIds = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "api_collection_id")
  private List<Long> apiCollectionIds = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(name = "memory_strategy", length = 30)
  private MemoryStrategy memoryStrategy = MemoryStrategy.TOKEN_WINDOW;

  @Column(name = "memory_window_size")
  private Integer memoryWindowSize = Constants.AGENT_MEMORY_DEFAULT_WINDOW_SIZE;

  @Column(name = "memory_max_tokens")
  private Integer memoryMaxTokens = Constants.AGENT_MEMORY_DEFAULT_MAX_TOKENS;

  @Column(name = "memory_summary_prompt", columnDefinition = "TEXT")
  private String memorySummaryPrompt;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "input_guardrail_id")
  private List<String> inputGuardrailIds = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "output_guardrail_id")
  private List<String> outputGuardrailIds = new ArrayList<>();

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "variables")
  private Map<String, String> variables = new HashMap<>();

  @Override
  public Long identity() {
    return this.id;
  }

}
