package cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.team.TeamSettings;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.TeamSettingsDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.TeamSettingsVo;

public class TeamSettingsAssembler {

  public static TeamSettings toDomain(TeamSettingsDto dto) {
    TeamSettings settings = new TeamSettings();
    settings.setTeamAvatar(dto.getTeamAvatar());
    settings.setTeamName(dto.getTeamName());
    settings.setTeamDescription(dto.getTeamDescription());
    settings.setTeamScale(dto.getTeamScale());
    settings.setIndustry(dto.getIndustry());
    return settings;
  }

  public static TeamSettingsVo toVo(TeamSettings settings) {
    TeamSettingsVo vo = new TeamSettingsVo();
    vo.setId(settings.getId());
    vo.setTeamAvatar(settings.getTeamAvatar());
    vo.setTeamName(settings.getTeamName());
    vo.setTeamDescription(settings.getTeamDescription());
    vo.setTeamScale(settings.getTeamScale());
    vo.setIndustry(settings.getIndustry());

    // 设置审计信息
    vo.setTenantId(settings.getTenantId());
    vo.setCreatedBy(settings.getCreatedBy());
    vo.setCreatedDate(settings.getCreatedDate());
    vo.setModifiedBy(settings.getModifiedBy());
    vo.setModifiedDate(settings.getModifiedDate());
    return vo;
  }
}
