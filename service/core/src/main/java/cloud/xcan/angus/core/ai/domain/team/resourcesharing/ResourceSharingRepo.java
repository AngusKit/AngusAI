package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ResourceSharingRepo extends BaseRepository<ResourceSharing, Long> {

  /**
   * 根据资源ID和资源类型查询共享
   */
  Optional<ResourceSharing> findByResourceIdAndResourceType(Long resourceId,
      ResourceType resourceType);

  /**
   * 统计用户创建的共享数量
   */
  @Query("SELECT COUNT(s) FROM ResourceSharing s WHERE s.ownerId = :ownerId")
  Long countByOwnerId(@Param("ownerId") Long ownerId);

  /**
   * 根据资源类型统计共享数量
   */
  @Query("SELECT COUNT(s) FROM ResourceSharing s WHERE s.ownerId = :ownerId AND s.resourceType = :resourceType")
  Long countByOwnerIdAndResourceType(@Param("ownerId") Long ownerId,
      @Param("resourceType") ResourceType resourceType);

  /**
   * 根据资源ID和资源类型删除共享
   */
  void deleteByResourceIdAndResourceType(Long resourceId, ResourceType resourceType);
}
