package com.agentx.api.controller;

import com.agentx.api.dto.ApiResponse;
import com.agentx.core.skill.SkillDefinition;
import com.agentx.core.skill.SkillRegistry;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 技能管理接口
 */
@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

  private final SkillRegistry skillRegistry;

  /**
   * 列出所有技能
   */
  @GetMapping
  public ApiResponse<List<SkillDefinition>> listSkills(
      @RequestParam(required = false) String category) {
    if (category != null) {
      return ApiResponse.ok(skillRegistry.listByCategory(category));
    }
    return ApiResponse.ok(skillRegistry.listAll());
  }

  /**
   * 获取技能详情
   */
  @GetMapping("/{skillId}")
  public ApiResponse<SkillDefinition> getSkill(@PathVariable String skillId) {
    return skillRegistry.get(skillId)
        .map(ApiResponse::ok)
        .orElse(ApiResponse.error(404, "Skill not found: " + skillId));
  }

  /**
   * 注册声明式技能
   */
  @PostMapping
  public ApiResponse<Void> registerSkill(@RequestBody SkillDefinition definition) {
    skillRegistry.register(definition);
    return ApiResponse.ok(null);
  }

  /**
   * 执行编程式技能
   */
  @PostMapping("/{skillId}/execute")
  public ApiResponse<String> executeSkill(
      @PathVariable String skillId,
      @RequestBody Map<String, Object> input) {
    String result = skillRegistry.executeSkill(skillId, input);
    return ApiResponse.ok(result);
  }

  /**
   * 注销技能
   */
  @DeleteMapping("/{skillId}")
  public ApiResponse<Void> unregisterSkill(@PathVariable String skillId) {
    skillRegistry.unregister(skillId);
    return ApiResponse.ok(null);
  }
}
