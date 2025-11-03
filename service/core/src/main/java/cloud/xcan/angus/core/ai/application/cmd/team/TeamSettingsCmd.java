package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.team.TeamSettings;

public interface TeamSettingsCmd {

  TeamSettings update(TeamSettings settings);
}
