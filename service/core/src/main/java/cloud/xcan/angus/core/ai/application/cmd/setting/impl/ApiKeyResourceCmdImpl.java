package cloud.xcan.angus.core.ai.application.cmd.setting.impl;

import cloud.xcan.angus.core.ai.application.cmd.setting.ApiKeyResourceCmd;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResourceRepo;
import cloud.xcan.angus.core.ai.domain.setting.apikey.AuthorizedResource;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class ApiKeyResourceCmdImpl extends CommCmd<ApiKeyResource, Long> implements
    ApiKeyResourceCmd {

  @Resource
  private ApiKeyResourceRepo apiKeyResourceRepo;

  @Override
  public void addAuthorizedResources(ApiKey apiKey) {
    if (apiKey.getAuthorizedResources() != null) {
      for (AuthorizedResource resource : apiKey.getAuthorizedResources()) {
        if (resource.getIds() == null || resource.getIds().isEmpty()) {
          // 空数组表示全部资源
          ApiKeyResource keyResource = new ApiKeyResource();
          keyResource.setApiKeyId(apiKey.getId());
          keyResource.setResourceType(resource.getType());
          keyResource.setResourceId(0L);
          apiKeyResourceRepo.save(keyResource);
        } else {
          // 保存指定资源
          for (Long resourceId : resource.getIds()) {
            ApiKeyResource keyResource = new ApiKeyResource();
            keyResource.setApiKeyId(apiKey.getId());
            keyResource.setResourceType(resource.getType());
            keyResource.setResourceId(resourceId);
            apiKeyResourceRepo.save(keyResource);
          }
        }
      }
    }
  }

  @Override
  protected BaseRepository<ApiKeyResource, Long> getRepository() {
    return apiKeyResourceRepo;
  }
}
