package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

public interface ResourceSharingAccessLogCmd {

  @Transactional
  void recordAccess(ResourceType resourceType, Long resourceId, Long userId,
      ShareAccessAction accessAction, Map<String, Object> metadata);
}
