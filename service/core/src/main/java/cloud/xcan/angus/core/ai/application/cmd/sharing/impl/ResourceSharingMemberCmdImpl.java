package cloud.xcan.angus.core.ai.application.cmd.sharing.impl;

import static cloud.xcan.angus.core.ai.application.converter.ResourceSharingConverter.toAccessStatsMember;
import static cloud.xcan.angus.core.ai.application.converter.ResourceSharingConverter.toMemberDomain;

import cloud.xcan.angus.core.ai.application.cmd.sharing.ResourceSharingMemberCmd;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMemberRepo;
import cloud.xcan.angus.core.ai.domain.sharing.ShareAccessAction;
import cloud.xcan.angus.core.ai.domain.sharing.SharedWith;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class ResourceSharingMemberCmdImpl extends CommCmd<ResourceSharingMember, Long>
    implements ResourceSharingMemberCmd {

  @Resource
  private ResourceSharingMemberRepo resourceSharingMemberRepo;

  @Override
  public void addMembers(ResourceSharing sharing) {
    Long resourceOwnerId = sharing.getOwnerId();
    if (sharing.getSharedWith() == SharedWith.SPECIFIC && sharing.getMemberIds() != null) {
      for (Long memberId : sharing.getMemberIds()) {
        // 不添加所有者自己
        if (!memberId.equals(resourceOwnerId)) {
          ResourceSharingMember member = toMemberDomain(sharing, memberId);
          resourceSharingMemberRepo.save(member);
        }
      }
    }
  }

  @Override
  public void updateMemberAccessStats(Long userId, ResourceType resourceType, Long resourceId,
      ShareAccessAction accessAction) {
    ResourceSharingMember member = resourceSharingMemberRepo.findByUserIdAndPermission(
        userId, accessAction.toPermission());
    if (member == null) {
      member = toAccessStatsMember(userId, resourceType, resourceId, accessAction);
      insert(member);
    } else {
      member.setLastAccessed(LocalDateTime.now());
      member.setAccessCount(member.getAccessCount() + 1);
      resourceSharingMemberRepo.save(member);
    }
  }

  @Override
  public void deleteBySharingId(Long id) {
    resourceSharingMemberRepo.deleteBySharingId(id);
  }

  @Override
  protected BaseRepository<ResourceSharingMember, Long> getRepository() {
    return resourceSharingMemberRepo;
  }
}
