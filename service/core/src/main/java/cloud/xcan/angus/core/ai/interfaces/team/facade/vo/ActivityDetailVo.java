package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;


import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.team.activity.ActionType;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityStatus;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;


@Setter
@Getter
@Accessors(chain = true)
public class ActivityDetailVo {

  private Long id;

  private Long userId;

  private String userName;

  private String userAvatar;

  // 头像占位符 "ZW"
  private String userAvatarFallback;

  private ActionType actionType;

  private ActivityStatus status;

  private Long resourceId;

  private FullResourceType resourceType;

  private String resourceName;

  private LocalDateTime activityDate;

  private String ipAddress;

  private String userAgent;

  private String description;

  private String detail;

}



