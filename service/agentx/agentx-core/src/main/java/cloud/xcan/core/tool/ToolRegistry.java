package cloud.xcan.core.tool;

import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.internal.Json;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import dev.langchain4j.service.tool.ToolExecutor;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具注册中心 — 管理所有工具实例（LangChain4j @Tool、MCP、OpenAPI、SPI 插件）
 */
@Slf4j
public class ToolRegistry {

  private static final Type MAP_TYPE = new ParameterizedType() {
    @Override
    public Type[] getActualTypeArguments() {
      return new Type[] {String.class, Object.class};
    }

    @Override
    public Type getRawType() {
      return Map.class;
    }

    @Override
    public Type getOwnerType() {
      return null;
    }
  };

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
   * 获取工具实例（仅当 descriptor 有 instance 时返回，用于单工具查询）
   */
  public Optional<Object> getTool(String toolId) {
    return Optional.ofNullable(tools.get(toolId)).map(ToolDescriptor::getInstance);
  }

  /**
   * 获取 @Tool Bean 实例列表（用于 AiServices.tools(objects)）
   * 去重：同一 Bean 只返回一次
   */
  public List<Object> getToolObjectsForIds(List<String> toolIds) {
    if (toolIds == null || toolIds.isEmpty()) {
      return List.of();
    }
    List<Object> result = new ArrayList<>();
    var seen = new LinkedHashMap<Object, Boolean>();
    for (String id : toolIds) {
      ToolDescriptor d = tools.get(id);
      if (d != null && d.getInstance() != null && seen.put(d.getInstance(), Boolean.TRUE) == null) {
        result.add(d.getInstance());
      }
    }
    return result;
  }

  /**
   * 获取 executor-only 工具的 LangChain4j 绑定（用于 AiServices.tools(Map)）
   * 插件通过 registerTool(descriptor.executor(...)) 注册的工具会出现在此 Map 中
   */
  public Map<ToolSpecification, ToolExecutor> getToolMapForIds(List<String> toolIds) {
    if (toolIds == null || toolIds.isEmpty()) {
      return Map.of();
    }
    Map<ToolSpecification, ToolExecutor> result = new LinkedHashMap<>();
    for (String id : toolIds) {
      ToolDescriptor d = tools.get(id);
      if (d != null && d.getExecutor() != null && d.getInstance() == null) {
        ToolSpecification spec = ToolSpecification.builder()
            .name(id)
            .description(d.getDescription() != null ? d.getDescription() : d.getName())
            .parameters(JsonObjectSchema.builder().additionalProperties(true).build())
            .build();
        ToolExecutor exec = (request, memoryId) -> {
          Map<String, Object> args = parseArguments(request.arguments());
          return d.getExecutor().apply(args);
        };
        result.put(spec, exec);
      }
    }
    return result;
  }

  private static Map<String, Object> parseArguments(String arguments) {
    if (arguments == null || arguments.isBlank()) {
      return Map.of();
    }
    try {
      return Json.fromJson(arguments.trim(), MAP_TYPE);
    } catch (Exception e) {
      return Map.of();
    }
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
