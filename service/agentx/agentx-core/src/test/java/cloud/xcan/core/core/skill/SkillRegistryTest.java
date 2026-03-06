package cloud.xcan.core.core.skill;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.langchain4j.skills.DefaultSkill;
import dev.langchain4j.skills.Skill;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import cloud.xcan.core.skill.SkillRegistry;

/**
 * SkillRegistry 单元测试 — 基于 LangChain4j Skill
 */
@DisplayName("SkillRegistry Tests")
class SkillRegistryTest {

  private SkillRegistry registry;

  @BeforeEach
  void setUp() {
    registry = new SkillRegistry(Collections.emptyList());
  }

  @Nested
  @DisplayName("Registration")
  class Registration {

    @Test
    @DisplayName("注册并获取技能")
    void registerAndGet() {
      Skill skill = DefaultSkill.builder()
          .name("test-skill")
          .description("A test skill")
          .content("Test content")
          .build();

      registry.register(skill);

      Optional<Skill> result = registry.get("test-skill");
      assertTrue(result.isPresent());
      assertEquals("A test skill", result.get().description());
      assertEquals("Test content", result.get().content());
    }

    @Test
    @DisplayName("获取不存在的技能返回空")
    void getNotExists() {
      assertTrue(registry.get("nonexistent").isEmpty());
    }
  }

  @Nested
  @DisplayName("Auto Discovery")
  class AutoDiscovery {

    @Test
    @DisplayName("构造函数自动发现技能")
    void autoDiscoversSkills() {
      Skill s1 = DefaultSkill.builder().name("auto-1").description("Auto 1").content("C1").build();
      Skill s2 = DefaultSkill.builder().name("auto-2").description("Auto 2").content("C2").build();

      SkillRegistry autoRegistry = new SkillRegistry(List.of(s1, s2));

      assertEquals(2, autoRegistry.listAll().size());
      assertTrue(autoRegistry.get("auto-1").isPresent());
      assertTrue(autoRegistry.get("auto-2").isPresent());
    }

    @Test
    @DisplayName("null list 不抛异常")
    void nullListSafe() {
      assertDoesNotThrow(() -> new SkillRegistry(null));
    }
  }

  @Nested
  @DisplayName("Resolution")
  class Resolution {

    @BeforeEach
    void setUpSkills() {
      registry.register(DefaultSkill.builder()
          .name("s1").description("S1").content("Content 1").build());
      registry.register(DefaultSkill.builder()
          .name("s2").description("S2").content("Content 2").build());
    }

    @Test
    @DisplayName("resolveSkills — 按名称解析")
    void resolveSkills() {
      List<Skill> skills = registry.resolveSkills(List.of("s1", "s2"));
      assertEquals(2, skills.size());
    }

    @Test
    @DisplayName("resolveSkills — null 输入返回空列表")
    void resolveSkillsNull() {
      assertEquals(List.of(), registry.resolveSkills(null));
    }

    @Test
    @DisplayName("resolveSkills — 包含不存在的名称会过滤")
    void resolveSkillsWithMissing() {
      List<Skill> skills = registry.resolveSkills(List.of("s1", "nonexistent"));
      assertEquals(1, skills.size());
    }

    @Test
    @DisplayName("resolveSkillsToolProvider — 有技能时返回 provider")
    void resolveSkillsToolProvider() {
      assertTrue(registry.resolveSkillsToolProvider(List.of("s1")).isPresent());
    }

    @Test
    @DisplayName("resolveSkillsToolProvider — 无技能时返回空")
    void resolveSkillsToolProviderEmpty() {
      assertFalse(registry.resolveSkillsToolProvider(List.of()).isPresent());
      assertFalse(registry.resolveSkillsToolProvider(List.of("nonexistent")).isPresent());
    }

    @Test
    @DisplayName("formatAvailableSkills — 返回非空 XML")
    void formatAvailableSkills() {
      String xml = registry.formatAvailableSkills(List.of("s1", "s2"));
      assertTrue(xml.contains("<available_skills>"));
      assertTrue(xml.contains("s1"));
      assertTrue(xml.contains("s2"));
    }
  }

  @Nested
  @DisplayName("Unregister")
  class Unregister {

    @Test
    @DisplayName("注销技能")
    void unregister() {
      registry.register(DefaultSkill.builder().name("del-1").description("Del").content("x").build());
      registry.unregister("del-1");
      assertTrue(registry.get("del-1").isEmpty());
    }
  }

  @Nested
  @DisplayName("List Skills")
  class ListSkills {

    @Test
    @DisplayName("列出所有技能")
    void listAll() {
      registry.register(DefaultSkill.builder().name("l1").description("L1").content("Content 1").build());
      registry.register(DefaultSkill.builder().name("l2").description("L2").content("Content 2").build());
      assertEquals(2, registry.listAll().size());
    }
  }
}
