package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;


import cloud.xcan.angus.api.commonlink.FullResourceType;
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

  private FullResourceType targetType;

  private String targetName;

  private LocalDateTime activityDate;

  private String description;

  private String detail;

}



