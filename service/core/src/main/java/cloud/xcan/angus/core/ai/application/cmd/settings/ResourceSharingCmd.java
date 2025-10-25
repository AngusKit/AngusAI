package cloud.xcan.angus.core.ai.application.cmd.settings;

import cloud.xcan.angus.core.ai.domain.settings.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.settings.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.settings.ResourceType;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingAccessDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingUpdateDto;
import java.util.List;

/**
 * 资源共享命令服务接口
 */
public interface ResourceSharingCmd {

  /**
   * 创建资源共享
   *
   * @param dto    创建DTO
   * @param userId 用户ID
   * @return 资源共享实体
   */
  ResourceSharing create(ResourceSharingCreateDto dto, Long userId);

  /**
   * 更新资源共享
   *
   * @param id     共享ID
   * @param dto    更新DTO
   * @param userId 用户ID
   * @return 资源共享实体
   */
  ResourceSharing update(Long id, ResourceSharingUpdateDto dto, Long userId);

  /**
   * 删除资源共享
   *
   * @param id     共享ID
   * @param userId 用户ID
   */
  void delete(Long id, Long userId);

  /**
   * 添加成员
   *
   * @param sharingId 共享ID
   * @param memberIds 成员ID列表
   * @param userId    用户ID
   * @return 成员列表
   */
  List<ResourceSharingMember> addMembers(Long sharingId, List<Long> memberIds, Long userId);

  /**
   * 移除成员
   *
   * @param sharingId 共享ID
   * @param memberId  成员ID
   * @param userId    用户ID
   */
  void removeMember(Long sharingId, Long memberId, Long userId);

  /**
   * 记录访问日志
   *
   * @param sharingId 共享ID
   * @param dto       访问DTO
   * @param userId    用户ID
   */
  void recordAccess(Long sharingId, ResourceSharingAccessDto dto, Long userId);

  /**
   * 取消资源共享(根据资源)
   *
   * @param resourceId   资源ID
   * @param resourceType 资源类型
   * @param userId       用户ID
   */
  void cancelByResource(Long resourceId, ResourceType resourceType, Long userId);
}
