package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新资源共享参数")
public class ResourceSharingUpdateDto {

  @Schema(description = "共享范围")
  private SharedWith sharedWith;

  @Schema(description = "权限")
  private SharePermission permission;

  @Schema(description = "成员ID列表")
  private List<Long> memberIds;

}
