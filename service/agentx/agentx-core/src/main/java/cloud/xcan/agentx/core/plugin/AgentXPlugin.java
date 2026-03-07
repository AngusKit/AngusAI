package cloud.xcan.agentx.core.plugin;

/**
 * 插件 SPI — 所有 AgentX 插件必须实现此接口。
 * <p>
 * 插件通过 Java SPI 或 Spring Bean 自动发现机制注册到框架。 框架按 {@code init → start → stop} 的生命周期管理插件。
 * </p>
 * <h3>扩展能力</h3>
 * <p>插件可在 {@link #init(PluginContext)} 阶段通过 PluginContext 注册：</p>
 * <ul>
 *   <li>工具（Tool）</li>
 *   <li>护栏（Guardrail）</li>
 *   <li>工作流节点执行器（NodeExecutor）</li>
 *   <li>模型工厂（ModelFactory）</li>
 *   <li>向量存储工厂（VectorStoreFactory）</li>
 * </ul>
 */
public interface AgentXPlugin {

  /**
   * 获取插件描述符
   */
  PluginDescriptor getDescriptor();

  /**
   * 初始化插件 — 在此阶段注册扩展组件
   */
  void init(PluginContext context);

  /**
   * 启动插件 — 初始化完成后调用
   */
  default void start() {
  }

  /**
   * 停止插件 — 关闭时释放资源
   */
  default void stop() {
  }
}
