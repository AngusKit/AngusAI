package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.MessageUsage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 消息VO
 */
@Data
@Schema(description = "消息视图")
public class MessageVo {

  @Schema(description = "消息ID")
  private Long id;

  @Schema(description = "会话ID")
  private Long sessionId;

  @Schema(description = "消息角色")
  private MessageRole role;

  @Schema(description = "消息内容")
  private String content;

  @Schema(description = "附件列表")
  private List<MessageAttachment> attachments;

  @Schema(description = "使用统计（仅AI消息）")
  private MessageUsage usage;

  @Schema(description = "消息时间")
  private Long datetime;

  @Schema(description = "是否正在流式生成")
  private Boolean isStreaming;
}
