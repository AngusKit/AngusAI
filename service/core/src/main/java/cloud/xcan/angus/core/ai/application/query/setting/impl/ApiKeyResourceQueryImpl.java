package cloud.xcan.angus.core.ai.application.query.setting.impl;

import cloud.xcan.angus.core.ai.application.query.setting.ApiKeyResourceQuery;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResourceRepo;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ResourceType;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ApiKeyResourceQueryImpl implements ApiKeyResourceQuery {

  @Resource
  private ApiKeyResourceRepo apiKeyResourceRepo;

  @Override
  public List<ApiKeyResource> getResources(Long apiKeyId) {
    return apiKeyResourceRepo.findByApiKeyId(apiKeyId);
  }

  @Override
  public Map<Long, List<ApiKeyResource>> getResourceMap() {
    return apiKeyResourceRepo.findAll().stream()
        .collect(Collectors.groupingBy(ApiKeyResource::getApiKeyId));
  }

  @Override
  public boolean hasResourceAccess(Long apiKeyId, ResourceType resourceType, Long resourceId) {
    List<ApiKeyResource> resources = apiKeyResourceRepo.findByApiKeyIdAndResourceType(
        apiKeyId, resourceType);
    if (resources.isEmpty()) {
      // 没有配置授权资源，默认无权限
      return false;
    }
    // 检查是否有全部资源权限（resourceId=0）
    if (resources.stream().anyMatch(r -> r.getResourceId() == 0L)) {
      return true;
    }
    // 检查是否有指定资源权限
    return resources.stream().anyMatch(r -> r.getResourceId().equals(resourceId));
  }
}
