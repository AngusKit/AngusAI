package cloud.xcan.angus.core.ai.domain.activity;


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

  private Long projectId;

  private Long userId;

  private String fullName;

  private String avatar;

  private Long targetId;

  private Long parentTargetId;

  private CombinedTargetType targetType;

  private String targetName;

  @JsonFormat(pattern = DEFAULT_DATE_TIME_FORMAT)
  private LocalDateTime optDate;

  private String description;

  private String detail;

}



