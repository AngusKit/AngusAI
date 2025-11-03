package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingStat;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import java.time.LocalDateTime;
import java.util.Map;

public class ResourceSharingConverter {

  public static ResourceSharingMember toMemberDomain(ResourceSharing sharing, Long memberId) {
    ResourceSharingMember member = new ResourceSharingMember();
    member.setSharingId(sharing.getId());
    member.setResourceId(sharing.getResourceId());
    member.setResourceType(sharing.getResourceType());
    member.setUserId(memberId);
    member.setPermission(nullSafe(sharing.getPermission(), SharePermission.VIEW));
    member.setAccessCount(0L);
    return member;
  }

  public static ResourceSharingMember toAccessStatsMember(Long userId,
      ResourceType resourceType, Long resourceId, ShareAccessAction accessAction) {
    ResourceSharingMember member;
    member = new ResourceSharingMember();
    member.setSharingId(null);
    member.setResourceId(resourceId);
    member.setResourceType(resourceType);
    member.setPermission(accessAction.toPermission());
    member.setUserId(userId);
    member.setLastAccessed(LocalDateTime.now());
    member.setAccessCount(1L);
    return member;
  }

  public static ResourceSharingAccessLog toAccessLogDomain(Long resourceId,
      ResourceType resourceType, Long userId, ShareAccessAction accessAction,
      Map<String, Object> metadata) {
    ResourceSharingAccessLog log = new ResourceSharingAccessLog();
    log.setResourceId(resourceId);
    log.setResourceType(resourceType);
    log.setUserId(userId);
    log.setAccessAction(accessAction);
    log.setMetadata(metadata);
    log.setIpAddress(PrincipalContext.getRemoteAddress());
    log.setUserAgent(PrincipalContext.getUserAgent());
    return log;
  }

  public static ResourceSharingStat toStatDomain(ResourceType type, Long id,
      ShareAccessAction accessAction) {
    ResourceSharingStat stat = new ResourceSharingStat();
    stat.setResourceType(type);
    stat.setResourceId(id);
    stat.setTotalAccesses(1L);
    stat.setTotalViews(accessAction.isView() ? 1L : 0L);
    stat.setTotalEdits(accessAction.isEdit() ? 1L : 0L);
    stat.setTotalDeletions(accessAction.isDelete() ? 1L : 0L);
    return stat;
  }
}
