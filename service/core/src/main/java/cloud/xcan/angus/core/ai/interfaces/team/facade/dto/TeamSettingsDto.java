package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.team.Industry;
import cloud.xcan.angus.core.ai.domain.team.TeamScale;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TeamSettingsDto{

  @Length(max = 400)
  @Schema(description = "团队头像")
  private String teamAvatar;

  @Length(max = 50)
  @Schema(description = "团队名称")
  private String teamName;

  @Length(max = 100)
  @Schema(description = "团队邮箱")
  private String teamEmail;

  @Length(max = 200)
  @Schema(description = "团队描述")
  private String teamDescription;

  @Schema(description = "团队规模")
  private TeamScale teamScale;

  @Schema(description = "所在行业")
  private Industry industry;

}
