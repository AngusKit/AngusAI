package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "资源共享查询参数")
public class ResourceSharingFindDto extends PageQuery {

  @Schema(description = "共享ID")
  private Long id;

  @Schema(description = "资源类型筛选")
  private ResourceType type;

  @Schema(description = "权限筛选")
  private SharePermission permission;

  @Schema(description = "共享范围筛选")
  private SharedWith sharedWith;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "排序字段", allowableValues = {"id", "type", "permission", "sharedWith",
      "createdDate"})
  private String orderBy = "createdDate";
}
