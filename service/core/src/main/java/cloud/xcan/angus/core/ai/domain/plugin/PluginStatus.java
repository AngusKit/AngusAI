package cloud.xcan.angus.core.ai.domain.plugin;

/**
 * 插件状态
 */
public enum PluginStatus {
  /**
   * 已激活
   */
  ACTIVE,

  /**
   * 未激活
   */
  INACTIVE,

  /**
   * 已禁用
   */
  UNINSTALLED,

  /**
   * 维护中
   */
  MAINTENANCE,

  /**
   * 已过期
   */
  DEPRECATED
}
