package cloud.xcan.angus.core.ai.interfaces.notification.facade.vo;

import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationPriority;
import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "通知详情")
public class NotificationDetailVo {

  @Schema(description = "通知ID")
  private Long id;

  @Schema(description = "通知类型：SUCCESS, WARNING, INFO")
  private NotificationType type;

  @Schema(description = "通知标题")
  private String title;

  @Schema(description = "通知描述")
  private String description;

  @Schema(description = "分类")
  private String category;

  @Schema(description = "是否已读")
  private Boolean isRead;

  @Schema(description = "是否星标")
  private Boolean isStarred;

  @Schema(description = "是否归档")
  private Boolean isArchived;

  @Schema(description = "优先级：HIGH, MEDIUM, LOW")
  private NotificationPriority priority;

  @Schema(description = "通知时间")
  private LocalDateTime timestamp;
}
