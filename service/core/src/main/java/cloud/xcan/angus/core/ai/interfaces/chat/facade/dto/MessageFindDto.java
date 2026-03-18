package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询消息请求")
public class MessageFindDto extends PageQuery {

  @Schema(description = "消息ID")
  private Long id;

  @Schema(description = "会话ID")
  private String sessionId;

  @Schema(description = "所属会话实体 ID")
  private Long sessionEntityId;

  @Schema(description = "消息角色")
  private MessageRole role;

  @Schema(description = "是否正在流式生成")
  private Boolean isStreaming;

  @Schema(description = "反馈类型：like或dislike", allowableValues = {"like", "dislike"})
  private String feedbackType;

}
