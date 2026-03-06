package cloud.xcan.core.core.prompt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import cloud.xcan.core.prompt.PromptManager;
import cloud.xcan.core.prompt.PromptTemplate;

/**
 * PromptManager 单元测试 — 覆盖模板保存、版本管理、渲染、列表
 */
@DisplayName("PromptManager Tests")
class PromptManagerTest {

  private PromptManager manager;

  @BeforeEach
  void setUp() {
    manager = new PromptManager();
  }

  // ==================== 保存 ====================

  @Nested
  @DisplayName("Save Templates")
  class SaveTemplates {

    @Test
    @DisplayName("保存模板返回正确的版本号")
    void saveReturnsVersion() {
      PromptTemplate t = manager.save("p1", "Prompt 1", "general",
          "Hello {{name}}", Map.of("name", "用户名"), null);

      assertEquals("p1", t.getId());
      assertEquals("Prompt 1", t.getName());
      assertEquals("general", t.getCategory());
      assertEquals("Hello {{name}}", t.getContent());
      assertEquals(1, t.getVersion());
      assertNotNull(t.getCreatedAt());
      assertNotNull(t.getUpdatedAt());
    }

    @Test
    @DisplayName("同 ID 多次保存自动递增版本号")
    void autoIncrementsVersion() {
      PromptTemplate v1 = manager.save("p1", "V1", "cat", "content v1", null, null);
      PromptTemplate v2 = manager.save("p1", "V2", "cat", "content v2", null, null);
      PromptTemplate v3 = manager.save("p1", "V3", "cat", "content v3", null, null);

      assertEquals(1, v1.getVersion());
      assertEquals(2, v2.getVersion());
      assertEquals(3, v3.getVersion());
    }

    @Test
    @DisplayName("保存带租户 ID")
    void saveWithTenantId() {
      PromptTemplate t = manager.save("p2", "Tenant Prompt", "sys",
          "content", null, "tenant-A");
      assertEquals("tenant-A", t.getTenantId());
    }
  }

  // ==================== 获取最新版本 ====================

  @Nested
  @DisplayName("Get Latest")
  class GetLatest {

    @Test
    @DisplayName("获取最新版本")
    void getLatest() {
      manager.save("p1", "V1", "cat", "v1", null, null);
      manager.save("p1", "V2", "cat", "v2", null, null);
      manager.save("p1", "V3", "cat", "v3", null, null);

      Optional<PromptTemplate> latest = manager.getLatest("p1");
      assertTrue(latest.isPresent());
      assertEquals(3, latest.get().getVersion());
      assertEquals("v3", latest.get().getContent());
    }

    @Test
    @DisplayName("不存在的模板返回空")
    void getLatestNotExists() {
      assertTrue(manager.getLatest("nonexistent").isEmpty());
    }

    @Test
    @DisplayName("只有一个版本")
    void singleVersion() {
      manager.save("p1", "V1", "cat", "only", null, null);

      Optional<PromptTemplate> latest = manager.getLatest("p1");
      assertTrue(latest.isPresent());
      assertEquals(1, latest.get().getVersion());
    }
  }

  // ==================== 获取指定版本 ====================

  @Nested
  @DisplayName("Get Specific Version")
  class GetVersion {

    @Test
    @DisplayName("获取指定版本")
    void getVersion() {
      manager.save("p1", "V1", "cat", "content-1", null, null);
      manager.save("p1", "V2", "cat", "content-2", null, null);
      manager.save("p1", "V3", "cat", "content-3", null, null);

      Optional<PromptTemplate> v2 = manager.getVersion("p1", 2);
      assertTrue(v2.isPresent());
      assertEquals(2, v2.get().getVersion());
      assertEquals("content-2", v2.get().getContent());
    }

    @Test
    @DisplayName("版本号越界返回空")
    void versionOutOfRange() {
      manager.save("p1", "V1", "cat", "content", null, null);

      assertTrue(manager.getVersion("p1", 0).isEmpty());
      assertTrue(manager.getVersion("p1", 2).isEmpty());
      assertTrue(manager.getVersion("p1", -1).isEmpty());
    }

    @Test
    @DisplayName("不存在的模板 ID 返回空")
    void templateNotExists() {
      assertTrue(manager.getVersion("nonexistent", 1).isEmpty());
    }
  }

  // ==================== 渲染 ====================

  @Nested
  @DisplayName("Render Templates")
  class RenderTemplates {

    @Test
    @DisplayName("单变量替换")
    void singleVariable() {
      String result = manager.render("Hello {{name}}!", Map.of("name", "World"));
      assertEquals("Hello World!", result);
    }

    @Test
    @DisplayName("多变量替换")
    void multipleVariables() {
      String result = manager.render("{{greeting}} {{name}}, you are {{age}}.",
          Map.of("greeting", "Hi", "name", "Alice", "age", "30"));
      assertEquals("Hi Alice, you are 30.", result);
    }

    @Test
    @DisplayName("未提供的变量保留原始占位符")
    void missingVariableKeptAsIs() {
      String result = manager.render("Hello {{name}}, {{title}}",
          Map.of("name", "Bob"));
      assertEquals("Hello Bob, {{title}}", result);
    }

    @Test
    @DisplayName("无占位符的文本不变")
    void noPlaceholders() {
      String result = manager.render("Plain text", Map.of("key", "val"));
      assertEquals("Plain text", result);
    }

    @Test
    @DisplayName("空变量映射保留所有占位符")
    void emptyVariables() {
      String result = manager.render("{{a}} and {{b}}", Map.of());
      assertEquals("{{a}} and {{b}}", result);
    }

    @Test
    @DisplayName("变量值中不包含特殊字符问题")
    void specialCharInValue() {
      String result = manager.render("Result: {{value}}",
          Map.of("value", "$100 (50%) off!"));
      assertEquals("Result: $100 (50%) off!", result);
    }

    @Test
    @DisplayName("重复变量全部替换")
    void repeatedVariable() {
      String result = manager.render("{{x}} + {{x}} = 2*{{x}}",
          Map.of("x", "5"));
      assertEquals("5 + 5 = 2*5", result);
    }
  }

  // ==================== 列表 ====================

  @Nested
  @DisplayName("List All")
  class ListAll {

    @Test
    @DisplayName("列出所有模板最新版本")
    void listAll() {
      manager.save("p1", "V1", "cat", "c1-v1", null, null);
      manager.save("p1", "V2", "cat", "c1-v2", null, null);
      manager.save("p2", "P2", "cat2", "c2-v1", null, null);

      List<PromptTemplate> all = manager.listAll();
      assertEquals(2, all.size());
    }

    @Test
    @DisplayName("空管理器返回空列表")
    void listAllEmpty() {
      assertTrue(manager.listAll().isEmpty());
    }
  }
}
