package cloud.xcan.core.core.tool;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cloud.xcan.core.tool.ToolDescriptor;
import cloud.xcan.core.tool.ToolRegistry;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * ToolRegistry 单元测试 — 覆盖工具注册、注销、执行、租户过滤
 */
@DisplayName("ToolRegistry Tests")
class ToolRegistryTest {

  private ToolRegistry registry;

  @BeforeEach
  void setUp() {
    registry = new ToolRegistry();
  }

  // ==================== 注册与获取 ====================

  @Nested
  @DisplayName("Register & Get")
  class RegisterAndGet {

    @Test
    @DisplayName("注册并获取工具实例")
    void registerAndGetTool() {
      Object toolInstance = new Object();
      ToolDescriptor descriptor = ToolDescriptor.builder()
          .id("tool-1")
          .name("Test Tool")
          .description("A test tool")
          .instance(toolInstance)
          .build();

      registry.register(descriptor);

      Optional<Object> result = registry.getTool("tool-1");
      assertTrue(result.isPresent());
      assertSame(toolInstance, result.get());
    }

    @Test
    @DisplayName("获取不存在的工具返回空")
    void getNotExists() {
      assertTrue(registry.getTool("nonexistent").isEmpty());
    }

    @Test
    @DisplayName("获取工具描述")
    void getDescriptor() {
      ToolDescriptor descriptor = ToolDescriptor.builder()
          .id("tool-2")
          .name("Tool Two")
          .description("Description")
          .category("test")
          .source(ToolDescriptor.ToolSource.BUILTIN)
          .build();

      registry.register(descriptor);

      Optional<ToolDescriptor> result = registry.getDescriptor("tool-2");
      assertTrue(result.isPresent());
      assertEquals("Tool Two", result.get().getName());
      assertEquals("test", result.get().getCategory());
      assertEquals(ToolDescriptor.ToolSource.BUILTIN, result.get().getSource());
    }

    @Test
    @DisplayName("获取不存在的描述返回空")
    void getDescriptorNotExists() {
      assertTrue(registry.getDescriptor("nonexistent").isEmpty());
    }

    @Test
    @DisplayName("覆盖注册同 ID 工具")
    void overrideRegistration() {
      Object first = "first";
      Object second = "second";

      registry.register(ToolDescriptor.builder()
          .id("dup").name("First").instance(first).build());
      registry.register(ToolDescriptor.builder()
          .id("dup").name("Second").instance(second).build());

      assertEquals("second", registry.getTool("dup").orElse(null));
      assertEquals("Second", registry.getDescriptor("dup").get().getName());
    }
  }

  // ==================== 注销 ====================

  @Nested
  @DisplayName("Unregister")
  class Unregister {

    @Test
    @DisplayName("注销已注册的工具")
    void unregisterRegistered() {
      registry.register(ToolDescriptor.builder()
          .id("tool-3").name("Temp Tool").build());
      assertTrue(registry.getDescriptor("tool-3").isPresent());

      registry.unregister("tool-3");
      assertTrue(registry.getDescriptor("tool-3").isEmpty());
    }

    @Test
    @DisplayName("注销不存在的工具不抛异常")
    void unregisterNonexistent() {
      assertDoesNotThrow(() -> registry.unregister("nonexistent"));
    }
  }

  // ==================== 执行 ====================

  @Nested
  @DisplayName("Execute Tool")
  class ExecuteTool {

    @Test
    @DisplayName("通过 executor 函数执行工具")
    void executeWithExecutor() {
      registry.register(ToolDescriptor.builder()
          .id("calc")
          .name("Calculator")
          .executor(params -> {
            int a = (int) params.get("a");
            int b = (int) params.get("b");
            return String.valueOf(a + b);
          })
          .build());

      String result = registry.executeTool("calc", Map.of("a", 3, "b", 5));
      assertEquals("8", result);
    }

    @Test
    @DisplayName("执行不存在的工具抛出异常")
    void executeNonexistent() {
      assertThrows(IllegalArgumentException.class,
          () -> registry.executeTool("missing", Map.of()));
    }

    @Test
    @DisplayName("无 executor 的工具执行抛出异常")
    void executeWithoutExecutor() {
      registry.register(ToolDescriptor.builder()
          .id("noexec").name("No Executor").build());

      assertThrows(UnsupportedOperationException.class,
          () -> registry.executeTool("noexec", Map.of()));
    }
  }

  // ==================== 列表 ====================

  @Nested
  @DisplayName("List Tools")
  class ListTools {

    @Test
    @DisplayName("列出所有工具")
    void listAll() {
      registry.register(ToolDescriptor.builder().id("t1").name("Tool 1").build());
      registry.register(ToolDescriptor.builder().id("t2").name("Tool 2").build());
      registry.register(ToolDescriptor.builder().id("t3").name("Tool 3").build());

      List<ToolDescriptor> all = registry.listAll();
      assertEquals(3, all.size());
    }

    @Test
    @DisplayName("空注册中心返回空列表")
    void listAllEmpty() {
      assertTrue(registry.listAll().isEmpty());
    }

