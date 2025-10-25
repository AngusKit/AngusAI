package cloud.xcan.angus.core.ai.application.query.plugin.impl;

import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PluginQueryImpl implements PluginQuery {

  @Resource
  private PluginRepo pluginRepo;

  @Override
  public Page<Plugin> find(GenericSpecification<Plugin> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    // TODO: 实现全文搜索逻辑
    return pluginRepo.findAll(spec, pageable);
  }

  @Override
  public Plugin findById(Long id) {
    return pluginRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFound("插件不存在"));
  }

  @Override
  public Plugin findByName(String name) {
    return pluginRepo.findByName(name)
        .orElseThrow(() -> new ResourceNotFound("插件不存在"));
  }

  @Override
  public boolean existsByName(String name) {
    return pluginRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return pluginRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public Page<Plugin> findByCategory(PluginCategory category, PageRequest pageable) {
    return pluginRepo.findByCategory(category, pageable);
  }

  @Override
  public Page<Plugin> findByStatus(PluginStatus status, PageRequest pageable) {
    return pluginRepo.findByStatus(status, pageable);
  }

  @Override
  public Page<Plugin> findByType(PluginType type, PageRequest pageable) {
    return pluginRepo.findByType(type, pageable);
  }

  @Override
  public Page<Plugin> findPublicPlugins(PageRequest pageable) {
    return pluginRepo.findByIsPublicTrue(pageable);
  }

  @Override
  public Page<Plugin> findSystemPlugins(PageRequest pageable) {
    return pluginRepo.findByIsSystemTrue(pageable);
  }

  @Override
  public Page<Plugin> findVerifiedPlugins(PageRequest pageable) {
    return pluginRepo.findByIsVerifiedTrue(pageable);
  }

  @Override
  public Page<Plugin> findTrendingPlugins(PageRequest pageable) {
    // TODO: 实现热门插件查询逻辑，按安装数或使用数排序
    return pluginRepo.findAll(pageable);
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return pluginRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByCategory(PluginCategory category) {
    return pluginRepo.countByCategory(category);
  }

  @Override
  public long countByStatus(PluginStatus status) {
    return pluginRepo.countByStatus(status);
  }

  @Override
  public Page<Plugin> search(String keyword, PageRequest pageable) {
    // TODO: 实现搜索逻辑，可以使用全文搜索
    return pluginRepo.findAll(pageable);
  }
}
