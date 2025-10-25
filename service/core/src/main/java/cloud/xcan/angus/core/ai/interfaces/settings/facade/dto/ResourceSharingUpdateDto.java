package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.Permission;
import cloud.xcan.angus.core.ai.domain.settings.SharedWith;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新资源共享参数")
public class ResourceSharingUpdateDto {

  @Schema(description = "共享范围")
  private SharedWith sharedWith;

  @Schema(description = "权限")
  private Permission permission;

  @Schema(description = "成员ID列表")
  private List<Long> memberIds;

  @Schema(description = "是否通知成员", defaultValue = "true")
  private Boolean notifyMembers = true;
}
