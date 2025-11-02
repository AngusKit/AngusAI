package cloud.xcan.angus.core.ai.interfaces.team.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingCmd;
import cloud.xcan.angus.core.ai.application.converter.ResourceSharingConverter;
import cloud.xcan.angus.core.ai.application.query.team.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.team.facade.ResourceSharingFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingAccessDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingAddMembersDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * 资源共享门面实现
 */
@Service
public class ResourceSharingFacadeImpl implements ResourceSharingFacade {

  @Resource
  private ResourceSharingCmd resourceSharingCmd;

  @Resource
  private ResourceSharingQuery resourceSharingQuery;

  @Override
  public ResourceSharingDetailVo create(ResourceSharingCreateDto dto) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 执行创建命令
    ResourceSharing sharing = resourceSharingCmd.create(dto, userId);

    // 获取成员列表
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(sharing.getId());

    // 转换为VO
    return ResourceSharingConverter.toDetailVo(sharing, members);
  }

  @Override
  public ResourceSharingDetailVo update(Long id, ResourceSharingUpdateDto dto) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 执行更新命令
    ResourceSharing sharing = resourceSharingCmd.update(id, dto, userId);

    // 获取成员列表
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);

    // 转换为VO
    return ResourceSharingConverter.toDetailVo(sharing, members);
  }

  @Override
  public Map<String, Object> addMembers(Long id, ResourceSharingAddMembersDto dto) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 执行添加成员命令
    List<ResourceSharingMember> addedMembers = resourceSharingCmd.addMembers(
        id,
        dto.getMemberIds(),
        userId
    );

    // 构建返回结果
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("addedCount", addedMembers.size());
    result.put("members", addedMembers.stream().map(member -> {
      Map<String, Object> memberInfo = new HashMap<>();
      memberInfo.put("userId", member.getUserId());
      memberInfo.put("permission", member.getPermission());
      memberInfo.put("accessCount", member.getAccessCount());
      return memberInfo;
    }).toArray());

    // TODO: 如果需要通知成员，发送通知
    // if (Boolean.TRUE.equals(dto.getNotifyMembers())) {
    //   notificationService.notifyMembersAdded(id, addedMembers);
    // }

    return result;
  }

  @Override
  public void removeMember(Long id, Long userId) {
    // TODO: 从当前登录用户获取userId
    Long currentUserId = 1L;

    // 执行移除成员命令
    resourceSharingCmd.removeMember(id, userId, currentUserId);

    // TODO: 通知被移除的成员
    // notificationService.notifyMemberRemoved(id, userId);
  }

  @Override
  public void stopSharing(Long id) {

  }

  @Override
  public void recordAccess(Long id, ResourceSharingAccessDto dto) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 记录访问
    resourceSharingCmd.recordAccess(id, dto, userId);
  }

  @Override
  public void delete(Long id, Boolean notifyMembers) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 执行删除命令
    resourceSharingCmd.delete(id, userId);

    // TODO: 如果需要通知成员，发送通知
    // if (Boolean.TRUE.equals(notifyMembers)) {
    //   notificationService.notifyResourceSharingCancelled(id);
    // }
  }

  @Override
  public ResourceSharingDetailVo getDetail(Long id) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 查询详情
    ResourceSharing sharing = resourceSharingQuery.getDetail(id, userId);

    // 获取成员列表
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);

    // 转换为VO
    return ResourceSharingConverter.toDetailVo(sharing, members);
  }

  @Override
  public PageResult<ResourceSharingListVo> list(ResourceSharingFindDto dto) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 查询列表
    Page<ResourceSharing> page = resourceSharingQuery.list(dto, userId);

    // 转换为VO
    Page<ResourceSharingListVo> voPage = page.map(sharing -> {
      Long memberCount = resourceSharingQuery.getMemberCount(sharing.getId());
      return ResourceSharingConverter.toListVo(sharing, memberCount);
    });

    // 转换为PageResult
    return PageResult.of(voPage);
  }

  @Override
  public ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType) {
    return null;
  }

  @Override
  public ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 检查访问权限
    boolean hasAccess = resourceSharingQuery.hasAccess(resourceId, resourceType, userId);
    ResourceSharingMember permission = resourceSharingQuery.getUserPermission(resourceId,
        resourceType, userId);

    ResourceAccessCheckVo vo = new ResourceAccessCheckVo();
    vo.setHasAccess(hasAccess);

    if (permission != null) {
      vo.setPermission(permission.getPermission());
      vo.setPermissionLabel(getPermissionLabel(permission.getPermission()));
    }

    // TODO: 获取所有者信息
    // vo.setIsOwner(...);
    // vo.setSharedBy(...);
    // vo.setSharedByName(...);
    // vo.setSharedAt(...);

    return vo;
  }

  @Override
  public Map<String, Object> getStatistics(Long id, String period) {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 获取共享详情（权限检查）
    ResourceSharing sharing = resourceSharingQuery.getDetail(id, userId);

    // 获取统计数据
    Map<String, Object> statistics = new HashMap<>();

    // 基础统计
    statistics.put("totalViews", sharing.getTotalViews());
    statistics.put("totalEdits", sharing.getTotalEdits());
    statistics.put("totalDownloads", sharing.getTotalDownloads());
    statistics.put("uniqueVisitors", sharing.getUniqueVisitors());

    // 成员统计
    Long memberCount = resourceSharingQuery.getMemberCount(id);
    statistics.put("memberCount", memberCount);

    // 平均访问次数
    if (sharing.getUniqueVisitors() != null && sharing.getUniqueVisitors() > 0) {
      statistics.put("avgAccessesPerUser",
          (double) sharing.getTotalViews() / sharing.getUniqueVisitors());
    } else {
      statistics.put("avgAccessesPerUser", 0.0);
    }

    // TODO: 根据period参数获取趋势数据
    // if ("week".equals(period)) {
    //   statistics.put("trend", resourceSharingQuery.getWeeklyTrend(id));
    // } else if ("month".equals(period)) {
    //   statistics.put("trend", resourceSharingQuery.getMonthlyTrend(id));
    // }

    return statistics;
  }

  @Override
  public ResourceSharingStatisticsVo getMyStatistics() {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;

    // 获取用户统计数据
    Map<String, Object> stats = resourceSharingQuery.getUserStatistics(userId);

    // 转换为VO
    ResourceSharingStatisticsVo vo = new ResourceSharingStatisticsVo();

    // 我创建的共享统计
    ResourceSharingStatisticsVo.SharedByMeVo sharedByMe = new ResourceSharingStatisticsVo.SharedByMeVo();
    sharedByMe.setTotal((Long) stats.getOrDefault("totalShared", 0L));
    sharedByMe.setTotalViews((Long) stats.getOrDefault("totalViews", 0L));
    sharedByMe.setTotalMembers((Long) stats.getOrDefault("totalMembers", 0L));
    // TODO: 设置按类型统计
    vo.setSharedByMe(sharedByMe);

    // 共享给我的统计
    ResourceSharingStatisticsVo.SharedToMeVo sharedToMe = new ResourceSharingStatisticsVo.SharedToMeVo();
    sharedToMe.setTotal((Long) stats.getOrDefault("sharedToMe", 0L));
    sharedToMe.setRecentlyAccessed((Long) stats.getOrDefault("recentlyAccessed", 0L));
    // TODO: 设置按类型统计
    vo.setSharedToMe(sharedToMe);

    return vo;
  }

  /**
   * 获取权限标签
   */
  private String getPermissionLabel(
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
}
