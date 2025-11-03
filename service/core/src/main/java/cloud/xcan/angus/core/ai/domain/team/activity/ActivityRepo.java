package cloud.xcan.angus.core.ai.domain.team.activity;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

@NoRepositoryBean
public interface ActivityRepo extends BaseRepository<Activity, Long> {

  List<Activity> findByResourceTypeAndResourceId(FullResourceType resourceType, Long targetId);

  @Query(value = "SELECT a0.resource_id FROM activity a0 GROUP BY a0.resource_id HAVING(count(a0.resource_id) > ?1) LIMIT ?2", nativeQuery = true)
  List<Long> getResourceIdsHavingCount(Long reservedNum, Long batchNum);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM activity WHERE resource_id = ?1 AND id NOT IN "
      + "(SELECT id FROM (SELECT id FROM activity WHERE resource_id = ?1 ORDER BY id DESC LIMIT ?2) as a)", nativeQuery = true)
  void deleteByResourceIdAndCount(Long resourceId, Long reservedNum);

  @Modifying
  @Query(value = "DELETE FROM activity WHERE resource_id in ?1 AND resource_type = ?2", nativeQuery = true)
  void deleteByResourceIdAndResourceType(List<Long> resourceIds, String resourceType);

}
