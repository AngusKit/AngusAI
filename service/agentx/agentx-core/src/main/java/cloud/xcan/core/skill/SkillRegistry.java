package cloud.xcan.core.skill;

import dev.langchain4j.service.tool.ToolProvider;
import dev.langchain4j.skills.Skill;
import dev.langchain4j.skills.Skills;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;

/**
 * 技能注册中心 — 基于 LangChain4j {@link Skill} 管理技能。
 * <p>
 * 技能通过 Spring Bean 自动注入或 {@link #register(Skill)} 注册。
 * Agent 通过 skillIds（技能名称）绑定技能，LLM 通过 activate_skill 工具按需加载。
 * </p>
 */
@Slf4j
public class SkillRegistry {

  private final java.util.Map<String, Skill> skillsByName = new ConcurrentHashMap<>();

  public SkillRegistry(List<Skill> autoDiscoveredSkills) {
    if (autoDiscoveredSkills != null) {
      for (Skill skill : autoDiscoveredSkills) {
        register(skill);
      }
    }
    log.info("SkillRegistry initialized with {} skills", skillsByName.size());
  }

  /**
   * 注册技能
   */
  public void register(Skill skill) {
    Objects.requireNonNull(skill, "skill");
    String name = skill.name();
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Skill name must not be blank");
    }
    skillsByName.put(name, skill);
    log.info("Skill registered: {} ({})", skill.description(), name);
  }

  /**
   * 获取技能
   */
  public Optional<Skill> get(String skillName) {
    return Optional.ofNullable(skillsByName.get(skillName));
  }

  /**
   * 解析技能列表（按名称过滤已注册的技能）
   */
  public List<Skill> resolveSkills(List<String> skillNames) {
    if (skillNames == null) {
      return List.of();
    }
    return skillNames.stream()
        .map(skillsByName::get)
        .filter(Objects::nonNull)
        .toList();
  }

  /**
   * 返回技能的 ToolProvider（activate_skill, read_skill_resource）
   */
  public Optional<ToolProvider> resolveSkillsToolProvider(List<String> skillNames) {
    List<Skill> skills = resolveSkills(skillNames);
    if (skills.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(Skills.from(skills).toolProvider());
  }

  /**
   * 格式化为系统提示中可用的技能列表（XML）
   */
  public String formatAvailableSkills(List<String> skillNames) {
    List<Skill> skills = resolveSkills(skillNames);
    if (skills.isEmpty()) {
      return "";
    }
    return Skills.from(skills).formatAvailableSkills();
  }

  /**
   * 注销技能
   */
  public void unregister(String skillName) {
    skillsByName.remove(skillName);
    log.info("Skill unregistered: {}", skillName);
  }

  /**
   * 列出所有技能
   */
  public List<Skill> listAll() {
    return List.copyOf(skillsByName.values());
  }
}
