package cloud.xcan.angus.core.ai.domain.setting.apikey;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * API密钥仓储接口
 */
@NoRepositoryBean
public interface ApiKeyRepo extends BaseRepository<ApiKey, Long> {

  /**
   * 更新使用统计
   */
  @Modifying
  @Query("UPDATE ApiKey a SET a.usageCount = a.usageCount + 1, a.lastUsedAt = :usedAt WHERE a.id = :id")
  int updateUsageStats(Long id, LocalDateTime usedAt);
}
