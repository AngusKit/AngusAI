package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "智能体对话请求")
public class AgentChatRequestDto {

  @NotNull
  @Schema(description = "智能体ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
  private Long agentId;

  @Schema(description = "会话ID(UUID)，用于多轮对话记忆与 Session/Message 关联，不传则由业务层初始化", example = "550e8400-e29b-41d4-a716-446655440000")
  private String sessionId;

  @NotBlank
  @Schema(description = "用户消息", requiredMode = Schema.RequiredMode.REQUIRED, example = "你好")
  private String message;

  @Schema(description = "对话配置覆盖，可选；优先级高于会话与智能体配置")
  private SessionConfig config;

}
