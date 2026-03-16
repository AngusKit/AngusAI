package cloud.xcan.angus.core.ai.application.cmd.analytics;

import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLog;
import cloud.xcan.angus.spec.principal.Principal;

public interface ApiUsageLogCmd {

  void create(ApiUsageLog usageLog, Principal principal);
}
