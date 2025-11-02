package cloud.xcan.angus.core.ai.application.query.setting;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ResourceType;
import java.util.List;
import java.util.Map;

public interface ApiKeyResourceQuery {

  List<ApiKeyResource> getResources(Long apiKeyId);

  Map<Long, List<ApiKeyResource>> getResourceMap();

  boolean hasResourceAccess(Long apiKeyId, ResourceType resourceType, Long resourceId);
}
