package com.agentx.core.skill;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SkillRegistry 单元测试 — 覆盖声明式/编程式注册、聚合解析、执行
 */
@DisplayName("SkillRegistry Tests")
class SkillRegistryTest {

  private SkillRegistry registry;

  @BeforeEach
  void setUp() {
    registry = new SkillRegistry(Collections.emptyList());
  }

  // ==================== 声明式注册 ====================

  @Nested
  @DisplayName("Declarative Registration")
  class DeclarativeRegistration {

    @Test
    @DisplayName("注册并获取声明式技能定义")
    void registerAndGet() {
      SkillDefinition def = SkillDefinition.builder()
          .id("skill-1")
          .name("Test Skill")
          .description("A test skill")
          .category("tool_use")
          .toolIds(List.of("tool-a", "tool-b"))
          .promptFragment("You have tool_use capability.")
          .build();

      registry.register(def);

      Optional<SkillDefinition> result = registry.get("skill-1");
      assertTrue(result.isPresent());
      assertEquals("Test Skill", result.get().getName());
      assertEquals("tool_use", result.get().getCategory());
    }

    @Test
    @DisplayName("获取不存在的技能返回空")
    void getNotExists() {
      assertTrue(registry.get("nonexistent").isEmpty());
    }

    @Test
    @DisplayName("声明式技能不可执行")
    void declarativeNotExecutable() {
      registry.register(SkillDefinition.builder()
          .id("decl-1").name("Declarative").build());

      assertTrue(registry.getExecutableSkill("decl-1").isEmpty());
    }
  }

  // ==================== 编程式注册 ====================

  @Nested
  @DisplayName("Programmatic Registration")
  class ProgrammaticRegistration {

    @Test
    @DisplayName("注册编程式技能")
    void registerExecutableSkill() {
      Skill skill = new TestSkill("prog-1", "Programmatic Skill");
      registry.registerSkill(skill);

      assertTrue(registry.get("prog-1").isPresent());
      assertTrue(registry.getExecutableSkill("prog-1").isPresent());
    }

    @Test
    @DisplayName("获取不存在的编程式技能返回空")
    void getNotExists() {
      assertTrue(registry.getExecutableSkill("nope").isEmpty());
    }
  }

  // ==================== 自动发现 ====================

  @Nested
  @DisplayName("Auto Discovery")
  class AutoDiscovery {

    @Test
    @DisplayName("构造函数自动发现技能")
    void autoDiscoversSkills() {
      Skill s1 = new TestSkill("auto-1", "Auto 1");
      Skill s2 = new TestSkill("auto-2", "Auto 2");

      SkillRegistry autoRegistry = new SkillRegistry(List.of(s1, s2));

      assertEquals(2, autoRegistry.listAll().size());
      assertTrue(autoRegistry.getExecutableSkill("auto-1").isPresent());
      assertTrue(autoRegistry.getExecutableSkill("auto-2").isPresent());
    }

    @Test
    @DisplayName("null list 不抛异常")
    void nullListSafe() {
      assertDoesNotThrow(() -> new SkillRegistry(null));
    }
  }

  // ==================== 聚合解析 ====================

  @Nested
  @DisplayName("Aggregate Resolution")
  class AggregateResolution {

    @BeforeEach
    void setUpSkills() {
      registry.register(SkillDefinition.builder()
          .id("s1").name("S1")
          .toolIds(List.of("tool-a", "tool-b"))
          .promptFragment("Fragment 1")
          .knowledgeBaseIds(List.of("kb-1"))
          .enabled(true)
          .build());
      registry.register(SkillDefinition.builder()
          .id("s2").name("S2")
          .toolIds(List.of("tool-b", "tool-c"))
          .promptFragment("Fragment 2")
          .knowledgeBaseIds(List.of("kb-1", "kb-2"))
          .enabled(true)
          .build());
      registry.register(SkillDefinition.builder()
          .id("s3").name("S3 Disabled")
          .toolIds(List.of("tool-d"))
          .promptFragment("Disabled")
          .enabled(false)
          .build());
    }

    @Test
    @DisplayName("resolveToolIds — 去重合并")
    void resolveToolIds() {
      List<String> toolIds = registry.resolveToolIds(List.of("s1", "s2"));
      assertTrue(toolIds.contains("tool-a"));
      assertTrue(toolIds.contains("tool-b"));
      assertTrue(toolIds.contains("tool-c"));
      // tool-b 不重复
      assertEquals(3, toolIds.size());
    }

    @Test
    @DisplayName("resolveToolIds — 排除禁用技能")
    void resolveToolIdsExcludesDisabled() {
      List<String> toolIds = registry.resolveToolIds(List.of("s1", "s3"));
      assertFalse(toolIds.contains("tool-d"));
    }

    @Test
    @DisplayName("resolveToolIds — null 输入返回空列表")
    void resolveToolIdsNull() {
      assertEquals(List.of(), registry.resolveToolIds(null));
    }

    @Test
    @DisplayName("resolveToolIds — 包含不存在的技能 ID 不抛异常")
    void resolveToolIdsWithMissing() {
      List<String> toolIds = registry.resolveToolIds(List.of("s1", "nonexistent"));
      assertEquals(2, toolIds.size());
    }

