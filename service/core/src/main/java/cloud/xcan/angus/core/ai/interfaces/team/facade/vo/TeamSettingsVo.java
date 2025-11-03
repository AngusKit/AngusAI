package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import cloud.xcan.angus.core.ai.domain.team.Industry;
import cloud.xcan.angus.core.ai.domain.team.TeamScale;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class TeamSettingsVo extends TenantAuditingVo {

  @Schema(description = "团队ID")
  private Long id;

  @Schema(description = "团队头像")
  private String teamAvatar;

  @Schema(description = "团队名称")
  private String teamName;

  @Schema(description = "团队邮箱")
  private String teamEmail;

  @Schema(description = "团队描述")
  private String teamDescription;

  @Schema(description = "团队规模")
  private TeamScale teamScale;

  @Schema(description = "所在行业")
  private Industry industry;

}
