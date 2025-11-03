package cloud.xcan.angus.core.ai.domain.team.activity;

import cloud.xcan.angus.api.commonlink.CombinedTargetType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

@NoRepositoryBean
public interface ActivityRepo extends BaseRepository<Activity, Long> {

  List<Activity> findByTargetTypeAndTargetId(CombinedTargetType targetType, Long targetId);

  @Query(value = "SELECT a0.target_id FROM activity a0 GROUP BY a0.target_id HAVING(count(a0.target_id) > ?1) LIMIT ?2", nativeQuery = true)
  List<Long> getTargetIdsHavingCount(Long reservedNum, Long batchNum);

  int countAllByMainTargetId(Long id);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM activity WHERE target_id = ?1 AND id NOT IN "
      + "(SELECT id FROM (SELECT id FROM activity WHERE target_id = ?1 ORDER BY id DESC LIMIT ?2) as a)", nativeQuery = true)
  void deleteByTargetIdAndCount(Long targetId, Long reservedNum);

  @Modifying
  @Query(value = "DELETE FROM activity WHERE target_id in ?1 AND target_type = ?2", nativeQuery = true)
  void deleteByTargetIdAndTargetType(List<Long> targetIds, String value);

  @Modifying
  @Query(value = "DELETE FROM activity WHERE task_id IN ?1", nativeQuery = true)
  void deleteByTaskId(List<Long> targetIds);

}
