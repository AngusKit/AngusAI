package cloud.xcan.angus.core.ai.domain.team.activity;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

@NoRepositoryBean
public interface ActivityRepo extends BaseRepository<Activity, Long> {

  List<Activity> findByResourceTypeAndResourceId(FullResourceType resourceType, Long targetId);

  @Query(value = "SELECT a0.resource_id FROM team_activity a0 GROUP BY a0.resource_id HAVING(count(a0.resource_id) > ?1) LIMIT ?2", nativeQuery = true)
  List<Long> getResourceIdsHavingCount(Long reservedNum, Long batchNum);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM team_activity WHERE resource_id = ?1 AND id NOT IN "
      + "(SELECT id FROM (SELECT id FROM team_activity WHERE resource_id = ?1 ORDER BY id DESC LIMIT ?2) as a)", nativeQuery = true)
  void deleteByResourceIdAndCount(Long resourceId, Long reservedNum);

  @Modifying
  @Query(value = "DELETE FROM team_activity WHERE resource_id in ?1 AND resource_type = ?2", nativeQuery = true)
  void deleteByResourceIdAndResourceType(List<Long> resourceIds, String resourceType);

  // --- statistics related queries ---

  // total/count in range
  long countByActivityDateBetween(LocalDateTime start, LocalDateTime end);

  // distinct active users in range
  @Query(value = "SELECT COUNT(DISTINCT user_id) FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2", nativeQuery = true)
  Long countDistinctUsersByDateRange(LocalDateTime start, LocalDateTime end);

  // count by status
  @Query(value = "SELECT COUNT(1) FROM team_activity WHERE status = ?1 AND activity_date >= ?2 AND activity_date <= ?3", nativeQuery = true)
  Long countByStatusAndDateRange(String status, LocalDateTime start, LocalDateTime end);

  // distribution by action_type
  @Query(value = "SELECT action_type, COUNT(1) cnt FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY action_type ORDER BY cnt DESC", nativeQuery = true)
  List<Object[]> countGroupByActionType(LocalDateTime start, LocalDateTime end);

  // distribution by resource_type
  @Query(value = "SELECT resource_type, COUNT(1) cnt FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY resource_type ORDER BY cnt DESC", nativeQuery = true)
  List<Object[]> countGroupByResourceType(LocalDateTime start, LocalDateTime end);

  // status distribution
  @Query(value = "SELECT status, COUNT(1) cnt FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY status", nativeQuery = true)
  List<Object[]> countGroupByStatus(LocalDateTime start, LocalDateTime end);

  // top active users
  @Query(value = "SELECT user_id, COUNT(1) cnt, MAX(activity_date) last_date FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY user_id ORDER BY cnt DESC LIMIT ?3", nativeQuery = true)
  List<Object[]> topUsersBetween(LocalDateTime start, LocalDateTime end, Integer limit);

  // time trend by day
  @Query(value = "SELECT DATE(activity_date) d, COUNT(1) cnt, SUM(CASE WHEN status='SUCCESS' THEN 1 ELSE 0 END) succ, SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) fail FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY DATE(activity_date) ORDER BY d ASC", nativeQuery = true)
  List<Object[]> timeTrendByDay(LocalDateTime start, LocalDateTime end);

  // top resources
  @Query(value = "SELECT resource_id, resource_type, resource_name, COUNT(1) cnt, MAX(activity_date) last_date FROM team_activity WHERE activity_date >= ?1 AND activity_date <= ?2 GROUP BY resource_id, resource_type, resource_name ORDER BY cnt DESC LIMIT ?3", nativeQuery = true)
  List<Object[]> topResourcesBetween(LocalDateTime start, LocalDateTime end, Integer limit);

}
