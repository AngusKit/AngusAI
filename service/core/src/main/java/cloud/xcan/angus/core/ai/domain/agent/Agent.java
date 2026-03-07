package cloud.xcan.angus.core.ai.domain.agent;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 智能体实体 — 用户可创建的智能体，持久化存储
 *
 * @see cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentDefinitionAssembler
 */
@Entity
@Table(name = "ai_agent")
@Setter
@Getter
@Accessors(chain = true)
public class Agent extends TenantAuditingEntity<Agent, Long> {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", length = 500)
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

  @Column(name = "model_id", nullable = false)
  private Long modelId;

  @Column(name = "system_prompt", columnDefinition = "TEXT")
  private String systemPrompt;

  @Column(name = "welcome_message", length = 1000)
  private String welcomeMessage;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_suggested_questions", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "question", length = 500)
  private List<String> suggestedQuestions = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_knowledge_base_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "knowledge_base_id")
  private List<Long> knowledgeBaseIds = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_tool_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "tool_id", length = 100)
  private List<String> toolIds = new ArrayList<>();

  @Column(name = "workflow_id")
  private Long workflowId;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_skill_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "skill_id", length = 100)
  private List<String> skillIds = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_dataset_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "dataset_id")
  private List<Long> datasetIds = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_api_collection_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "api_collection_id")
  private List<Long> apiCollectionIds = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(name = "memory_strategy", length = 30)
  private MemoryStrategy memoryStrategy = MemoryStrategy.TOKEN_WINDOW;

  @Column(name = "memory_window_size")
  private Integer memoryWindowSize = 20;

  @Column(name = "memory_max_tokens")
  private Integer memoryMaxTokens = 8000;

  @Column(name = "memory_summary_prompt", columnDefinition = "TEXT")
  private String memorySummaryPrompt;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_input_guardrail_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "guardrail_id", length = 100)
  private List<String> inputGuardrailIds = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_output_guardrail_ids", joinColumns = @JoinColumn(name = "agent_id"))
  @Column(name = "guardrail_id", length = 100)
  private List<String> outputGuardrailIds = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "ai_agent_variables", joinColumns = @JoinColumn(name = "agent_id"))
  @MapKeyColumn(name = "var_key", length = 100)
  @Column(name = "var_value", length = 2000)
  private Map<String, String> variables = new HashMap<>();

  @Override
  public Long identity() {
    return this.id;
  }

  /**
   * 获取 AgentRegistry 使用的 agentId（String）
   */
  public String getAgentId() {
    return id != null ? String.valueOf(id) : null;
  }
}
