package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;


import cloud.xcan.angus.api.commonlink.CombinedTargetType;
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

  private Long targetId;

  private CombinedTargetType targetType;

  private String targetName;

  private LocalDateTime activityDate;

  private String description;

  private String detail;

}



