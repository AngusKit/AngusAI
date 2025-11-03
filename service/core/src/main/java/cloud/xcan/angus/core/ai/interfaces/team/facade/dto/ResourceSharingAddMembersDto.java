package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "批量添加成员参数")
public class ResourceSharingAddMembersDto {

  @NotEmpty
  @Schema(description = "成员ID列表", requiredMode = RequiredMode.REQUIRED)
  private List<Long> memberIds;

  @Schema(description = "权限（默认继承共享设置）")
  private SharePermission permission;

  @Schema(description = "是否通知成员", defaultValue = "true")
  private Boolean notifyMembers = true;

  @Schema(description = "通知消息")
  private String message;
}
