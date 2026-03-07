package cloud.xcan.angus.core.ai.interfaces.agent.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 智能体对话响应
 */
@Data
@Schema(description = "智能体对话响应")
public class AgentChatResponseVo {

  @Schema(description = "智能体ID")
  private Long agentId;

  @Schema(description = "会话ID")
  private String sessionId;

  @Schema(description = "智能体回复内容")
  private String reply;

  @Schema(description = "响应耗时（毫秒）")
  private Long latencyMs;
}
