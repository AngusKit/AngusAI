package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "创建资源共享参数")
public class ResourceSharingCreateDto {

  @NotNull
  @Schema(description = "资源ID", requiredMode = RequiredMode.REQUIRED)
  private Long resourceId;

  @NotNull
  @Schema(description = "资源类型", requiredMode = RequiredMode.REQUIRED)
  private ResourceType resourceType;

  @NotNull
  @Schema(description = "共享范围（all-全体成员，specific-指定成员）", requiredMode = RequiredMode.REQUIRED)
  private SharedWith sharedWith;

  @NotNull
  @Schema(description = "权限（view-查看，edit-编辑，manage-管理）", requiredMode = RequiredMode.REQUIRED)
  private SharePermission permission;

  @Schema(description = "指定成员ID列表（sharedWith为specific时必填）")
  private List<Long> memberIds;

}
