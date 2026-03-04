package cloud.xcan.angus.core.ai.application.cmd.sharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ShareAccessAction;

public interface ResourceSharingMemberCmd {

  void addMembers(ResourceSharing sharing);

  void updateMemberAccessStats(Long userId, ResourceType resourceType, Long resourceId,
      ShareAccessAction accessAction);

  void deleteBySharingId(Long id);

}
