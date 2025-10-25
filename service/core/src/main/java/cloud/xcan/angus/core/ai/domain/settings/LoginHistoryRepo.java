package cloud.xcan.angus.core.ai.domain.settings;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 登录历史仓储接口
 */
@NoRepositoryBean
public interface LoginHistoryRepo extends BaseRepository<LoginHistory, Long> {

  /**
   * 分页查询用户登录历史
   */
  Page<LoginHistory> findByUserIdOrderByLoginDatetimeDesc(Long userId, Pageable pageable);

  /**
   * 查询指定时间范围内的登录历史
   */
  @Query("SELECT lh FROM LoginHistory lh WHERE lh.userId = ?1 AND lh.loginDatetime BETWEEN ?2 AND ?3 ORDER BY lh.loginDatetime DESC")
  List<LoginHistory> findByUserIdAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);

  /**
   * 查询最近N条登录记录
   */
  List<LoginHistory> findTop10ByUserIdOrderByLoginDatetimeDesc(Long userId);

  /**
   * 根据用户ID删除登录历史
   */
  void deleteByUserId(Long userId);
}
