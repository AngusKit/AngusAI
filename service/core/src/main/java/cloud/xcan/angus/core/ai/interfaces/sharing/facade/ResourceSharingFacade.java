package cloud.xcan.angus.core.ai.interfaces.sharing.facade;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceInfo;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingToggleDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import java.util.List;
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
   * 更新共享
   */
  ResourceSharingDetailVo update(Long id, ResourceSharingUpdateDto dto);

  /**
   * 切换资源启用或禁用状态
   */
  ResourceSharingDetailVo toggle(Long id, ResourceSharingToggleDto dto);

  /**
   * 删除共享
   */
  void delete(Long id);

  /**
   * 获取共享详情
   */
  ResourceSharingDetailVo getDetail(Long id);

  /**
   * 获取共享列表
   */
  PageResult<ResourceSharingListVo> list(ResourceSharingFindDto dto);

  /**
   * 检查访问权限
   */
  ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType);

  /**
   * 获取资源访问权限列表
   */
  Map<ResourceInfo, List<SharePermission>> getResourcePermissions(Long resourceId,
      ResourceType resourceType);

  /**
   * 获取统计数据
   */
  ResourceSharingStatisticsVo getStatistics(Long id, StatisticsPeriod period);

}
