package cloud.xcan.agentx.core.plugin;

import cloud.xcan.agentx.core.plugin.enums.PluginState;
import cloud.xcan.agentx.core.skill.SkillRegistry;
import cloud.xcan.agentx.core.tool.ToolRegistry;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;

/**
 * 插件管理器 — 管理所有插件的生命周期（加载 → 初始化 → 启动 → 停止）。
 * <p>
 * 插件通过以下方式发现：
 * <ul>
 *   <li>Spring Bean 自动注入（实现 {@link AgentXPlugin} 接口的 Bean）</li>
 *   <li>手动通过 {@link #install(AgentXPlugin)} 注册</li>
 * </ul>
 * </p>
 */
@Slf4j
public class PluginManager {

  private final ToolRegistry toolRegistry;
  private final SkillRegistry skillRegistry;
  private final Map<String, PluginEntry> plugins = new ConcurrentHashMap<>();

  /**
   * 初始化通过 Spring 自动发现的所有插件
   */
  public PluginManager(ToolRegistry toolRegistry, SkillRegistry skillRegistry,
      List<AgentXPlugin> autoDiscoveredPlugins) {
    this.toolRegistry = toolRegistry;
    this.skillRegistry = skillRegistry;
    if (autoDiscoveredPlugins != null) {
      for (AgentXPlugin plugin : autoDiscoveredPlugins) {
        install(plugin);
      }
    }
  }

  /**
   * 安装并初始化插件
   */
  public void install(AgentXPlugin plugin) {
    PluginDescriptor descriptor = plugin.getDescriptor();
    String pluginId = descriptor.getId();

    if (plugins.containsKey(pluginId)) {
      log.warn("Plugin already installed: {} — skipping", pluginId);
      return;
    }

    PluginEntry entry = new PluginEntry(plugin, PluginState.LOADED);
    plugins.put(pluginId, entry);
    log.info("Plugin loaded: {} v{}", descriptor.getName(), descriptor.getVersion());

    try {
      // 初始化
      DefaultPluginContext context = new DefaultPluginContext(toolRegistry, skillRegistry,
          descriptor.getConfig());
      plugin.init(context);
      entry.setState(PluginState.INITIALIZED);
      entry.setContext(context);
      log.info("Plugin initialized: {}", pluginId);

      // 启动
      plugin.start();
      entry.setState(PluginState.STARTED);
      log.info("Plugin started: {}", pluginId);

    } catch (Exception e) {
      entry.setState(PluginState.FAILED);
      log.error("Plugin failed to start: {} — {}", pluginId, e.getMessage(), e);
    }
  }

  /**
   * 卸载插件
   */
  public void uninstall(String pluginId) {
    PluginEntry entry = plugins.remove(pluginId);
    if (entry == null) {
      log.warn("Plugin not found for uninstall: {}", pluginId);
      return;
    }
    try {
      entry.getPlugin().stop();
      entry.setState(PluginState.STOPPED);
      log.info("Plugin stopped and uninstalled: {}", pluginId);
    } catch (Exception e) {
      log.error("Error stopping plugin: {} — {}", pluginId, e.getMessage(), e);
    }
  }

  /**
   * 获取插件状态
   */
  public Optional<PluginState> getState(String pluginId) {
    PluginEntry entry = plugins.get(pluginId);
    return entry != null ? Optional.of(entry.getState()) : Optional.empty();
  }

  /**
   * 列出所有已安装插件
   */
  public List<PluginDescriptor> listPlugins() {
    return plugins.values().stream()
        .map(e -> e.getPlugin().getDescriptor())
        .toList();
  }

  /**
   * 列出所有已安装插件及其状态
   */
  public Map<String, PluginState> listPluginStates() {
    Map<String, PluginState> result = new LinkedHashMap<>();
    plugins.forEach((id, entry) -> result.put(id, entry.getState()));
    return result;
  }

  /**
   * 停止所有插件
   */
  public void stopAll() {
    plugins.forEach((id, entry) -> {
      if (entry.getState() == PluginState.STARTED) {
        try {
          entry.getPlugin().stop();
          entry.setState(PluginState.STOPPED);
          log.info("Plugin stopped: {}", id);
        } catch (Exception e) {
          log.error("Error stopping plugin: {} — {}", id, e.getMessage(), e);
        }
      }
    });
  }

  // --- Internal ---

  private static class PluginEntry {

    private final AgentXPlugin plugin;
    private PluginState state;
    private DefaultPluginContext context;

    PluginEntry(AgentXPlugin plugin, PluginState state) {
      this.plugin = plugin;
      this.state = state;
    }

    AgentXPlugin getPlugin() {
      return plugin;
    }

    PluginState getState() {
      return state;
    }

    void setState(PluginState state) {
      this.state = state;
    }

    DefaultPluginContext getContext() {
      return context;
    }

    void setContext(DefaultPluginContext context) {
      this.context = context;
    }
  }
}
