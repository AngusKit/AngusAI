package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 插件仓储接口
 */
@NoRepositoryBean
public interface PluginRepo extends BaseRepository<Plugin, Long> {

  // ==================== 查询方法 ====================
  
  /**
   * 根据名称查找插件
   */
  Optional<Plugin> findByName(String name);

  /**
   * 根据分类查询插件
   */
  Page<Plugin> findByCategory(PluginCategory category, Pageable pageable);

  /**
   * 根据状态查询插件
   */
  Page<Plugin> findByStatus(PluginStatus status, Pageable pageable);

  /**
   * 根据类型查询插件
   */
  Page<Plugin> findByType(PluginType type, Pageable pageable);

  /**
   * 查询公开插件
   */
  Page<Plugin> findByIsPublicTrue(Pageable pageable);

  /**
   * 查询系统插件
   */
  Page<Plugin> findByIsSystemTrue(Pageable pageable);

  /**
   * 查询已验证插件
   */
  Page<Plugin> findByIsVerifiedTrue(Pageable pageable);

  // ==================== 统计方法 ====================
  
  /**
   * 统计指定分类的插件数量
   */
  long countByCategory(PluginCategory category);

  /**
   * 统计指定状态的插件数量
   */
  long countByStatus(PluginStatus status);

  /**
   * 统计用户创建的插件数量
   */
  long countByCreatedBy(Long createdBy);

  // ==================== 修改方法 ====================
  
  /**
   * 检查名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

}
