package cloud.xcan.angus.core.ai.interfaces.activity.facade.vo;


import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.activity.ActionType;
import cloud.xcan.angus.core.ai.domain.activity.ActivityStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;


/**
 * 活动详情视图对象
 */
@Schema(description = "活动详情")
@Setter
@Getter
@Accessors(chain = true)
public class ActivityDetailVo {

  @Schema(description = "活动记录主键ID")
  private Long id;

  @Schema(description = "操作用户ID")
  private Long userId;

  @Schema(description = "操作用户名称")
  private String userName;

  @Schema(description = "操作用户头像URL")
  private String userAvatar;

  @Schema(description = "头像占位符，如用户 initials \"ZW\"")
  private String userAvatarFallback;

  @Schema(description = "操作类型：CREATE/UPDATE/DELETE/VIEW 等")
  private ActionType actionType;

  @Schema(description = "活动状态：SUCCESS/FAILED/WARNING/PENDING")
  private ActivityStatus status;

  @Schema(description = "关联资源ID")
  private Long resourceId;

  @Schema(description = "关联资源类型")
  private FullResourceType resourceType;

  @Schema(description = "关联资源名称")
  private String resourceName;

  @Schema(description = "活动发生时间")
  private LocalDateTime activityDate;

  @Schema(description = "客户端 IP 地址")
  private String ipAddress;

  @Schema(description = "客户端 User-Agent")
  private String userAgent;

  @Schema(description = "活动简要描述")
  private String description;

  @Schema(description = "活动详细信息（JSON 或富文本）")
  private String detail;

}



