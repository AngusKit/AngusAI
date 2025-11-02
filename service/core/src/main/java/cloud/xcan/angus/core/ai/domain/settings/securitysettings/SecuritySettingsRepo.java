package cloud.xcan.angus.core.ai.domain.settings.securitysettings;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 安全设置仓储接口
 */
@NoRepositoryBean
public interface SecuritySettingsRepo extends BaseRepository<SecuritySettings, Long> {

  // ==================== 查询方法 ====================

  /**
   * 根据用户ID查询安全设置
   */
  Optional<SecuritySettings> findByUserId(Long userId);

  // ==================== 修改方法 ====================

  /**
   * 检查用户安全设置是否存在
   */
  boolean existsByUserId(Long userId);

  // ==================== 删除方法 ====================

  /**
   * 根据用户ID删除安全设置
   */
  void deleteByUserId(Long userId);
}
