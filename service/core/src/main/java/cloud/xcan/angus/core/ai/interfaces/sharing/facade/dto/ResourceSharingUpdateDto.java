package cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto;

import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.sharing.SharedWith;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新资源共享参数")
public class ResourceSharingUpdateDto {

  @NotNull
  @Schema(description = "共享范围", requiredMode = RequiredMode.REQUIRED)
  private SharedWith sharedWith;

  @NotNull
  @Schema(description = "权限", requiredMode = RequiredMode.REQUIRED)
  private SharePermission permission;

  @Schema(description = "成员ID列表")
  private List<Long> memberIds;

}
