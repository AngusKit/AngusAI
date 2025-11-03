package cloud.xcan.angus.core.ai.application.cmd.team.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingMemberCmd;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMemberRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
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
          ResourceSharingMember member = new ResourceSharingMember();
          member.setSharingId(sharing.getId());
          member.setUserId(memberId);
          member.setPermission(nullSafe(sharing.getPermission(), SharePermission.VIEW));
          member.setAccessCount(0L);
          resourceSharingMemberRepo.save(member);
        }
      }
    }
  }

  @Override
  public void updateMemberAccessStats(Long userId, ShareAccessAction accessAction) {
    ResourceSharingMember member = resourceSharingMemberRepo.findByUserIdAndPermission(
        userId, accessAction.toPermission());
    if (member == null) {
      member = new ResourceSharingMember();
      member.setSharingId(null);
      member.setPermission(accessAction.toPermission());
      member.setUserId(userId);
      member.setLastAccessed(LocalDateTime.now());
      member.setAccessCount(1L);
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
