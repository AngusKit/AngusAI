package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingUpdateDto;
import java.util.List;

/**
 * 资源共享命令服务接口
 */
public interface ResourceSharingCmd {

  /**
   * 创建资源共享
   */
  ResourceSharing create(ResourceSharingCreateDto dto, Long userId);

  /**
   * 更新资源共享
   */
  ResourceSharing update(Long id, ResourceSharingUpdateDto dto, Long userId);

  /**
   * 添加成员
   */
  List<ResourceSharingMember> addMembers(Long sharingId, List<Long> memberIds, Long userId);

  /**
   * 移除成员
   */
  void removeMember(Long sharingId, Long memberId, Long userId);

  /**
   * 删除资源共享
   */
  void delete(Long id, Long userId);

  /**
   * 取消资源共享(根据资源)
   */
  void cancelByResource(Long resourceId, ResourceType resourceType, Long userId);
}
