package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharedWith;
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

  @Schema(description = "是否只显示我创建的")
  private Boolean ownedByMe;

  @Schema(description = "是否只显示共享给我的")
  private Boolean sharedToMe;

  @Override
  public String getDefaultOrderBy() {
    return "modifiedDate";
  }
}
