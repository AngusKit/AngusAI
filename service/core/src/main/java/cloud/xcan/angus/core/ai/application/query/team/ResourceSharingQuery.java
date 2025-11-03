package cloud.xcan.angus.core.ai.application.query.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * 资源共享查询服务接口
 */
public interface ResourceSharingQuery {

  /**
   * 获取共享资源详细并检查是否存在
   */
  ResourceSharing findAndCheck(Long id);

  /**
   * 分页查询共享列表
   */
  Page<ResourceSharing> find(GenericSpecification<ResourceSharing> spec, PageRequest pageable);

  /**
   * 根据资源ID和资源类型查找共享
   */
  ResourceSharing findByResource(Long resourceId, ResourceType resourceType);

  /**
   * 获取共享的成员列表
   */
  List<ResourceSharingMember> getMembers(Long sharingId);

  /**
   * 检查用户是否有访问权限
   */
  boolean hasAccess(Long resourceId, ResourceType resourceType, Long userId);

}
