package cloud.xcan.angus.core.ai.application.query.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics;
import cloud.xcan.angus.core.ai.domain.plugin.StatisticsPeriod;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface PluginQuery {

  /**
   * 根据ID查询插件
   */
  Plugin findAndCheck(Long id);

  /**
   * 查询插件列表
   */
  Page<Plugin> find(GenericSpecification<Plugin> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 获取插件统计数据
   */
  PluginStatistics getStatistics(StatisticsPeriod period);

  /**
   * 检查插件名称是否存在
   */
  boolean existsByNameAndVersion(String name, String version);

  /**
   * 检查插件名称是否存在（排除指定ID）
   */
  boolean existsByNameAndVersionAndIdNot(String name, String version, Long id);

}
