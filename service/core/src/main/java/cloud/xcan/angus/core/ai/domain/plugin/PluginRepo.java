package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 插件仓储接口
 */
@NoRepositoryBean
public interface PluginRepo extends BaseRepository<Plugin, Long> {

  /**
   * 检查名称是否存在
   */
  boolean existsByNameAndVersion(String name, String version);

  /**
   * 检查名称是否存在（排除指定ID）
   */
  boolean existsByNameAndVersionAndIdNot(String name, String version, Long id);

}
