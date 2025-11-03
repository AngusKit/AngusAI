package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "访问权限检查结果")
public class ResourceAccessCheckVo {

  @Schema(description = "是否有访问权限")
  private Boolean hasAccess;

  @Schema(description = "权限")
  private SharePermission permission;

  @Schema(description = "是否所有者")
  private Boolean isOwner;

  @Schema(description = "共享者ID")
  private Long sharedBy;

  @Schema(description = "共享者姓名")
  private String sharedByName;

  @Schema(description = "共享时间")
  private Long sharedAt;
}
