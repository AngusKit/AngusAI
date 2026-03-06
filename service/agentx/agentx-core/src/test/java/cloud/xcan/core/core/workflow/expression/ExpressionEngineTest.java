package cloud.xcan.core.core.workflow.expression;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import cloud.xcan.core.workflow.expression.ExpressionEngine;

/**
 * ExpressionEngine 单元测试 — 覆盖 SpEL 表达式解析、变量替换、Map 解析、错误处理
 */
@DisplayName("ExpressionEngine Tests")
class ExpressionEngineTest {

  private ExpressionEngine engine;

  @BeforeEach
  void setUp() {
    engine = new ExpressionEngine();
  }

  // ==================== 单表达式解析 ====================

  @Nested
  @DisplayName("Single Expression Resolution")
  class SingleExpression {

    @Test
    @DisplayName("解析简单变量引用")
    void resolveSimpleVariable() {
      Map<String, Object> context = Map.of("variables", Map.of("name", "Alice"));
      Object result = engine.resolve("${#variables['name']}", context);
      assertEquals("Alice", result);
    }

    @Test
    @DisplayName("解析整数表达式")
    void resolveIntegerExpression() {
      Object result = engine.resolve("${1 + 2}", Map.of());
      assertEquals(3, result);
    }

    @Test
    @DisplayName("解析布尔表达式")
    void resolveBooleanExpression() {
      Object result = engine.resolve("${1 > 0}", Map.of());
      assertEquals(true, result);
    }

    @Test
    @DisplayName("解析字符串拼接")
    void resolveStringConcatenation() {
      Object result = engine.resolve("${'Hello' + ' ' + 'World'}", Map.of());
      assertEquals("Hello World", result);
    }

    @Test
    @DisplayName("null 模板返回 null")
    void nullTemplate() {
      assertNull(engine.resolve(null, Map.of()));
    }
  }

  // ==================== 字符串内嵌表达式 ====================

  @Nested
  @DisplayName("Embedded Expression Resolution")
  class EmbeddedExpression {

    @Test
    @DisplayName("替换字符串中的表达式")
    void resolveEmbeddedExpression() {
      Map<String, Object> context = Map.of("variables", Map.of("name", "Bob"));
      Object result = engine.resolve("Hello ${#variables['name']}!", context);
      assertEquals("Hello Bob!", result);
    }

    @Test
    @DisplayName("替换多个表达式")
    void resolveMultipleExpressions() {
      Map<String, Object> variables = new HashMap<>();
      variables.put("first", "John");
      variables.put("last", "Doe");
      Map<String, Object> context = new HashMap<>();
      context.put("variables", variables);
      Object result = engine.resolve(
          "${#variables['first']} ${#variables['last']}", context);
      assertEquals("John Doe", result);
    }

    @Test
    @DisplayName("无表达式的字符串原样返回")
    void noExpressionReturnsOriginal() {
      Object result = engine.resolve("plain text", Map.of());
      assertEquals("plain text", result);
    }
  }

  // ==================== Map 解析 ====================

  @Nested
  @DisplayName("Map Resolution")
  class MapResolution {

    @Test
    @DisplayName("解析 Map 中的表达式值")
    void resolveMapValues() {
      Map<String, Object> map = new HashMap<>();
      map.put("key1", "${1 + 1}");
      map.put("key2", "plain");
      map.put("key3", "${#variables['x']}");

      Map<String, Object> context = Map.of("variables", Map.of("x", "resolved"));
      Map<String, Object> result = engine.resolveMap(map, context);

      assertEquals(2, result.get("key1"));
      assertEquals("plain", result.get("key2"));
      assertEquals("resolved", result.get("key3"));
    }

    @Test
    @DisplayName("解析嵌套 Map")
    void resolveNestedMap() {
      Map<String, Object> inner = new HashMap<>();
      inner.put("nested", "${2 * 3}");

      Map<String, Object> map = new HashMap<>();
      map.put("outer", inner);

      Map<String, Object> result = engine.resolveMap(map, Map.of());

      @SuppressWarnings("unchecked")
      Map<String, Object> resolvedInner = (Map<String, Object>) result.get("outer");
      assertEquals(6, resolvedInner.get("nested"));
    }

    @Test
    @DisplayName("null Map 返回空 Map")
    void nullMapReturnsEmpty() {
      Map<String, Object> result = engine.resolveMap(null, Map.of());
      assertNotNull(result);
      assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("非字符串值保持不变")
    void nonStringValuesUnchanged() {
      Map<String, Object> map = new HashMap<>();
      map.put("num", 42);
      map.put("bool", true);
      map.put("list", java.util.List.of(1, 2));

      Map<String, Object> result = engine.resolveMap(map, Map.of());

      assertEquals(42, result.get("num"));
      assertEquals(true, result.get("bool"));
    }
  }

  // ==================== 错误处理 ====================

  @Nested
  @DisplayName("Error Handling")
  class ErrorHandling {

    @Test
    @DisplayName("无效表达式返回原表达式")
    void invalidExpressionReturnsFallback() {
      Object result = engine.resolve("${undefined.broken.path}", Map.of());
      assertEquals("${undefined.broken.path}", result);
    }

    @Test
    @DisplayName("引用不存在的变量返回 null 或原表达式")
    void missingVariableFallback() {
      Object result = engine.resolve("${#variables['missing']}", Map.of("variables", Map.of()));
      // SpEL 对不存在的 key 返回 null；异常时返回原表达式
      assertTrue(result == null || "${#variables['missing']}".equals(result));
    }
  }

  // ==================== 上下文变量 ====================

  @Nested
  @DisplayName("Context Variables")
  class ContextVariables {

    @Test
    @DisplayName("支持 secrets 上下文")
    void secretsContext() {
      Map<String, Object> context = Map.of(
          "secrets", Map.of("apiKey", "sk-12345"));
      Object result = engine.resolve("${#secrets['apiKey']}", context);
      assertEquals("sk-12345", result);
    }

    @Test
    @DisplayName("支持 nodes 上下文")
    void nodesContext() {
      Map<String, Object> nodeOutputs = Map.of(
          "llm-1", Map.of("text", "response"));
      Map<String, Object> context = Map.of("nodes", nodeOutputs);
      Object result = engine.resolve("${#nodes['llm-1']['text']}", context);
      assertEquals("response", result);
    }
  }
}
