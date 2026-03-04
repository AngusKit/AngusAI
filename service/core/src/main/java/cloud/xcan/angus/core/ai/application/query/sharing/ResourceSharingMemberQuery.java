package cloud.xcan.angus.core.ai.application.query.sharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMember;
import java.util.List;

public interface ResourceSharingMemberQuery {

  List<ResourceSharingMember> findBySharingIdOrderByCreatedDateDesc(Long sharingId);

  List<ResourceSharingMember> findByUserIdAndResourceIdAndResourceType(Long userId, Long resourceId,
      ResourceType resourceType);
}
