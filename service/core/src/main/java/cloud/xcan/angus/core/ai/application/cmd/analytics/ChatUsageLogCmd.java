package cloud.xcan.angus.core.ai.application.cmd.analytics;

import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLog;
import cloud.xcan.angus.spec.principal.Principal;

public interface ChatUsageLogCmd {

  void create(ChatUsageLog usageLog, Principal principal);
}
