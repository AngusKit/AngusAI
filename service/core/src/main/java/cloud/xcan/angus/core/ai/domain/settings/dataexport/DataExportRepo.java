package cloud.xcan.angus.core.ai.domain.settings.dataexport;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 数据导出仓储接口
 */
@NoRepositoryBean
public interface DataExportRepo extends BaseRepository<DataExport, Long> {

  // ==================== 查询方法 ====================

  /**
   * 查询用户的所有导出记录
   */
  List<DataExport> findByUserIdOrderByRequestedAtDesc(Long userId);

  /**
   * 查询未完成的导出任务
   */
  List<DataExport> findByStatusOrderByRequestedAtAsc(ExportStatus status);

  // ==================== 统计方法 ====================

  /**
   * 查询用户今天的导出次数
   */
  @Query("SELECT COUNT(de) FROM DataExport de WHERE de.userId = ?1 AND de.requestedAt >= ?2")
  int countTodayExportsByUserId(Long userId, LocalDateTime startOfDay);

  // ==================== 删除方法 ====================

  /**
   * 根据用户ID删除导出记录
   */
  void deleteByUserId(Long userId);
}
