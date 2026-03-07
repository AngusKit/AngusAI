package cloud.xcan.agentx.api.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 技能 DTO — 用于 REST API 与 LangChain4j Skill 互转
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDto {

  private String name;
  private String description;
  private String content;
  private List<ResourceDto> resources;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResourceDto {

    private String relativePath;
    private String content;
  }
}
