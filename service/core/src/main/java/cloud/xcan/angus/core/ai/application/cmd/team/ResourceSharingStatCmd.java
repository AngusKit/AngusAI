package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;

public interface ResourceSharingStatCmd {

  void updateStats(ResourceType type, Long id, ShareAccessAction accessAction);
}
