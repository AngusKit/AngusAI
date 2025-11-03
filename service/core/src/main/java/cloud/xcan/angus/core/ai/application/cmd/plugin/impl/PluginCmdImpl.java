package cloud.xcan.angus.core.ai.application.cmd.plugin.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginCmd;
import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginRecordCmd;
import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginReviewCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordType;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@DoInFuture("添加权限校验")
@Service
public class PluginCmdImpl extends CommCmd<Plugin, Long> implements PluginCmd {

  @Resource
  private PluginRepo pluginRepo;

  @Resource
  private PluginRecordCmd pluginRecordCmd;

  @Resource
  private PluginReviewCmd pluginReviewCmd;

  @Resource
  private PluginQuery pluginQuery;

  @Override
  @Transactional
  public Plugin create(Plugin plugin) {
    return new BizTemplate<Plugin>() {
      @Override
      protected void checkParams() {
        // 检查名称和版本是否重复
        if (pluginQuery.existsByNameAndVersion(plugin.getName(), plugin.getVersion())) {
          throw ResourceExisted.of("插件「{0} {1}」已存在",
              new Object[]{plugin.getName(), plugin.getVersion()});
        }
      }

      @Override
      protected Plugin process() {
        // TODO 解析验证插件文件
        plugin.setIsVerified(true);

        // TODO 保存插件文件

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
        pluginDb = pluginQuery.findAndCheck(plugin.getId());

        // 系统插件不能修改
        if (Boolean.TRUE.equals(pluginDb.getIsSystem())) {
          throw ResourceExisted.of("系统插件不能修改", new Object[]{});
        }

        // 检查名称是否已存在（排除当前插件）
        String actualName = nullSafe(plugin.getName(), pluginDb.getName());
        String actualVersion = nullSafe(plugin.getVersion(), pluginDb.getVersion());
        if ((isNotEmpty(plugin.getName()) || isNotEmpty(plugin.getVersion()))
            && pluginQuery.existsByNameAndVersionAndIdNot(actualName,
            actualVersion, pluginDb.getId())) {
          throw ResourceExisted.of("插件「{0} {1}」已存在", new Object[]{actualName, actualVersion});
        }
      }

      @Override
      protected Plugin process() {
        if (Objects.nonNull(plugin.getFile())) {
          // TODO 解析验证插件文件
          plugin.setIsVerified(true);

          // TODO 保存插件文件
        }

        update(plugin, pluginDb);
        return pluginDb;
      }
    }.execute();
  }

  @Override
  public void update0(Plugin pluginDb) {
    pluginRepo.save(pluginDb);
  }

  @Override
  @Transactional
  public Plugin modifyStatus(Long id, PluginStatus status) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findAndCheck(id);
      }

      @Override
      protected Plugin process() {
        if (PluginStatus.UNINSTALLED.equals(status)) {
          return uninstall(id);
        }

        pluginDb.setStatus(status);
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
        pluginDb = pluginQuery.findAndCheck(id);
      }

      @Override
      protected Plugin process() {
        // TODO: 实现实际的插件安装逻辑

        // 增加安装次数
        pluginDb.setInstallCount(pluginDb.getInstallCount() + 1);
        Plugin saved = pluginRepo.save(pluginDb);

        // 记录安装事件
        pluginRecordCmd.recordPluginEvent(saved.getId(), PluginRecordType.INSTALL);
        return saved;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Plugin uninstall(Long id) {
    return new BizTemplate<Plugin>() {
      Plugin pluginDb;

      @Override
      protected void checkParams() {
        // 获取插件并验证是否存在
        pluginDb = pluginQuery.findAndCheck(id);
      }

      @Override
      protected Plugin process() {
        // TODO: 实现实际的插件卸载逻辑（卸载插件不删除数据库安装包记录）

        pluginDb.setStatus(PluginStatus.UNINSTALLED);
        pluginRepo.save(pluginDb);

        // 记录卸载事件
        pluginRecordCmd.recordPluginEvent(pluginDb.getId(), PluginRecordType.UNINSTALL);
        return pluginDb;
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
        pluginDb = pluginQuery.findAndCheck(id);
      }

      @Override
      protected Plugin process() {
        // 增加使用次数
        pluginDb.setUsageCount(pluginDb.getUsageCount() + 1);
        Plugin saved = pluginRepo.save(pluginDb);

        // 记录访问事件
        pluginRecordCmd.recordPluginEvent(saved.getId(), PluginRecordType.VISIT);
        return saved;
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
        pluginDb = pluginQuery.findAndCheck(id);
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
  public Plugin verify(String name, String version, PluginCategory category,
      PluginType type, MultipartFile file) {
    return new BizTemplate<Plugin>() {
      @Override
      protected void checkParams() {
        // 检查名称和版本是否重复
        if (pluginQuery.existsByNameAndVersion(name, version)) {
          throw ResourceExisted.of("插件「{0}」「{1}」已存在", new Object[]{name, version});
        }
      }

      @Override
      protected Plugin process() {
        // TODO 解析验证插件文件
        Plugin plugin = null;

        plugin.setIsVerified(true);
        return plugin;
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
        pluginDb = pluginQuery.findAndCheck(id);
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
        // 先卸载插件运行时
        uninstall(id);

        // TODO 删除插件文件

        // 删除插件记录
        pluginRepo.deleteById(id);
        pluginRecordCmd.deleteByPluginId(id);
        pluginReviewCmd.deleteByPluginId(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Plugin, Long> getRepository() {
    return pluginRepo;
  }
}
