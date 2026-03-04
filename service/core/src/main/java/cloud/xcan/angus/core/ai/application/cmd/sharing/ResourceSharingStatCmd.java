package cloud.xcan.angus.core.ai.application.cmd.sharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.ShareAccessAction;

public interface ResourceSharingStatCmd {

  void updateStats(ResourceType type, Long id, ShareAccessAction accessAction);
}
