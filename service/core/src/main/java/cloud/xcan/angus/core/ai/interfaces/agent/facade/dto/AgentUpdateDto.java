package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * 更新智能体请求参数（部分更新，仅传需更新字段）
 */
@Data
@Schema(description = "更新智能体请求参数")
public class AgentUpdateDto {

  @Size(max = 100)
  @Schema(description = "智能体名称")
  private String name;

  @Size(max = 500)
  @Schema(description = "描述")
  private String description;

  @Schema(description = "交互模式")
  private InteractionMode interactionMode;

  @Schema(description = "推理策略")
  private ReasoningStrategy reasoningStrategy;

  @Schema(description = "自治等级")
  private AutonomyLevel autonomyLevel;

  @Schema(description = "模型ID")
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
  private AgentCreateDto.ResourcesDto resources;

  @Schema(description = "记忆配置")
  private AgentCreateDto.MemoryDto memory;

  @Schema(description = "护栏配置")
  private AgentCreateDto.GuardrailsDto guardrails;

  @Schema(description = "变量注入")
  private Map<String, String> variables;
}
