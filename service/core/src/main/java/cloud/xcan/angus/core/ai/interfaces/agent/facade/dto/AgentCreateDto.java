package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "创建智能体请求参数")
public class AgentCreateDto {

  @NotBlank
  @Size(max = MAX_NAME_LENGTH)
  @Schema(description = "智能体名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @Size(max = MAX_DESC_LENGTH)
  @Schema(description = "描述")
  private String description;

  @Schema(description = "交互模式", example = "CHATBOT")
  private InteractionMode interactionMode = InteractionMode.CHATBOT;

  @Schema(description = "推理策略", example = "FUNCTION_CALLING")
  private ReasoningStrategy reasoningStrategy = ReasoningStrategy.FUNCTION_CALLING;

  @Schema(description = "自治等级", example = "ASSISTANT")
  private AutonomyLevel autonomyLevel = AutonomyLevel.ASSISTANT;

  @NotNull
  @Schema(description = "模型ID", requiredMode = RequiredMode.REQUIRED)
  private Long modelId;

  @Schema(description = "系统提示词")
  private String systemPrompt;

  @Size(max = 1000)
  @Schema(description = "欢迎消息")
  private String welcomeMessage;

  @Size(max = 10)
  @Schema(description = "建议问题列表")
  private List<String> suggestedQuestions;

  @Schema(description = "关联资源")
  private ResourcesDto resources;

  @Schema(description = "记忆配置")
  private MemoryDto memory;

  @Schema(description = "护栏配置")
  private GuardrailsDto guardrails;

  @Schema(description = "变量注入")
  private Map<String, String> variables;

  @Data
  @Schema(description = "关联资源")
  public static class ResourcesDto {
    @Size(max = 5)
    @Schema(description = "知识库ID列表")
    private List<Long> knowledgeBaseIds;
    @Size(max = 20)
    @Schema(description = "工具ID列表")
    private List<String> toolIds;
    @Schema(description = "工作流ID")
    private Long workflowId;
    @Size(max = 20)
    @Schema(description = "技能ID列表")
    private List<String> skillIds;
    @Size(max = 5)
    @Schema(description = "数据集ID列表")
    private List<Long> datasetIds;
    @Size(max = 5)
    @Schema(description = "接口集ID列表")
    private List<Long> apiCollectionIds;
  }

  @Data
  @Schema(description = "记忆配置")
  public static class MemoryDto {
    @Schema(description = "策略")
    private MemoryStrategy strategy = MemoryStrategy.TOKEN_WINDOW;
    @Schema(description = "窗口大小")
    private Integer windowSize = 20;
    @Schema(description = "最大Token数")
    private Integer maxTokens = 8000;
    @Schema(description = "摘要提示词")
    private String summaryPrompt;
  }

  @Data
  @Schema(description = "护栏配置")
  public static class GuardrailsDto {
    @Schema(description = "输入护栏ID列表")
    private List<String> inputGuardrailIds;
    @Schema(description = "输出护栏ID列表")
    private List<String> outputGuardrailIds;
  }
}
