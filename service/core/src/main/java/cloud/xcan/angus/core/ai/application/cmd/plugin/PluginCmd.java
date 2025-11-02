package cloud.xcan.angus.core.ai.application.cmd.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import org.springframework.web.multipart.MultipartFile;

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
   * 更新插件基本信息-不做任何校验
   */
  void update0(Plugin pluginDb);

  /**
   * 修改插件状态
   */
  Plugin modifyStatus(Long id, PluginStatus status);

  /**
   * 安装插件
   */
  Plugin install(Long id);

  /**
   * 卸载插件
   */
  Plugin uninstall(Long id);

  /**
   * 使用插件（增加使用次数）
   */
  Plugin use(Long id);

  /**
   * 发布插件
   */
  Plugin publish(Long id);

  /**
   * 验证插件包
   */
  Plugin verify(String name, String version, PluginCategory category, PluginType type,
      MultipartFile file);

  /**
   * 删除插件
   */
  void delete(Long id);

}
