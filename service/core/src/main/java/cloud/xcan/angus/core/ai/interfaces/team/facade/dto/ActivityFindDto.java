package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH_X2;

import cloud.xcan.angus.api.commonlink.CombinedTargetType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
@Accessors(chain = true)
public class ActivityFindDto extends PageQuery {

  @Schema(description = "Activity record identifier")
  private Long id;

  @Schema(description = "Target resource identifier")
  private Long targetId;

  @Schema(description = "Target resource type for activity categorization")
  private CombinedTargetType targetType;

  @Schema(description = "User identifier who performed the operation")
  private Long userId;

  @Length(max = MAX_NAME_LENGTH_X2)
  @Schema(description = "Activity detail content for full-text search")
  private String detail;

  @DateTimeFormat(pattern = DATE_FMT)
  @Schema(description = "Activity date")
  private LocalDateTime activityDate;

  @Override
  public String getDefaultOrderBy() {
    return "activityDate";
  }
}
