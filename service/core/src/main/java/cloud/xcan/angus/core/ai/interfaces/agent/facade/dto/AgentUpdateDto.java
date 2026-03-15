package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_ENCODING_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_SUGGESTED_QUESTIONS_MAX_SIZE;
import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_SYSTEM_PROMPT_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_WELCOME_MESSAGE_MAX_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "更新智能体请求参数")
public class AgentUpdateDto {

  @NotBlank
  @Size(max = MAX_NAME_LENGTH)
  @Schema(description = "智能体名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Size(max = AGENT_ENCODING_MAX_LENGTH)
  @Schema(description = "智能体编码，唯一标识，不超过80字符", requiredMode = RequiredMode.REQUIRED)
  private String encoding;

  @Size(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "描述")
  private String description;

  @Schema(description = "交互模式", example = "CHATBOT")
  private InteractionMode interactionMode = InteractionMode.CHATBOT;

  @Schema(description = "推理策略", example = "FUNCTION_CALLING")
  private ReasoningStrategy reasoningStrategy = ReasoningStrategy.FUNCTION_CALLING;

  @Schema(description = "自治等级", example = "ASSISTANT")
  private AutonomyLevel autonomyLevel = AutonomyLevel.ASSISTANT;

  @Schema(description = "默认模型ID，可选")
  private Long defaultModelId;

  @Size(max = AGENT_SYSTEM_PROMPT_MAX_LENGTH)
  @Schema(description = "系统提示词")
  private String systemPrompt;

  @Size(max = AGENT_WELCOME_MESSAGE_MAX_LENGTH)
  @Schema(description = "欢迎消息")
  private String welcomeMessage;

  @Size(max = AGENT_SUGGESTED_QUESTIONS_MAX_SIZE)
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
