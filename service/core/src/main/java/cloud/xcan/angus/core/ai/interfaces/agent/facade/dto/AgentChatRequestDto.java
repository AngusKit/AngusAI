package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 智能体对话请求
 */
@Data
@Schema(description = "智能体对话请求")
public class AgentChatRequestDto {

  @NotNull
  @Schema(description = "智能体ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
  private Long agentId;

  @NotBlank
  @Schema(description = "用户消息", requiredMode = Schema.RequiredMode.REQUIRED, example = "你好")
  private String message;

  @Schema(description = "会话ID，用于多轮对话记忆，不传则使用 default", example = "session-123")
  private String sessionId;
}
