package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "访问权限检查结果")
public class ResourceAccessCheckVo {

  @Schema(description = "是否有访问权限")
  private Boolean hasAccess;

  @Schema(description = "资源授权权限列表")
  private List<SharePermission> resourcePermissions;

  @Schema(description = "授权用户ID")
  private Long userId;

  @Schema(description = "授权用户名称")
  private String userName;
}
