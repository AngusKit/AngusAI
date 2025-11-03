package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;

public interface ResourceSharingMemberCmd {

  void addMembers(ResourceSharing sharing);

  void updateMemberAccessStats(Long userId, ShareAccessAction accessAction);

  void deleteBySharingId(Long id);

}
