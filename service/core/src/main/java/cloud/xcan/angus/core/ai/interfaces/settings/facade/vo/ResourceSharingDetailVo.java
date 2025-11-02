package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharedWith;
import cloud.xcan.angus.remote.NameJoinField;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "资源共享详情")
public class ResourceSharingDetailVo {

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

  @Schema(description = "所有者信息")
  private OwnerVo owner;

  @Schema(description = "共享范围")
  private SharedWith sharedWith;

  @Schema(description = "共享范围标签")
  private String sharedWithLabel;

  @Schema(description = "默认权限")
  private SharePermission permission;

  @Schema(description = "权限标签")
  private String permissionLabel;

  @Schema(description = "成员数量")
  private Long memberCount;

  @Schema(description = "共享成员列表")
  private List<MemberVo> members;

  @Schema(description = "统计信息")
  private StatisticsVo statistics;

  @Schema(description = "最近活动")
  private List<RecentActivityVo> recentActivities;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改时间")
  private LocalDateTime modifiedDate;

  @Data
  @Schema(description = "所有者信息")
  public static class OwnerVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    @NameJoinField(id = "userId", repository = "commonUserBaseRepo")
    private String userName;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "头像")
    private String avatar;
  }

  @Data
  @Schema(description = "成员信息")
  public static class MemberVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    @NameJoinField(id = "userId", repository = "commonUserBaseRepo")
    private String userName;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "权限")
    private SharePermission permission;

    @Schema(description = "权限标签")
    private String permissionLabel;

    @Schema(description = "共享时间")
    private LocalDateTime sharedAt;

    @Schema(description = "最后访问时间")
    private LocalDateTime lastAccessed;

    @Schema(description = "访问次数")
    private Long accessCount;
  }

  @Data
  @Schema(description = "统计信息")
  public static class StatisticsVo {

    @Schema(description = "总访问次数")
    private Long totalViews;

    @Schema(description = "总编辑次数")
    private Long totalEdits;

    @Schema(description = "独立访客数")
    private Long uniqueVisitors;

    @Schema(description = "平均每用户访问次数")
    private Double avgAccessesPerUser;

    @Schema(description = "访问趋势")
    private List<ViewTrendVo> viewTrend;

    @Data
    @Schema(description = "访问趋势")
    public static class ViewTrendVo {

      @Schema(description = "日期")
      private String date;

      @Schema(description = "访问次数")
      private Long views;

      @Schema(description = "用户数")
      private Long users;
    }
  }

  @Data
  @Schema(description = "最近活动")
  public static class RecentActivityVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    @NameJoinField(id = "userId", repository = "commonUserBaseRepo")
    private String userName;

    @Schema(description = "操作")
    private String action;

    @Schema(description = "操作标签")
    private String actionLabel;

    @Schema(description = "操作时间")
    private LocalDateTime datetime;
  }
}
