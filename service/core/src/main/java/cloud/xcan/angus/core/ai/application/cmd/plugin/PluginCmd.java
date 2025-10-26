package cloud.xcan.angus.core.ai.application.cmd.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginConfig;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;

public interface PluginCmd {

  /**
   * 创建插件
   */
  Plugin create(Plugin plugin);

  /**
   * 更新插件基本信息
   */
  Plugin update(Plugin plugin);

  /**
   * 更新插件配置
   */
  Plugin updateConfig(Long id, PluginConfig config);

  /**
   * 修改插件状态
   */
  Plugin modifyStatus(Long id, PluginStatus status);

  /**
   * 复制插件
   */
  Plugin duplicate(Long sourceId, String name, Boolean copyConfig, Boolean copyPermissions, Boolean copyTags);

  /**
   * 收藏/取消收藏插件
   */
  Plugin favorite(Long id, Boolean isFavorite);

  /**
   * 安装插件
   */
  Plugin install(Long id);

  /**
   * 卸载插件
   */
  void uninstall(Long id);

  /**
   * 使用插件（增加使用次数）
   */
  Plugin use(Long id);

  /**
   * 发布插件
   */
  Plugin publish(Long id);

  /**
   * 验证插件
   */
  Plugin verify(Long id, Boolean verified);

  /**
   * 删除插件
   */
  void delete(Long id);
}
