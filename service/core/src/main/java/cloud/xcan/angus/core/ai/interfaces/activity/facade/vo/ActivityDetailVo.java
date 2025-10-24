package cloud.xcan.angus.core.ai.interfaces.activity.facade.vo;


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

  private Long projectId;

  private String projectName;

  private Long userId;

  private String fullName;

  private String avatar;

  private Long targetId;

  private Long parentTargetId;

  private CombinedTargetType targetType;

  private String targetName;

  private LocalDateTime optDate;

  private String description;

  private String detail;

}



