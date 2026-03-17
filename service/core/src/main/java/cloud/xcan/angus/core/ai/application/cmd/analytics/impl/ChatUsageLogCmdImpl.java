package cloud.xcan.angus.core.ai.application.cmd.analytics.impl;

import cloud.xcan.angus.core.ai.application.cmd.analytics.ChatUsageLogCmd;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLog;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLogRepo;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.spec.principal.Principal;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatUsageLogCmdImpl extends CommCmd<ChatUsageLog, Long> implements ChatUsageLogCmd {

  @Resource
  private ChatUsageLogRepo chatUsageLogRepo;

  @Override
  @Transactional
  public void create(ChatUsageLog usageLog, Principal principal) {
    usageLog.setId(usageLog.getId());
    usageLog.setIpAddress(principal.getRemoteAddress());
    usageLog.setUserAgent(principal.getUserAgent());
    if (principal.getDeviceInfo() != null) {
      if (principal.getDeviceInfo().getDeviceType() != null) {
        usageLog.setDevice(principal.getDeviceInfo().getDeviceType().getValue());
      }
      usageLog.setDeviceId(principal.getDeviceInfo().getDeviceId());
    }
    usageLog.setRequestTime(LocalDateTime.now());
    usageLog.setUserId(principal.getUserId());
    usageLog.setTenantId(principal.getTenantId());
    insert(usageLog);
  }

  @Override
  protected BaseRepository<ChatUsageLog, Long> getRepository() {
    return chatUsageLogRepo;
  }
}
