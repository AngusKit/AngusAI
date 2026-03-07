package cloud.xcan.agentx.core.agent.definition;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.agentx.core.model.ModelProvider;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent 声明式定义 — 对应 YAML/JSON 配置文件
 */
@Schema(description = "Agent 声明式定义，用于创建/导入 Agent 的 YAML/JSON 配置")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentDefinition {

  @Schema(description = "唯一标识")
  private String id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "版本")
  private String version;

  @Schema(description = "交互模式：CHATBOT/COMPLETION/WORKFLOW/AGENT_AS_API/MULTI_TURN_TASK")
  @Builder.Default
  private InteractionMode interactionMode = InteractionMode.CHATBOT;

  @Schema(description = "推理策略：SIMPLE_LLM/FUNCTION_CALLING/REACT/PLAN_AND_EXECUTE/MULTI_AGENT")
  @Builder.Default
  private ReasoningStrategy reasoningStrategy = ReasoningStrategy.FUNCTION_CALLING;

  @Schema(description = "自治等级：TOOL/ASSISTANT/COLLABORATOR/DELEGATE/AUTONOMOUS")
  @Builder.Default
  private AutonomyLevel autonomyLevel = AutonomyLevel.ASSISTANT;

  @Schema(description = "模型配置")
  private ModelConfig model;

  @Schema(description = "系统提示词")
  private String systemPrompt;

  @Schema(description = "开场白")
  private String welcomeMessage;

  @Schema(description = "建议问题列表")
  private List<String> suggestedQuestions;

  @Schema(description = "绑定的工作流 ID")
  private Long workflowId;

  @Schema(description = "工作流触发策略（仅当 workflowId 非空时生效）")
  private WorkflowTriggerConfig workflowTrigger;

  @Schema(description = "绑定的工具 ID 列表")
  private List<String> toolIds;

  @Schema(description = "绑定的技能名称列表（对应 LangChain4j Skill.name()）")
  private List<String> skillIds;

  @Schema(description = "绑定的知识库 ID 列表")
  private List<String> knowledgeBaseIds;

  @Schema(description = "绑定的数据集 ID 列表")
  private List<String> datasetIds;

  @Schema(description = "绑定的 OpenAPI 定义 ID 列表")
  private List<String> openApiIds;

  @Schema(description = "记忆策略配置")
  private MemoryConfig memory;

  @Schema(description = "护栏配置")
  private GuardrailConfig guardrails;

  @Schema(description = "变量与上下文注入映射")
  private Map<String, String> variables;

  @Schema(description = "多渠道发布配置")
  private List<String> publishChannels;

  @Schema(description = "租户 ID")
  private String tenantId;

  @Schema(description = "模型配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ModelConfig {

    @Schema(description = "模型提供商：OPEN_AI/ANTHROPIC/OLLAMA/GEMINI/QWEN/ZHIPU/DEEPSEEK 等")
    private ModelProvider provider;
    @Schema(description = "模型名称，如 gpt-4、claude-3")
    private String modelName;
    @Schema(description = "温度参数，0-2")
    @Builder.Default
    private Double temperature = 0.7;
    @Schema(description = "最大 Token 数")
    @Builder.Default
    private Integer maxTokens = 4096;
    @Schema(description = "降级时的备用提供商")
    private ModelProvider fallbackProvider;
    @Schema(description = "降级时的备用模型名")
    private String fallbackModelName;
  }

  @Schema(description = "记忆策略配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class MemoryConfig {

    @Schema(description = "策略：NONE/MESSAGE_WINDOW/TOKEN_WINDOW/SUMMARY")
    @Builder.Default
    private MemoryStrategy strategy = MemoryStrategy.TOKEN_WINDOW;
    @Schema(description = "消息窗口大小（条数），用于 MESSAGE_WINDOW/SUMMARY")
    @Builder.Default
    private Integer windowSize = 20;
    @Schema(description = "Token 上限，用于 TOKEN_WINDOW")
    @Builder.Default
    private Integer maxTokens = 8000;
    @Schema(description = "SUMMARY 策略的摘要提示词，可用 {{messages}} 占位符")
    private String summaryPrompt;
  }

  @Schema(description = "护栏配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class GuardrailConfig {

    @Schema(description = "输入护栏 ID 列表")
    private List<String> inputGuardrailIds;
    @Schema(description = "输出护栏 ID 列表")
    private List<String> outputGuardrailIds;
  }

  @Schema(description = "工作流触发策略")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class WorkflowTriggerConfig {

    @Schema(description = "模式：BEFORE_CHAT=LLM 前执行 | AFTER_CHAT=LLM 后执行 | INSTEAD_OF_CHAT=替代 LLM")
    @Builder.Default
    private String mode = "AFTER_CHAT";
  }
}
