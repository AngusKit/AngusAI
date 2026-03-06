package com.agentx.core.plugin;

/**
 * 插件生命周期状态
 */
public enum PluginState {
  /**
   * 已加载但未初始化
   */
  LOADED,
  /**
   * 已初始化
   */
  INITIALIZED,
  /**
   * 运行中
   */
  STARTED,
  /**
   * 已停止
   */
  STOPPED,
  /**
   * 加载或运行失败
   */
  FAILED
}
