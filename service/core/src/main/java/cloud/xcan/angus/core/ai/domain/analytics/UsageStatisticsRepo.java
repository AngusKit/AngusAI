package cloud.xcan.angus.core.ai.domain.analytics;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface UsageStatisticsRepo extends BaseRepository<UsageStatistics, Long> {

  // ==================== 查询方法 ====================
  
  /**
   * 查询时间范围内的统计数据
   */
  List<UsageStatistics> findByStatDateBetweenAndGranularityOrderByStatDateAsc(
      LocalDate start, LocalDate end, StatGranularity granularity);

  /**
   * 查询应用的统计数据
   */
  List<UsageStatistics> findByAppIdAndStatDateBetweenAndGranularityOrderByStatDateAsc(
      Long appId, LocalDate start, LocalDate end, StatGranularity granularity);

  /**
   * 查询指定日期的统计
   */
  @Query("SELECT s FROM UsageStatistics s WHERE s.statDate = :date AND s.granularity = :granularity")
  List<UsageStatistics> findByDateAndGranularity(@Param("date") LocalDate date,
      @Param("granularity") StatGranularity granularity);

}
