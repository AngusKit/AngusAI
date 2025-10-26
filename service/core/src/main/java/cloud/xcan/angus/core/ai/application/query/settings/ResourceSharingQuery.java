package cloud.xcan.angus.core.ai.application.query.settings;

import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingFindDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;

/**
 * 资源共享查询服务接口
 */
public interface ResourceSharingQuery {

  /**
   * 根据ID查找共享
   *
   * @param id 共享ID
   * @return 资源共享实体
   */
  ResourceSharing findById(Long id);

  /**
   * 获取共享详情
   *
   * @param id     共享ID
   * @param userId 用户ID
   * @return 资源共享实体
   */
  ResourceSharing getDetail(Long id, Long userId);

  /**
   * 分页查询共享列表
   *
   * @param dto    查询DTO
   * @param userId 用户ID
   * @return 分页结果
   */
  Page<ResourceSharing> list(ResourceSharingFindDto dto, Long userId);

  /**
   * 根据资源ID和资源类型查找共享
   *
   * @param resourceId   资源ID
   * @param resourceType 资源类型
   * @return 资源共享实体
   */
  ResourceSharing findByResource(Long resourceId, ResourceType resourceType);

  /**
   * 检查资源是否已共享
   *
   * @param resourceId   资源ID
   * @param resourceType 资源类型
   * @return 是否已共享
   */
  boolean isResourceShared(Long resourceId, ResourceType resourceType);

  /**
   * 获取共享的成员列表
   *
   * @param sharingId 共享ID
   * @return 成员列表
   */
  List<ResourceSharingMember> getMembers(Long sharingId);

  /**
   * 获取共享成员数量
   *
   * @param sharingId 共享ID
   * @return 成员数量
   */
  Long getMemberCount(Long sharingId);

  /**
   * 检查用户是否有访问权限
   *
   * @param resourceId   资源ID
   * @param resourceType 资源类型
   * @param userId       用户ID
   * @return 是否有权限
   */
  boolean hasAccess(Long resourceId, ResourceType resourceType, Long userId);

  /**
   * 获取用户的访问权限
   *
   * @param resourceId   资源ID
   * @param resourceType 资源类型
   * @param userId       用户ID
   * @return 权限对象，如果没有权限则返回null
   */
  ResourceSharingMember getUserPermission(Long resourceId, ResourceType resourceType, Long userId);

  /**
   * 获取用户共享的资源列表
   *
   * @param userId 用户ID
   * @return 共享列表
   */
  List<ResourceSharing> getUserSharedResources(Long userId);

  /**
   * 获取共享给用户的资源列表
   *
   * @param userId 用户ID
   * @return 成员列表
   */
  List<ResourceSharingMember> getSharedToUser(Long userId);

  /**
   * 获取访问日志
   *
   * @param sharingId 共享ID
   * @param pageNo    页码
   * @param pageSize  页大小
   * @return 访问日志分页
   */
  Page<ResourceSharingAccessLog> getAccessLogs(Long sharingId, int pageNo, int pageSize);

  /**
   * 统计访问数据
   *
   * @param sharingId 共享ID
   * @param startDate 开始时间
   * @param endDate   结束时间
   * @return 统计数据
   */
  Map<String, Object> getStatistics(Long sharingId, LocalDateTime startDate, LocalDateTime endDate);

  /**
   * 获取用户的共享统计
   *
   * @param userId 用户ID
   * @return 统计数据
   */
  Map<String, Object> getUserStatistics(Long userId);

  /**
   * 获取独立访客数
   *
   * @param sharingId 共享ID
   * @return 独立访客数
   */
  Long getUniqueVisitors(Long sharingId);
}
