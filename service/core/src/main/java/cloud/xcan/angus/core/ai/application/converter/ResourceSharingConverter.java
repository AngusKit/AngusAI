package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharedWith;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingListVo;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 资源共享转换器
 */
public class ResourceSharingConverter {

  /**
   * 转换为列表VO
   */
  public static ResourceSharingListVo toListVo(ResourceSharing entity, Long memberCount) {
    ResourceSharingListVo vo = new ResourceSharingListVo();
    vo.setId(entity.getId());
    vo.setResourceId(entity.getResourceId());
    vo.setResourceName(entity.getResourceName());
    vo.setResourceType(entity.getResourceType());
    vo.setResourceTypeLabel(getResourceTypeLabel(entity.getResourceType()));
    vo.setOwnerId(entity.getOwnerId());
    vo.setSharedWith(entity.getSharedWith());
    vo.setSharedWithLabel(getSharedWithLabel(entity.getSharedWith()));
    vo.setMemberCount(memberCount != null ? memberCount : 0L);
    vo.setPermission(entity.getPermission());
    vo.setPermissionLabel(getPermissionLabel(entity.getPermission()));
    vo.setViews(entity.getTotalViews());
    vo.setEdits(entity.getTotalEdits());
    vo.setLastShared(formatTimeAgo(entity.getModifiedDate()));
    vo.setLastSharedAt(entity.getModifiedDate());
    vo.setCreatedDate(entity.getCreatedDate());
    return vo;
  }

  /**
   * 转换为详情VO
   */
  public static ResourceSharingDetailVo toDetailVo(
      ResourceSharing entity,
      List<ResourceSharingMember> members) {
    ResourceSharingDetailVo vo = new ResourceSharingDetailVo();
    vo.setId(entity.getId());
    vo.setResourceId(entity.getResourceId());
    vo.setResourceName(entity.getResourceName());
    vo.setResourceType(entity.getResourceType());
    vo.setResourceTypeLabel(getResourceTypeLabel(entity.getResourceType()));

    // 所有者信息
    ResourceSharingDetailVo.OwnerVo owner = new ResourceSharingDetailVo.OwnerVo();
    owner.setUserId(entity.getOwnerId());
    vo.setOwner(owner);

    vo.setSharedWith(entity.getSharedWith());
    vo.setSharedWithLabel(getSharedWithLabel(entity.getSharedWith()));
    vo.setPermission(entity.getPermission());
    vo.setPermissionLabel(getPermissionLabel(entity.getPermission()));
    vo.setMemberCount((long) (members != null ? members.size() : 0));

    // 成员列表
    if (members != null && !members.isEmpty()) {
      List<ResourceSharingDetailVo.MemberVo> memberVos = members.stream()
          .map(ResourceSharingConverter::toMemberVo)
          .collect(Collectors.toList());
      vo.setMembers(memberVos);
    } else {
      vo.setMembers(new ArrayList<>());
    }

    // 统计信息
    ResourceSharingDetailVo.StatisticsVo statistics = new ResourceSharingDetailVo.StatisticsVo();
    statistics.setTotalViews(entity.getTotalViews());
    statistics.setTotalEdits(entity.getTotalEdits());
    statistics.setUniqueVisitors(entity.getUniqueVisitors());

    // 计算平均访问次数
    if (entity.getUniqueVisitors() != null && entity.getUniqueVisitors() > 0) {
      statistics.setAvgAccessesPerUser(
          (double) entity.getTotalViews() / entity.getUniqueVisitors()
      );
    } else {
      statistics.setAvgAccessesPerUser(0.0);
    }

    vo.setStatistics(statistics);
    vo.setEnabled(entity.getEnabled());
    vo.setCreatedDate(entity.getCreatedDate());
    vo.setModifiedDate(entity.getModifiedDate());

    return vo;
  }

  /**
   * 转换成员为VO
   */
  private static ResourceSharingDetailVo.MemberVo toMemberVo(ResourceSharingMember member) {
    ResourceSharingDetailVo.MemberVo vo = new ResourceSharingDetailVo.MemberVo();
    vo.setUserId(member.getUserId());
    vo.setPermission(member.getPermission());
    vo.setPermissionLabel(getPermissionLabel(member.getPermission()));
    vo.setSharedAt(member.getCreatedDate());
    vo.setLastAccessed(member.getLastAccessed());
    vo.setAccessCount(member.getAccessCount());
    return vo;
  }

  /**
   * 获取资源类型标签
   */
  private static String getResourceTypeLabel(
      ResourceType type) {
    if (type == null) {
      return "";
    }
    switch (type) {
      case APPLICATION:
        return "应用";
      case WORKFLOW:
        return "工作流";
      case DATASET:
        return "数据集";
      case KNOWLEDGE:
        return "知识库";
      case MODEL:
        return "模型";
      default:
        return type.name();
    }
  }

  /**
   * 获取共享范围标签
   */
  private static String getSharedWithLabel(
      SharedWith sharedWith) {
    if (sharedWith == null) {
      return "";
    }
    switch (sharedWith) {
      case ALL:
        return "全体成员";
      case SPECIFIC:
        return "指定成员";
      default:
        return sharedWith.name();
    }
  }

  /**
   * 获取权限标签
   */
  private static String getPermissionLabel(
      SharePermission permission) {
    if (permission == null) {
      return "";
    }
    switch (permission) {
      case VIEW:
        return "查看";
      case EDIT:
        return "编辑";
      case MANAGE:
        return "管理";
      default:
        return permission.name();
    }
  }

  /**
   * 格式化时间为"xx分钟前"、"xx小时前"、"xx天前"
   */
  private static String formatTimeAgo(LocalDateTime dateTime) {
    if (dateTime == null) {
      return "";
    }

    LocalDateTime now = LocalDateTime.now();
    long minutes = ChronoUnit.MINUTES.between(dateTime, now);

    if (minutes < 1) {
      return "刚刚";
    } else if (minutes < 60) {
      return minutes + "分钟前";
    }

    long hours = ChronoUnit.HOURS.between(dateTime, now);
    if (hours < 24) {
      return hours + "小时前";
    }

    long days = ChronoUnit.DAYS.between(dateTime, now);
    if (days < 30) {
      return days + "天前";
    }

    long months = ChronoUnit.MONTHS.between(dateTime, now);
    if (months < 12) {
      return months + "个月前";
    }

    long years = ChronoUnit.YEARS.between(dateTime, now);
    return years + "年前";
  }
}
