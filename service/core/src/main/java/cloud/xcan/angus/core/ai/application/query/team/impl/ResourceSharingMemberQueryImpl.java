package cloud.xcan.angus.core.ai.application.query.team.impl;

import cloud.xcan.angus.core.ai.application.query.team.ResourceSharingMemberQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMemberRepo;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ResourceSharingMemberQueryImpl implements ResourceSharingMemberQuery {

  @Resource
  private ResourceSharingMemberRepo resourceSharingMemberRepo;

  @Override
  public List<ResourceSharingMember> findBySharingIdOrderByCreatedDateDesc(Long sharingId) {
    return resourceSharingMemberRepo.findBySharingIdOrderByCreatedDateDesc(sharingId);
  }

  @Override
  public List<ResourceSharingMember> findByUserIdAndResourceIdAndResourceType(Long userId,
      Long resourceId, ResourceType resourceType) {
    return resourceSharingMemberRepo.findByUserIdAndResourceIdAndResourceType(
        userId, resourceId, resourceType);
  }
}
