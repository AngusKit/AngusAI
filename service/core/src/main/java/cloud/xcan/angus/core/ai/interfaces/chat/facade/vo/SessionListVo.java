package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;
import lombok.Data;

/**
 * 会话列表VO
 */
@Data
@Schema(description = "会话列表视图")
public class SessionListVo {

  @Schema(description = "会话ID")
  private Long id;

  @Schema(description = "会话标题")
  private String title;

  @Schema(description = "关联的应用ID")
  private Long appId;

  @Schema(description = "应用名称")
  private String appName;

  @Schema(description = "使用的模型ID")
  private Long modelId;

  @Schema(description = "模型名称")
  private String modelName;

  @Schema(description = "最后一条消息")
  private LastMessage lastMessage;

  @Schema(description = "消息总数")
  private Integer messageCount;

  @Schema(description = "是否收藏")
  private Boolean isStarred;

  @Schema(description = "创建时间")
  private Date createdDate;

  @Schema(description = "最后修改时间")
  private Date modifiedDate;

  @Schema(description = "创建人ID")
  private Long createdBy;

  @Schema(description = "创建人姓名")
  private String createdByName;

  @Data
  @Schema(description = "最后一条消息")
  public static class LastMessage {

    @Schema(description = "消息角色")
    private MessageRole role;

    @Schema(description = "消息摘要")
    private String content;

    @Schema(description = "消息时间")
    private Long datetime;
  }
}
