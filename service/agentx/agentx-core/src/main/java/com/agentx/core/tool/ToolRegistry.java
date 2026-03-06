package com.agentx.core.tool;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 工具注册中心 — 管理所有工具实例（@Tool、MCP、OpenAPI、SPI）
 */
@Slf4j
@Component
public class ToolRegistry {

  private final Map<String, ToolDescriptor> tools = new ConcurrentHashMap<>();

  /**
   * 注册工具
   */
  public void register(ToolDescriptor descriptor) {
    tools.put(descriptor.getId(), descriptor);
    log.info("Tool registered: {} ({})", descriptor.getName(), descriptor.getId());
  }

  /**
   * 注销工具
   */
  public void unregister(String toolId) {
    tools.remove(toolId);
  }

  /**
   * 获取工具实例（用于 AiServices.tools() 绑定）
   */
  public Optional<Object> getTool(String toolId) {
    return Optional.ofNullable(tools.get(toolId)).map(ToolDescriptor::getInstance);
  }

  /**
   * 获取工具描述
   */
  public Optional<ToolDescriptor> getDescriptor(String toolId) {
    return Optional.ofNullable(tools.get(toolId));
  }

  /**
   * 执行工具（workflow 节点调用使用）
   */
  public String executeTool(String toolId, Map<String, Object> params) {
    ToolDescriptor descriptor = tools.get(toolId);
    if (descriptor == null) {
      throw new IllegalArgumentException("Tool not found: " + toolId);
    }
    return descriptor.execute(params);
  }

  /**
   * 列出所有工具
   */
  public List<ToolDescriptor> listAll() {
    return List.copyOf(tools.values());
  }

  /**
   * 列出指定租户可用的工具
   */
  public List<ToolDescriptor> listByTenant(String tenantId) {
    return tools.values().stream()
        .filter(t -> t.getTenantId() == null || t.getTenantId().equals(tenantId))
        .toList();
  }
}
