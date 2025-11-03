package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

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
   * 根据共享ID和用户ID查询成员
   */
  Optional<ResourceSharingMember> findBySharingIdAndUserId(Long sharingId, Long userId);

  /**
   * 获取共享的独立访客数
   */
  @Query("SELECT COUNT(DISTINCT m.userId) FROM ResourceSharingMember m WHERE m.sharingId = :sharingId AND m.accessCount > 0")
  Long countUniqueVisitorsBySharingId(@Param("sharingId") Long sharingId);

  /**
   * 检查成员是否存在
   */
  boolean existsBySharingIdAndUserId(Long sharingId, Long userId);

  /**
   * 删除共享的所有成员
   */
  @Modifying
  void deleteBySharingId(Long sharingId);

}
