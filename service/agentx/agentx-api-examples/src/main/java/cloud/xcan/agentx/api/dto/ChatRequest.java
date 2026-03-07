package cloud.xcan.agentx.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import lombok.Data;

@Schema(description = "Agent 对话请求")
@Data
public class ChatRequest {

  @Schema(description = "Agent 唯一标识", requiredMode = Schema.RequiredMode.REQUIRED, example = "agent-001")
  @NotBlank
  private String agentId;

  @Schema(description = "用户消息", requiredMode = Schema.RequiredMode.REQUIRED, example = "你好")
  @NotBlank
  private String message;

  @Schema(description = "会话 ID，用于多轮对话记忆，不传则使用 default", example = "session-123")
  private String sessionId;

  @Schema(description = "变量与上下文注入")
  private Map<String, Object> variables;
}
