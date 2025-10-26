package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharedWith;
import cloud.xcan.angus.remote.NameJoinField;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "资源共享列表项")
public class ResourceSharingListVo {

  @Schema(description = "共享ID")
  private Long id;

  @Schema(description = "资源ID")
  private Long resourceId;

  @Schema(description = "资源名称")
  private String resourceName;

  @Schema(description = "资源类型")
  private ResourceType resourceType;

  @Schema(description = "资源类型标签")
  private String resourceTypeLabel;

  @Schema(description = "资源图标")
  private String icon;

  @Schema(description = "图标背景色")
  private String iconBg;

  @Schema(description = "图标颜色")
  private String iconColor;

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

  @Schema(description = "共享范围标签")
  private String sharedWithLabel;

  @Schema(description = "成员数量")
  private Long memberCount;

  @Schema(description = "权限")
  private SharePermission permission;

  @Schema(description = "权限标签")
  private String permissionLabel;

  @Schema(description = "访问次数")
  private Long views;

  @Schema(description = "编辑次数")
  private Long edits;

  @Schema(description = "最后共享时间描述")
  private String lastShared;

  @Schema(description = "最后共享时间")
  private LocalDateTime lastSharedAt;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;
}
