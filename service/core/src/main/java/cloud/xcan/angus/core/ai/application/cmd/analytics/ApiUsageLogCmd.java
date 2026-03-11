package cloud.xcan.angus.core.ai.application.cmd.analytics;

import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLog;

public interface ApiUsageLogCmd {

  void create(ApiUsageLog usageLog);
}
