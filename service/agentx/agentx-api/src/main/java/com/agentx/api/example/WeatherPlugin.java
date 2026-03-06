package com.agentx.api.example;

import com.agentx.core.plugin.AgentXPlugin;
import com.agentx.core.plugin.PluginContext;
import com.agentx.core.plugin.PluginDescriptor;
import com.agentx.core.tool.ToolDescriptor;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 示例插件 — 天气查询工具插件
 * <p>
 * 展示如何开发一个 AgentX 插件：
 * <ol>
 *   <li>实现 {@link AgentXPlugin} 接口</li>
 *   <li>在 {@link #getDescriptor()} 中声明插件元信息</li>
 *   <li>在 {@link #init(PluginContext)} 中注册扩展（工具、护栏、节点执行器等）</li>
 *   <li>将类注册为 Spring Bean 即可自动发现</li>
 * </ol>
 * </p>
 *
 * <h3>使用方式</h3>
 * <pre>
 * // 方式1：作为 Spring Bean（推荐）
 * {@literal @}Component
 * public class WeatherPlugin implements AgentXPlugin { ... }
 *
 * // 方式2：手动安装
 * pluginManager.install(new WeatherPlugin());
 * </pre>
 */
@Slf4j
public class WeatherPlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("weather-plugin")
        .name("天气查询插件")
        .version("1.0.0")
        .description("提供天气查询工具，演示 AgentX 插件开发方式")
        .author("AgentX Team")
        .extensionPoints(List.of("tool"))
        .config(Map.of(
            "apiKey", "your-weather-api-key",
            "provider", "openweathermap"
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    // 从插件配置中读取 API Key
    String apiKey = context.getConfig("apiKey", String.class);

    // 注册天气查询工具
    context.registerTool(ToolDescriptor.builder()
        .id("weather-query-tool")
        .name("天气查询")
        .description("查询指定城市的当前天气信息")
        .category("utility")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String city = (String) params.getOrDefault("city", "Beijing");
          // 实际应调用天气 API，此处为示例
          log.info("Querying weather for city: {} with apiKey: {}", city, apiKey);
          return String.format(
              "{\"city\":\"%s\",\"temp\":\"25°C\",\"weather\":\"晴\",\"humidity\":\"45%%\"}", city);
        })
        .build());

    log.info("WeatherPlugin initialized — weather-query-tool registered");
  }

  @Override
  public void start() {
    log.info("WeatherPlugin started");
  }

  @Override
  public void stop() {
    log.info("WeatherPlugin stopped");
  }
}
