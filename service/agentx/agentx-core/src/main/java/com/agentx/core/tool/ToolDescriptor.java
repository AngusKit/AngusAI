package com.agentx.core.tool;

import java.util.Map;
import java.util.function.Function;
import lombok.Builder;
import lombok.Data;

/**
 * 工具描述符 — 每个注册工具的元信息和执行逻辑
 */
@Data
@Builder
public class ToolDescriptor {

  /**
   * 工具唯一 ID
   */
  private String id;

  /**
   * 工具名称
   */
  private String name;

  /**
   * 工具描述
   */
  private String description;

  /**
   * 工具分类
   */
  private String category;

  /**
   * 工具来源: BUILTIN / MCP / OPENAPI / SPI
   */
  @Builder.Default
  private ToolSource source = ToolSource.BUILTIN;

  /**
   * 关联租户（null 表示全局）
   */
  private String tenantId;

  /**
   * 工具实例（用于绑定 AiServices）
   */
  private Object instance;

  /**
   * 工具执行函数
   */
  private Function<Map<String, Object>, String> executor;

  public String execute(Map<String, Object> params) {
    if (executor != null) {
      return executor.apply(params);
    }
    throw new UnsupportedOperationException("Tool has no executor: " + id);
  }

  public enum ToolSource {
    BUILTIN, MCP, OPENAPI, SPI
  }
}
