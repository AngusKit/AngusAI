package cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.sharing.SharedWith;
import cloud.xcan.angus.remote.NameJoinField;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "资源共享列表项")
public class ResourceSharingListVo extends TenantAuditingVo {

  @Schema(description = "共享ID")
  private Long id;

  @Schema(description = "资源ID")
  private Long resourceId;

  @Schema(description = "资源名称")
  private String resourceName;

  @Schema(description = "资源类型")
  private ResourceType resourceType;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "所有者ID")
  private Long ownerId;

  @Schema(description = "所有者姓名")
  @NameJoinField(id = "ownerId", repository = "commonUserBaseRepo")
  private String ownerName;

  @Schema(description = "所有者邮箱")
  private String ownerEmail;

  @Schema(description = "所有者头像")
  private String ownerAvatar;

  @Schema(description = "共享范围")
  private SharedWith sharedWith;

  @Schema(description = "成员数量")
  private Integer memberCount;

  @Schema(description = "权限")
  private SharePermission permission;

  @Schema(description = "访问次数")
  private Long views;

  @Schema(description = "编辑次数")
  private Long edits;

}
