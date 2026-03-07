package cloud.xcan.agentx.api.controller;

import cloud.xcan.agentx.api.dto.SkillDto;
import cloud.xcan.agentx.api.dto.ApiResponse;
import cloud.xcan.core.skill.SkillRegistry;
import dev.langchain4j.skills.DefaultSkill;
import dev.langchain4j.skills.DefaultSkillResource;
import dev.langchain4j.skills.Skill;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 技能管理接口 — 基于 LangChain4j Skill
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
  public ApiResponse<List<SkillDto>> listSkills() {
    List<SkillDto> list = skillRegistry.listAll().stream()
        .map(this::toDto)
        .collect(Collectors.toList());
    return ApiResponse.ok(list);
  }

  /**
   * 获取技能详情
   */
  @GetMapping("/{skillName}")
  public ApiResponse<SkillDto> getSkill(@PathVariable String skillName) {
    return skillRegistry.get(skillName)
        .map(this::toDto)
        .map(ApiResponse::ok)
        .orElse(ApiResponse.error(404, "Skill not found: " + skillName));
  }

  /**
   * 注册技能
   */
  @PostMapping
  public ApiResponse<Void> registerSkill(@RequestBody SkillDto dto) {
    Skill skill = fromDto(dto);
    skillRegistry.register(skill);
    return ApiResponse.ok(null);
  }

  /**
   * 注销技能
   */
  @DeleteMapping("/{skillName}")
  public ApiResponse<Void> unregisterSkill(@PathVariable String skillName) {
    skillRegistry.unregister(skillName);
    return ApiResponse.ok(null);
  }

  private SkillDto toDto(Skill s) {
    return SkillDto.builder()
        .name(s.name())
        .description(s.description())
        .content(s.content())
        .resources(s.resources() != null && !s.resources().isEmpty()
            ? s.resources().stream()
                .map(r -> SkillDto.ResourceDto.builder()
                    .relativePath(r.relativePath())
                    .content(r.content())
                    .build())
                .collect(Collectors.toList())
            : null)
        .build();
  }

  private Skill fromDto(SkillDto dto) {
    String content = dto.getContent();
    if (content == null || content.isBlank()) {
      content = "No instructions.";
    }
    DefaultSkill.Builder builder = DefaultSkill.builder()
        .name(dto.getName())
        .description(dto.getDescription() != null && !dto.getDescription().isBlank()
            ? dto.getDescription() : dto.getName())
        .content(content);
    if (dto.getResources() != null && !dto.getResources().isEmpty()) {
      builder.resources(dto.getResources().stream()
          .map(r -> DefaultSkillResource.builder()
              .relativePath(r.getRelativePath())
              .content(r.getContent())
              .build())
          .collect(Collectors.toList()));
    }
    return builder.build();
  }
}
