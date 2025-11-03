package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import cloud.xcan.angus.remote.NameJoinField;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "资源共享详情")
public class ResourceSharingDetailVo extends TenantAuditingVo{

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

  @Schema(description = "所有者信息")
  private OwnerVo owner;

  @Schema(description = "共享范围")
  private SharedWith sharedWith;

  @Schema(description = "默认权限")
  private SharePermission permission;

  @Schema(description = "成员数量")
  private Long memberCount;

  @Schema(description = "共享成员列表")
  private List<MemberVo> members;

  @Data
  @Schema(description = "所有者信息")
  public static class OwnerVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    private String userName;

    @Schema(description = "头像")
    private String avatar;
  }

  @Data
  @Schema(description = "成员信息")
  public static class MemberVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    private String userName;

    @Schema(description = "头像")
    private String userAvatar;

    @Schema(description = "权限")
    private SharePermission permission;

    @Schema(description = "共享时间")
    private LocalDateTime sharedAt;

    @Schema(description = "最后访问时间")
    private LocalDateTime lastAccessed;

    @Schema(description = "访问次数")
    private Long accessCount;
  }

}
