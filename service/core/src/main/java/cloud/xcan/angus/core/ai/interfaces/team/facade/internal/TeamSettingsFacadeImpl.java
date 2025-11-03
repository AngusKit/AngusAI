package cloud.xcan.angus.core.ai.interfaces.team.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.team.TeamSettingsCmd;
import cloud.xcan.angus.core.ai.application.query.team.TeamSettingsQuery;
import cloud.xcan.angus.core.ai.domain.team.TeamSettings;
import cloud.xcan.angus.core.ai.interfaces.team.facade.TeamSettingsFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.TeamSettingsDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler.TeamSettingsAssembler;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.TeamSettingsVo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

@Component
public class TeamSettingsFacadeImpl implements TeamSettingsFacade {

  @Resource
  private TeamSettingsQuery teamSettingsQuery;

  @Resource
  private TeamSettingsCmd teamSettingsCmd;

  @Override
  public TeamSettingsVo update(TeamSettingsDto dto) {
    TeamSettings settings = TeamSettingsAssembler.toDomain(dto);
    TeamSettings saved = teamSettingsCmd.update(settings);
    return TeamSettingsAssembler.toVo(saved);
  }

  @Override
  public TeamSettingsVo getDetail() {
    TeamSettings settings = teamSettingsQuery.getDetail();
    return TeamSettingsAssembler.toVo(settings);
  }
}
