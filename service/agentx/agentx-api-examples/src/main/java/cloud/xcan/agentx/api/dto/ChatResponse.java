package cloud.xcan.agentx.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "Agent 对话响应")
@Data
public class ChatResponse {

  @Schema(description = "Agent 唯一标识")
  private String agentId;

  @Schema(description = "会话 ID")
  private String sessionId;

  @Schema(description = "Agent 回复内容")
  private String reply;

  @Schema(description = "响应耗时（毫秒）")
  private long latencyMs;
}
