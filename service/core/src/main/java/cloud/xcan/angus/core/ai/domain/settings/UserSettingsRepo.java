package cloud.xcan.angus.core.ai.domain.settings;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 用户设置仓储接口
 */
@NoRepositoryBean
public interface UserSettingsRepo extends BaseRepository<UserSettings, Long> {

  // ==================== 查询方法 ====================
  
  /**
   * 根据用户ID查询设置
   */
  Optional<UserSettings> findByUserId(Long userId);

  // ==================== 修改方法 ====================
  
  /**
   * 检查用户设置是否存在
   */
  boolean existsByUserId(Long userId);

  // ==================== 删除方法 ====================
  
  /**
   * 根据用户ID删除设置
   */
  void deleteByUserId(Long userId);
}
