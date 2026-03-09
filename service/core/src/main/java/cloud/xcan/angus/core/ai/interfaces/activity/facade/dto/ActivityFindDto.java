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

  @Schema(description = "活动记录ID")
  private Long id;

  @Schema(description = "关联资源ID")
  private Long resourceId;

  @Schema(description = "关联资源类型，用于按资源分类筛选")
  private FullResourceType resourceType;

  @Schema(description = "操作用户ID")
  private Long userId;

  @Schema(description = "操作类型")
  private ActionType actionType;

  @Schema(description = "活动状态")
  private ActivityStatus status;

  @DateTimeFormat(pattern = DATE_FMT)
  @Schema(description = "活动日期")
  private LocalDateTime activityDate;

  @Schema(description = "排序字段", example = "activityDate",
      allowableValues = {"id", "activityDate", "resourceType", "actionType", "status"})
  private String orderBy = "activityDate";

  @Override
  public String getDefaultOrderBy() {
    return "activityDate";
  }
}
