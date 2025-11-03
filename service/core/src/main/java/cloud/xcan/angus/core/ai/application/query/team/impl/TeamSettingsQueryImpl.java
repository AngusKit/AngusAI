package cloud.xcan.angus.core.ai.application.query.team.impl;

import cloud.xcan.angus.core.ai.application.query.team.TeamSettingsQuery;
import cloud.xcan.angus.core.ai.domain.team.TeamSettings;
import cloud.xcan.angus.core.ai.domain.team.TeamSettingsRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TeamSettingsQueryImpl implements TeamSettingsQuery {

  @Resource
  private TeamSettingsRepo teamSettingsRepo;

  @Override
  public TeamSettings getDetail() {
    return new BizTemplate<TeamSettings>() {
      @Override
      protected TeamSettings process() {
        List<TeamSettings> settings = teamSettingsRepo.findAll();
        return settings.isEmpty() ? new TeamSettings() : settings.get(0);
      }
    }.execute();
  }
}
