package cloud.xcan.angus.core.ai.interfaces.settings.facade;

import cloud.xcan.angus.core.ai.domain.settings.ResourceType;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingAccessDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingAddMembersDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import java.util.Map;

/**
 * 资源共享门面接口
 */
public interface ResourceSharingFacade {

  /**
   * 创建资源共享
   */
  ResourceSharingDetailVo create(ResourceSharingCreateDto dto);

  /**
   * 获取共享列表
   */
  PageResult<ResourceSharingListVo> list(ResourceSharingFindDto dto);

  /**
   * 获取共享详情
   */
  ResourceSharingDetailVo getDetail(Long id);

  /**
   * 更新共享
   */
  ResourceSharingDetailVo update(Long id, ResourceSharingUpdateDto dto);

  /**
   * 删除共享
   */
  void delete(Long id, Boolean notifyMembers);

  /**
   * 添加成员
   */
  Map<String, Object> addMembers(Long id, ResourceSharingAddMembersDto dto);

  /**
   * 移除成员
   */
  void removeMember(Long id, Long userId);

  /**
   * 检查访问权限
   */
  ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType);

  /**
   * 记录访问
   */
  void recordAccess(Long id, ResourceSharingAccessDto dto);

  /**
   * 获取统计数据
   */
  Map<String, Object> getStatistics(Long id, String period);

  /**
   * 获取我的统计
   */
  ResourceSharingStatisticsVo getMyStatistics();
}
