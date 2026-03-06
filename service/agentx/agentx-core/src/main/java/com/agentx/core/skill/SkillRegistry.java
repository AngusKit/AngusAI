package com.agentx.core.skill;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

/**
 * 技能注册中心 — 统一管理所有技能定义与编程式技能实例。
 * <p>
 * 技能可通过以下方式注册：
 * <ul>
 *   <li>声明式：通过 {@link #register(SkillDefinition)} 注册 JSON/YAML 定义</li>
 *   <li>编程式：通过 {@link #registerSkill(Skill)} 注册实现了 {@link Skill} 接口的 Bean</li>
 *   <li>自动发现：Spring Bean 自动注入实现 {@link Skill} 接口的组件</li>
 * </ul>
 * </p>
 */
@Slf4j
public class SkillRegistry {

  private final Map<String, SkillDefinition> definitions = new ConcurrentHashMap<>();
  private final Map<String, Skill> executableSkills = new ConcurrentHashMap<>();

  public SkillRegistry(List<Skill> autoDiscoveredSkills) {
    if (autoDiscoveredSkills != null) {
      for (Skill skill : autoDiscoveredSkills) {
        registerSkill(skill);
      }
    }
    log.info("SkillRegistry initialized with {} skills", definitions.size());
  }

  /**
   * 注册声明式技能定义
   */
  public void register(SkillDefinition definition) {
    definitions.put(definition.getId(), definition);
    log.info("Skill registered: {} ({})", definition.getName(), definition.getId());
  }

  /**
   * 注册编程式技能
   */
  public void registerSkill(Skill skill) {
    SkillDefinition def = skill.getDefinition();
    definitions.put(def.getId(), def);
    executableSkills.put(def.getId(), skill);
    log.info("Executable skill registered: {} ({})", def.getName(), def.getId());
  }

  /**
   * 获取技能定义
   */
  public Optional<SkillDefinition> get(String skillId) {
    return Optional.ofNullable(definitions.get(skillId));
  }

  /**
   * 获取编程式技能实例
   */
  public Optional<Skill> getExecutableSkill(String skillId) {
    return Optional.ofNullable(executableSkills.get(skillId));
  }

  /**
   * 获取多个技能的聚合工具 ID 列表
   */
  public List<String> resolveToolIds(List<String> skillIds) {
    if (skillIds == null) {
      return List.of();
    }
    return skillIds.stream()
        .map(definitions::get)
        .filter(Objects::nonNull)
        .filter(SkillDefinition::isEnabled)
        .map(SkillDefinition::getToolIds)
        .filter(Objects::nonNull)
        .flatMap(Collection::stream)
        .distinct()
        .toList();
  }

  /**
   * 构建多个技能的聚合提示词片段
   */
  public String resolvePromptFragments(List<String> skillIds) {
    if (skillIds == null) {
      return "";
    }
    return skillIds.stream()
        .map(definitions::get)
        .filter(Objects::nonNull)
        .filter(SkillDefinition::isEnabled)
        .map(SkillDefinition::getPromptFragment)
        .filter(Objects::nonNull)
        .collect(Collectors.joining("\n\n"));
  }

  /**
   * 获取多个技能的聚合知识库 ID 列表
   */
  public List<String> resolveKnowledgeBaseIds(List<String> skillIds) {
    if (skillIds == null) {
      return List.of();
    }
    return skillIds.stream()
        .map(definitions::get)
        .filter(Objects::nonNull)
        .filter(SkillDefinition::isEnabled)
        .map(SkillDefinition::getKnowledgeBaseIds)
        .filter(Objects::nonNull)
        .flatMap(Collection::stream)
        .distinct()
        .toList();
  }

  /**
   * 注销技能
   */
  public void unregister(String skillId) {
    definitions.remove(skillId);
    executableSkills.remove(skillId);
    log.info("Skill unregistered: {}", skillId);
  }

  /**
   * 列出所有技能
   */
  public List<SkillDefinition> listAll() {
    return List.copyOf(definitions.values());
  }

  /**
   * 按分类列出技能
   */
  public List<SkillDefinition> listByCategory(String category) {
    return definitions.values().stream()
        .filter(d -> category.equals(d.getCategory()))
        .toList();
  }

  /**
   * 执行编程式技能
   */
  public String executeSkill(String skillId, Map<String, Object> input) {
    Skill skill = executableSkills.get(skillId);
    if (skill == null) {
      throw new IllegalArgumentException("Executable skill not found: " + skillId);
    }
    if (!skill.isAvailable()) {
      throw new IllegalStateException("Skill is not available: " + skillId);
    }
    return skill.execute(input);
  }
}
