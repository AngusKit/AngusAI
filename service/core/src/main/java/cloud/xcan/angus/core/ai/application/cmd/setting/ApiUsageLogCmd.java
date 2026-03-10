package cloud.xcan.angus.core.ai.application.cmd.setting;

import cloud.xcan.angus.core.ai.domain.setting.analytics.ApiUsageLog;

public interface ApiUsageLogCmd{

  void create(ApiUsageLog usageLog);
}
