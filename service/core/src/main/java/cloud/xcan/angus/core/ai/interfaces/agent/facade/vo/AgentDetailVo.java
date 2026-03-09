package cloud.xcan.angus.core.ai.interfaces.agent.facade.vo;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "智能体详情")
public class AgentDetailVo extends TenantAuditingVo {

  @Schema(description = "智能体ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "状态")
  private AgentStatus status;

  @Schema(description = "交互模式")
  private InteractionMode interactionMode;

  @Schema(description = "推理策略")
  private ReasoningStrategy reasoningStrategy;

  @Schema(description = "自治等级")
  private AutonomyLevel autonomyLevel;

  @Schema(description = "默认模型ID")
  private Long defaultModelId;

  @Schema(description = "系统提示词")
  private String systemPrompt;

  @Schema(description = "欢迎消息")
  private String welcomeMessage;

  @Schema(description = "建议问题列表")
  private List<String> suggestedQuestions;

  @Schema(description = "知识库ID列表")
  private List<Long> knowledgeBaseIds;

  @Schema(description = "工具ID列表")
  private List<String> toolIds;

  @Schema(description = "工作流ID")
  private Long workflowId;

  @Schema(description = "技能ID列表")
  private List<String> skillIds;

  @Schema(description = "数据集ID列表")
  private List<Long> datasetIds;

  @Schema(description = "接口集ID列表")
  private List<Long> apiCollectionIds;

  @Schema(description = "记忆策略")
  private MemoryStrategy memoryStrategy;

  @Schema(description = "记忆窗口大小")
  private Integer memoryWindowSize;

  @Schema(description = "记忆最大Token数")
  private Integer memoryMaxTokens;

  @Schema(description = "摘要提示词")
  private String memorySummaryPrompt;

  @Schema(description = "输入护栏ID列表")
  private List<String> inputGuardrailIds;

  @Schema(description = "输出护栏ID列表")
  private List<String> outputGuardrailIds;

  @Schema(description = "变量")
  private Map<String, String> variables;
}
