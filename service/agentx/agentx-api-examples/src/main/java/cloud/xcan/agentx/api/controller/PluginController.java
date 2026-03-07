package cloud.xcan.agentx.api.controller;

import cloud.xcan.agentx.api.dto.ApiResponse;
import cloud.xcan.core.plugin.PluginDescriptor;
import cloud.xcan.core.plugin.PluginManager;
import cloud.xcan.core.plugin.enums.PluginState;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 插件管理接口
 */
@RestController
@RequestMapping("/api/v1/plugins")
@RequiredArgsConstructor
public class PluginController {

  private final PluginManager pluginManager;

  /**
   * 列出所有已安装插件
   */
  @GetMapping
  public ApiResponse<List<PluginDescriptor>> listPlugins() {
    return ApiResponse.ok(pluginManager.listPlugins());
  }

  /**
   * 列出所有插件及其状态
   */
  @GetMapping("/status")
  public ApiResponse<Map<String, PluginState>> pluginStatus() {
    return ApiResponse.ok(pluginManager.listPluginStates());
  }

  /**
   * 卸载插件
   */
  @DeleteMapping("/{pluginId}")
  public ApiResponse<Void> uninstallPlugin(@PathVariable String pluginId) {
    pluginManager.uninstall(pluginId);
    return ApiResponse.ok(null);
  }
}