    @Test
    @DisplayName("resolvePromptFragments — 合并提示词片段")
    void resolvePromptFragments() {
      String fragments = registry.resolvePromptFragments(List.of("s1", "s2"));
      assertTrue(fragments.contains("Fragment 1"));
      assertTrue(fragments.contains("Fragment 2"));
    }

    @Test
    @DisplayName("resolvePromptFragments — 排除禁用技能")
    void resolvePromptFragmentsExcludesDisabled() {
      String fragments = registry.resolvePromptFragments(List.of("s1", "s3"));
      assertFalse(fragments.contains("Disabled"));
    }

    @Test
    @DisplayName("resolvePromptFragments — null 输入返回空字符串")
    void resolvePromptFragmentsNull() {
      assertEquals("", registry.resolvePromptFragments(null));
    }

    @Test
    @DisplayName("resolveKnowledgeBaseIds — 去重合并")
    void resolveKnowledgeBaseIds() {
      List<String> kbIds = registry.resolveKnowledgeBaseIds(List.of("s1", "s2"));
      assertTrue(kbIds.contains("kb-1"));
      assertTrue(kbIds.contains("kb-2"));
      assertEquals(2, kbIds.size());
    }

    @Test
    @DisplayName("resolveKnowledgeBaseIds — null 输入返回空列表")
    void resolveKnowledgeBaseIdsNull() {
      assertEquals(List.of(), registry.resolveKnowledgeBaseIds(null));
    }
  }

  // ==================== 注销 ====================

  @Nested
  @DisplayName("Unregister")
  class Unregister {

    @Test
    @DisplayName("注销声明式技能")
    void unregisterDeclarative() {
      registry.register(SkillDefinition.builder().id("del-1").name("Del").build());
      registry.unregister("del-1");
      assertTrue(registry.get("del-1").isEmpty());
    }

    @Test
    @DisplayName("注销编程式技能同时移除执行器")
    void unregisterExecutable() {
      registry.registerSkill(new TestSkill("del-2", "Del Exec"));
      registry.unregister("del-2");
      assertTrue(registry.get("del-2").isEmpty());
      assertTrue(registry.getExecutableSkill("del-2").isEmpty());
    }
  }

  // ==================== 列表 ====================

  @Nested
  @DisplayName("List Skills")
  class ListSkills {

    @Test
    @DisplayName("列出所有技能")
    void listAll() {
      registry.register(SkillDefinition.builder().id("l1").name("L1").build());
      registry.register(SkillDefinition.builder().id("l2").name("L2").build());
      assertEquals(2, registry.listAll().size());
    }

    @Test
    @DisplayName("按分类列出")
    void listByCategory() {
      registry.register(SkillDefinition.builder()
          .id("coding-1").name("Coding").category("coding").build());
      registry.register(SkillDefinition.builder()
          .id("analysis-1").name("Analysis").category("analysis").build());
      registry.register(SkillDefinition.builder()
          .id("coding-2").name("Coding 2").category("coding").build());

      List<SkillDefinition> codingSkills = registry.listByCategory("coding");
      assertEquals(2, codingSkills.size());
    }
  }

  // ==================== 执行 ====================

  @Nested
  @DisplayName("Execute Skill")
  class ExecuteSkill {

    @Test
    @DisplayName("执行可用的编程式技能")
    void executeAvailable() {
      registry.registerSkill(new TestSkill("exec-1", "Executable"));
      String result = registry.executeSkill("exec-1", Map.of("input", "test"));
      assertEquals("executed: {input=test}", result);
    }

    @Test
    @DisplayName("执行不存在的技能抛出异常")
    void executeNotFound() {
      assertThrows(IllegalArgumentException.class,
          () -> registry.executeSkill("missing", Map.of()));
    }

    @Test
    @DisplayName("执行不可用的技能抛出异常")
    void executeUnavailable() {
      registry.registerSkill(new UnavailableSkill());
      assertThrows(IllegalStateException.class,
          () -> registry.executeSkill("unavailable-skill", Map.of()));
    }
  }

  // ==================== SkillDefinition ====================

  @Nested
  @DisplayName("SkillDefinition Defaults")
  class SkillDefinitionDefaults {

    @Test
    @DisplayName("默认值验证")
    void defaults() {
      SkillDefinition def = SkillDefinition.builder()
          .id("def-1").name("Default Skill").build();
      assertEquals("1.0.0", def.getVersion());
      assertTrue(def.isEnabled());
    }
  }

  // ==================== 辅助类 ====================

  static class TestSkill implements Skill {

    private final SkillDefinition definition;

    TestSkill(String id, String name) {
      this.definition = SkillDefinition.builder()
          .id(id).name(name).enabled(true).build();
    }

    @Override
    public SkillDefinition getDefinition() {
      return definition;
    }

    @Override
    public String execute(Map<String, Object> input) {
      return "executed: " + input;
    }
  }

  static class UnavailableSkill implements Skill {

    @Override
    public SkillDefinition getDefinition() {
      return SkillDefinition.builder()
          .id("unavailable-skill").name("Unavailable").enabled(false).build();
    }

    @Override
    public String execute(Map<String, Object> input) {
      return "should not reach here";
    }

    @Override
    public boolean isAvailable() {
      return false;
    }
  }
}
