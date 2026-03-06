package cloud.xcan.core.plugin;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 插件描述符 — 每个插件的元信息
 */
@Data
@Builder
public class PluginDescriptor {

  /**
   * 插件唯一标识
   */
  private String id;

  /**
   * 插件名称
   */
  private String name;

  /**
   * 版本
   */
  private String version;

  /**
   * 描述
   */
  private String description;

  /**
   * 作者
   */
  private String author;

  /**
   * 插件提供的扩展点类型列表
   */
  private java.util.List<String> extensionPoints;

  /**
   * 插件配置
   */
  private Map<String, Object> config;
}
