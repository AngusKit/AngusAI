package cloud.xcan.angus.core.ai.application.cmd.apikey;

import cloud.xcan.angus.core.ai.domain.apikey.ApiKey;

public interface ApiKeyResourceCmd {

  void addAuthorizedResources(ApiKey apiKey);
}
