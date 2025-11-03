package cloud.xcan.angus.core.ai.application.query.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import java.util.List;

public interface ResourceSharingMemberQuery {

  List<ResourceSharingMember> findBySharingIdOrderByCreatedDateDesc(Long sharingId);

  List<ResourceSharingMember> findByUserIdAndResourceIdAndResourceType(Long userId, Long resourceId,
      ResourceType resourceType);
}
