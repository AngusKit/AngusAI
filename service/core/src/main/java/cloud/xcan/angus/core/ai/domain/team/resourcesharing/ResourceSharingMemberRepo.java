package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ResourceSharingMemberRepo extends BaseRepository<ResourceSharingMember, Long> {

  /**
   * 根据用户ID和权限查询成员
   */
  ResourceSharingMember findByUserIdAndPermission(Long userId, SharePermission permission);

  /**
   * 根据共享ID查询成员列表
   */
  List<ResourceSharingMember> findBySharingIdOrderByCreatedDateDesc(Long sharingId);

  /**
   * 根据用户ID、资源类型和资源ID查询成员列表
   */
  List<ResourceSharingMember> findByUserIdAndResourceIdAndResourceType(Long userId, Long resourceId,
      ResourceType resourceType);

  /**
   * 删除共享的所有成员
   */
  @Modifying
  void deleteBySharingId(Long sharingId);

}
