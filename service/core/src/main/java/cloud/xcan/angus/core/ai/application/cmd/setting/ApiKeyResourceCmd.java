package cloud.xcan.angus.core.ai.application.cmd.setting;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;

public interface ApiKeyResourceCmd {

  void addAuthorizedResources(ApiKey apiKey);
}
