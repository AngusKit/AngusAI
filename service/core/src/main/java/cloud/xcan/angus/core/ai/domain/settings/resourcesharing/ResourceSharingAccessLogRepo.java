package cloud.xcan.angus.core.ai.domain.settings.resourcesharing;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ResourceSharingAccessLogRepo extends BaseRepository<ResourceSharingAccessLog, Long> {

  /**
   * 根据共享ID查询访问日志
   */
  Page<ResourceSharingAccessLog> findBySharingIdOrderByCreatedDateDesc(Long sharingId, Pageable pageable);

  /**
   * 根据共享ID和用户ID查询访问日志
   */
  List<ResourceSharingAccessLog> findBySharingIdAndUserIdOrderByCreatedDateDesc(Long sharingId, Long userId);

  /**
   * 根据资源ID和资源类型查询访问日志
   */
  List<ResourceSharingAccessLog> findByResourceIdAndResourceTypeOrderByCreatedDateDesc(
      Long resourceId, ResourceType resourceType);

  /**
   * 统计时间范围内的访问次数
   */
  @Query("SELECT COUNT(l) FROM ResourceSharingAccessLog l WHERE l.sharingId = :sharingId " +
      "AND l.createdDate BETWEEN :startDate AND :endDate")
  Long countAccessesBySharingIdAndDateRange(
      @Param("sharingId") Long sharingId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  /**
   * 统计时间范围内按操作类型的访问次数
   */
  @Query("SELECT COUNT(l) FROM ResourceSharingAccessLog l WHERE l.sharingId = :sharingId " +
      "AND l.action = :action AND l.createdDate BETWEEN :startDate AND :endDate")
  Long countAccessesBySharingIdAndActionAndDateRange(
      @Param("sharingId") Long sharingId,
      @Param("action") ShareAction action,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  /**
   * 获取Top访问者
   */
  @Query("SELECT l.userId, COUNT(l) as count FROM ResourceSharingAccessLog l " +
      "WHERE l.sharingId = :sharingId GROUP BY l.userId ORDER BY count DESC")
  List<Object[]> findTopVisitorsBySharingId(@Param("sharingId") Long sharingId, Pageable pageable);

  /**
   * 按日期统计访问趋势
   */
  @Query("SELECT DATE(l.createdDate) as date, COUNT(l) as count, COUNT(DISTINCT l.userId) as users " +
      "FROM ResourceSharingAccessLog l WHERE l.sharingId = :sharingId " +
      "AND l.createdDate BETWEEN :startDate AND :endDate " +
      "GROUP BY DATE(l.createdDate) ORDER BY date")
  List<Object[]> getAccessTrendBySharingIdAndDateRange(
      @Param("sharingId") Long sharingId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  /**
   * 按小时统计访问分布
   */
  @Query("SELECT HOUR(l.createdDate) as hour, COUNT(l) as count " +
      "FROM ResourceSharingAccessLog l WHERE l.sharingId = :sharingId " +
      "GROUP BY HOUR(l.createdDate) ORDER BY hour")
  List<Object[]> getAccessDistributionByHour(@Param("sharingId") Long sharingId);
}
