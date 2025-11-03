package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "资源共享查询参数")
public class ResourceSharingFindDto extends PageQuery {

  @Schema(description = "资源类型筛选")
  private ResourceType type;

  @Schema(description = "权限筛选")
  private SharePermission permission;

  @Schema(description = "共享范围筛选")
  private SharedWith sharedWith;

  @Override
  public String getDefaultOrderBy() {
    return "modifiedDate";
  }
}
