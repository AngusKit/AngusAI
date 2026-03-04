package cloud.xcan.angus.core.ai.interfaces.activity.facade.dto;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.activity.ActionType;
import cloud.xcan.angus.core.ai.domain.activity.ActivityStatus;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

@EqualsAndHashCode(callSuper = true)
@Data
public class ActivityFindDto extends PageQuery {

  @Schema(description = "Activity record identifier")
  private Long id;

  @Schema(description = "Target resource identifier")
  private Long resourceId;

  @Schema(description = "Target resource type for activity categorization")
  private FullResourceType resourceType;

  @Schema(description = "User identifier who performed the operation")
  private Long userId;

  @Schema(description = "Activity action type")
  private ActionType actionType;

  @Schema(description = "Activity status")
  private ActivityStatus status;

  @Schema(description = "Associated Tenant ID", example = "1")
  private Long tenantId;

  @DateTimeFormat(pattern = DATE_FMT)
  @Schema(description = "Activity date")
  private LocalDateTime activityDate;

  @Schema(description = "Sort field", example = "activityDate",
      allowableValues = {"id", "activityDate", "resourceType", "actionType", "status"})
  private String orderBy = "activityDate";

  @Override
  public String getDefaultOrderBy() {
    return "activityDate";
  }
}
