package cloud.xcan.angus.core.ai.application.cmd.team.impl;

import cloud.xcan.angus.core.ai.application.cmd.team.TeamSettingsCmd;
import cloud.xcan.angus.core.ai.domain.team.TeamSettings;
import cloud.xcan.angus.core.ai.domain.team.TeamSettingsRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import jakarta.persistence.Transient;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TeamSettingsCmdImpl extends CommCmd<TeamSettings, Long> implements TeamSettingsCmd {

  @Resource
  private TeamSettingsRepo teamSettingsRepo;

  @Transient
  @Override
  public TeamSettings update(TeamSettings settings) {
    return new BizTemplate<TeamSettings>() {
      @Override
      protected TeamSettings process() {
        List<TeamSettings> settingsDb = teamSettingsRepo.findAll();
        if (settingsDb.isEmpty()) {
          insert(settings);
          return settings;
        }

        update(settingsDb.get(0), settings);
        return settingsDb.get(0);
      }
    }.execute();
  }

  @Override
  protected BaseRepository<TeamSettings, Long> getRepository() {
    return teamSettingsRepo;
  }
}
