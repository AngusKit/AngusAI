package cloud.xcan.angus.core.ai.domain.team.activity;


import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DEFAULT_DATE_TIME_FORMAT;

import cloud.xcan.angus.api.commonlink.CombinedTargetType;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;


@Setter
@Getter
@Accessors(chain = true)
public class ActivitySummary {

  private Long id;

  private Long userId;

  private String userName;

  private String userAvatar;

  private Long targetId;

  private CombinedTargetType targetType;

  private String targetName;

  @JsonFormat(pattern = DEFAULT_DATE_TIME_FORMAT)
  private LocalDateTime activityDate;

  private String description;

  private String detail;

}



