package cloud.xcan.angus.core.ai.application.query.apikey;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyResource;
import java.util.List;
import java.util.Map;

public interface ApiKeyResourceQuery {

  List<ApiKeyResource> getResources(Long apiKeyId);

  Map<Long, List<ApiKeyResource>> getResourceMap();

  boolean hasResourceAccess(Long apiKeyId, ResourceType resourceType, Long resourceId);
}
