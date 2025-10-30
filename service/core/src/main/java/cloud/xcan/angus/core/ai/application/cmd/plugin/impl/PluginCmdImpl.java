package cloud.xcan.angus.core.ai.application.cmd.plugin.impl;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginConfig;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Service
public class PluginCmdImpl extends CommCmd<Plugin, Long> implements PluginCmd {

  @Resource
  private PluginRepo pluginRepo;

  @Resource
  private PluginQuery pluginQuery;

  @Override
  @Transactional
  public Plugin create(Plugin plugin) {
    return new BizTemplate<Plugin>() {
      @Override
      protected void checkParams() {
        // 检查名称是否重复
        if (pluginQuery.existsByName(plugin.getName())) {
          throw ResourceExisted.of("插件名称「{0}」已存在", new Object[]{plugin.getName()});
        }
      }

      @Override
      protected Plugin process() {
        // 设置初始状态
        if (plugin.getStatus() == null) {
          plugin.setStatus(PluginStatus.INACTIVE);
        }

        // 初始化统计数据
        plugin.setInstallCount(0L);
        plugin.setUsageCount(0L);
        plugin.setRating(0.0);
        plugin.setReviewCount(0L);

        insert0(plugin);
        return plugin;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin update(Plugin plugin) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(plugin.getId());
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }

        // 系统插件不能修改
        if (Boolean.TRUE.equals(pluginDb.getIsSystem())) {
          throw ResourceExisted.of("系统插件不能修改", new Object[]{});
        }

        // 检查名称是否已存在（排除当前插件）
        if (ObjectUtils.isNotEmpty(plugin.getName())
            && pluginQuery.existsByNameAndIdNot(plugin.getName(), pluginDb.getId())) {
          throw ResourceExisted.of("插件名称「{0}」已存在", new Object[]{plugin.getName()});
        }
      }

      @Override
      protected Plugin process() {
        update(plugin, pluginDb);
        return pluginDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin updateConfig(Long id, PluginConfig config) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }

        // 系统插件不能修改配置
        if (Boolean.TRUE.equals(pluginDb.getIsSystem())) {
          throw ResourceExisted.of("系统插件不能修改", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        pluginDb.setConfig(config);
        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin modifyStatus(Long id, PluginStatus status) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        pluginDb.setStatus(status);
        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin duplicate(Long sourceId, String name, Boolean copyConfig, Boolean copyPermissions, Boolean copyTags) {
    return new BizTemplate<Plugin>() {
      Plugin sourcePlugin;

      @Override
      protected void checkParams() {
        // 获取源插件并检查是否存在
        sourcePlugin = pluginQuery.findById(sourceId);
        if (sourcePlugin == null) {
          throw ResourceNotFound.of("插件不存在，插件可能已被删除", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        // 检查新名称是否重复，如果重复则添加随机后缀
        String newName = name;
        if (pluginQuery.existsByName(newName)) {
          newName = newName + "-" + RandomStringUtils.randomAlphabetic(5);
        }

        Plugin plugin = new Plugin();
        plugin.setName(newName);
        plugin.setNameEn(sourcePlugin.getNameEn() != null ? sourcePlugin.getNameEn() + " Copy" : null);
        plugin.setIcon(sourcePlugin.getIcon());
        plugin.setDescription(sourcePlugin.getDescription());
        plugin.setAuthor(sourcePlugin.getAuthor());
        plugin.setVersion(sourcePlugin.getVersion());
        plugin.setCategory(sourcePlugin.getCategory());
        plugin.setType(sourcePlugin.getType());
        plugin.setStatus(PluginStatus.INACTIVE);

        // 根据参数决定是否复制
        if (Boolean.TRUE.equals(copyConfig)) {
          plugin.setConfig(sourcePlugin.getConfig());
        }
        if (Boolean.TRUE.equals(copyPermissions)) {
          plugin.setPermissions(sourcePlugin.getPermissions());
        }
        if (Boolean.TRUE.equals(copyTags)) {
          plugin.setTags(sourcePlugin.getTags());
        }

        plugin.setMinVersion(sourcePlugin.getMinVersion());
        plugin.setHomepageUrl(sourcePlugin.getHomepageUrl());
        plugin.setDocumentationUrl(sourcePlugin.getDocumentationUrl());
        plugin.setRepositoryUrl(sourcePlugin.getRepositoryUrl());
        plugin.setSupportUrl(sourcePlugin.getSupportUrl());
        plugin.setLicense(sourcePlugin.getLicense());
        plugin.setPrice(sourcePlugin.getPrice());
        plugin.setCurrency(sourcePlugin.getCurrency());

        // 初始化统计数据
        plugin.setInstallCount(0L);
        plugin.setUsageCount(0L);
        plugin.setRating(0.0);
        plugin.setReviewCount(0L);
        plugin.setIsFavorite(false);
        plugin.setIsSystem(false);
        plugin.setIsPublic(false);
        plugin.setIsVerified(false);

        return pluginRepo.save(plugin);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin favorite(Long id, Boolean isFavorite) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        pluginDb.setIsFavorite(isFavorite);
        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin install(Long id) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        // 增加安装次数
        pluginDb.setInstallCount(pluginDb.getInstallCount() + 1);

        // TODO: 实现实际的插件安装逻辑

        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void uninstall(Long id) {
    new BizTemplate<Void>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        // TODO: 实现实际的插件卸载逻辑
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin use(Long id) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        // 增加使用次数
        pluginDb.setUsageCount(pluginDb.getUsageCount() + 1);
        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin publish(Long id) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        pluginDb.setIsPublic(true);
        pluginDb.setPublishedDate(LocalDateTime.now());
        pluginDb.setStatus(PluginStatus.ACTIVE);

        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin verify(Long id, Boolean verified) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }
      }

      @Override
      protected Plugin process() {
        pluginDb.setIsVerified(verified);
        return pluginRepo.save(pluginDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findById(id);
        if (pluginDb == null) {
          throw ResourceNotFound.of("插件不存在", new Object[]{});
        }

        // 系统插件不能删除
        if (Boolean.TRUE.equals(pluginDb.getIsSystem())) {
          throw ResourceExisted.of("系统插件不能删除", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        pluginRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Plugin, Long> getRepository() {
    return pluginRepo;
  }
}
