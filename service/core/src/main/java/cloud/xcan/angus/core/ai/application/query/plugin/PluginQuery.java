package cloud.xcan.angus.core.ai.application.query.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface PluginQuery {

  /**
   * 查询插件列表
   */
  Page<Plugin> find(GenericSpecification<Plugin> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据ID查询插件
   */
  Plugin findById(Long id);

  /**
   * 根据名称查询插件
   */
  Plugin findByName(String name);

  /**
   * 检查插件名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查插件名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 根据分类查询插件列表
   */
  Page<Plugin> findByCategory(PluginCategory category, PageRequest pageable);

  /**
   * 根据状态查询插件列表
   */
  Page<Plugin> findByStatus(PluginStatus status, PageRequest pageable);

  /**
   * 根据类型查询插件列表
   */
  Page<Plugin> findByType(PluginType type, PageRequest pageable);

  /**
   * 查询公开插件列表
   */
  Page<Plugin> findPublicPlugins(PageRequest pageable);

  /**
   * 查询系统插件列表
   */
  Page<Plugin> findSystemPlugins(PageRequest pageable);

  /**
   * 查询已验证插件列表
   */
  Page<Plugin> findVerifiedPlugins(PageRequest pageable);

  /**
   * 查询热门插件（按安装数排序）
   */
  Page<Plugin> findTrendingPlugins(PageRequest pageable);

  /**
   * 统计插件数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定分类的插件数量
   */
  long countByCategory(PluginCategory category);

  /**
   * 统计指定状态的插件数量
   */
  long countByStatus(PluginStatus status);

  /**
   * 搜索插件
   */
  Page<Plugin> search(String keyword, PageRequest pageable);
}
