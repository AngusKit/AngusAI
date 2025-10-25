package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 发送消息响应VO
 */
@Data
@Schema(description = "发送消息响应")
public class MessageSendVo {

  @Schema(description = "用户消息")
  private MessageVo userMsg;

  @Schema(description = "AI响应消息")
  private MessageVo assistantMsg;
}