    @Test
    @DisplayName("按租户过滤 — 全局工具对所有租户可见")
    void listByTenantGlobal() {
      registry.register(ToolDescriptor.builder()
          .id("global").name("Global").tenantId(null).build());

      List<ToolDescriptor> result = registry.listByTenant("tenant-A");
      assertEquals(1, result.size());
      assertEquals("global", result.get(0).getId());
    }

    @Test
    @DisplayName("按租户过滤 — 匹配租户可见")
    void listByTenantMatching() {
      registry.register(ToolDescriptor.builder()
          .id("t-a").name("Tenant A Tool").tenantId("tenant-A").build());
      registry.register(ToolDescriptor.builder()
          .id("t-b").name("Tenant B Tool").tenantId("tenant-B").build());

      List<ToolDescriptor> result = registry.listByTenant("tenant-A");
      assertEquals(1, result.size());
      assertEquals("t-a", result.get(0).getId());
    }

    @Test
    @DisplayName("按租户过滤 — 全局 + 匹配租户")
    void listByTenantMixed() {
      registry.register(ToolDescriptor.builder()
          .id("global").name("Global").tenantId(null).build());
      registry.register(ToolDescriptor.builder()
          .id("t-a").name("Tenant A").tenantId("tenant-A").build());
      registry.register(ToolDescriptor.builder()
          .id("t-b").name("Tenant B").tenantId("tenant-B").build());

      List<ToolDescriptor> result = registry.listByTenant("tenant-A");
      assertEquals(2, result.size());
    }
  }

  // ==================== LangChain4j 绑定 ====================

  @Nested
  @DisplayName("LangChain4j Tool Binding")
  class LangChain4jBinding {

    @Test
    @DisplayName("getToolObjectsForIds 返回 @Tool Bean 实例")
    void getToolObjectsForIds() {
      Object webSearch = new Object();
      Object httpTool = new Object();
      registry.register(ToolDescriptor.builder()
          .id("webSearchTool").name("Web Search").instance(webSearch).build());
      registry.register(ToolDescriptor.builder()
          .id("httpRequestTool").name("HTTP").instance(httpTool).build());

      List<Object> result = registry.getToolObjectsForIds(
          List.of("webSearchTool", "httpRequestTool"));
      assertEquals(2, result.size());
      assertSame(webSearch, result.get(0));
      assertSame(httpTool, result.get(1));
    }

    @Test
    @DisplayName("getToolObjectsForIds 忽略 executor-only 工具")
    void getToolObjectsForIdsSkipsExecutorOnly() {
      registry.register(ToolDescriptor.builder()
          .id("plugin-tool").name("Plugin").executor(m -> "ok").build());

      List<Object> result = registry.getToolObjectsForIds(List.of("plugin-tool"));
      assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getToolMapForIds 返回 executor-only 工具的 LangChain4j 绑定")
    void getToolMapForIds() {
      registry.register(ToolDescriptor.builder()
          .id("create-ticket")
          .name("创建工单")
          .description("创建客服工单")
          .executor(params -> "ticket-" + params.get("title"))
          .build());

      var map = registry.getToolMapForIds(List.of("create-ticket"));
      assertEquals(1, map.size());
      var spec = map.keySet().iterator().next();
      assertEquals("create-ticket", spec.name());
      assertEquals("创建客服工单", spec.description());

      var exec = map.get(spec);
      String result = exec.execute(
          dev.langchain4j.agent.tool.ToolExecutionRequest.builder()
              .name("create-ticket")
              .arguments("{\"title\":\"test\"}")
              .build(),
          null);
      assertEquals("ticket-test", result);
    }

    @Test
    @DisplayName("getToolMapForIds 忽略有 instance 的工具")
    void getToolMapForIdsSkipsInstanceTools() {
      Object bean = new Object();
      registry.register(ToolDescriptor.builder()
          .id("beanTool").name("Bean").instance(bean).build());

      var map = registry.getToolMapForIds(List.of("beanTool"));
      assertTrue(map.isEmpty());
    }

    @Test
    @DisplayName("空 toolIds 返回空集合")
    void emptyToolIds() {
      assertTrue(registry.getToolObjectsForIds(List.of()).isEmpty());
      assertTrue(registry.getToolMapForIds(List.of()).isEmpty());
      assertTrue(registry.getToolObjectsForIds(null).isEmpty());
      assertTrue(registry.getToolMapForIds(null).isEmpty());
    }
  }

  // ==================== ToolDescriptor ====================

  @Nested
  @DisplayName("ToolDescriptor")
  class ToolDescriptorTest {

    @Test
    @DisplayName("默认 source 是 BUILTIN")
    void defaultSource() {
      ToolDescriptor d = ToolDescriptor.builder().id("x").name("X").build();
      assertEquals(ToolDescriptor.ToolSource.BUILTIN, d.getSource());
    }

    @Test
    @DisplayName("所有 ToolSource 枚举值")
    void allToolSources() {
      assertEquals(4, ToolDescriptor.ToolSource.values().length);
      assertNotNull(ToolDescriptor.ToolSource.BUILTIN);
      assertNotNull(ToolDescriptor.ToolSource.MCP);
      assertNotNull(ToolDescriptor.ToolSource.OPENAPI);
      assertNotNull(ToolDescriptor.ToolSource.SPI);
    }
  }
}
