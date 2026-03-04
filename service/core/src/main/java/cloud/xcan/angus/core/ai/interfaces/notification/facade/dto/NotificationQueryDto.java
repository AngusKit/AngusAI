package cloud.xcan.angus.core.ai.interfaces.notification.facade.dto;

import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationPriority;
import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationType;
import cloud.xcan.angus.remote.PageQuery;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "查询通知请求参数")
public class NotificationQueryDto extends PageQuery {

  @Schema(description = "通知ID")
  private Long id;

  @Schema(description = "通知标题")
  private String title;

  @Schema(description = "消息分类")
  private String category;

  @Schema(description = "来源筛选")
  private String source;

  @Schema(description = "已读状态筛选")
  private Boolean isRead;

  @Schema(description = "星标状态筛选")
  private Boolean isStarred;

  @Schema(description = "归档状态筛选")
  private Boolean isArchived;

  @Schema(description = "类型筛选")
  private NotificationType type;

  @Schema(description = "优先级筛选")
  private NotificationPriority priority;

  @JsonIgnore
  @Schema(description = "接收用户ID", hidden = true)
  private Long targetUserId;

  @Override
  public String getDefaultOrderBy() {
    return "timestamp";
  }
}
