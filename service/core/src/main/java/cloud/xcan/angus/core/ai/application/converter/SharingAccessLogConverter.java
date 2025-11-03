package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import java.util.Map;

public class SharingAccessLogConverter {

  public static ResourceSharingAccessLog toDomain(Long resourceId,
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

}
