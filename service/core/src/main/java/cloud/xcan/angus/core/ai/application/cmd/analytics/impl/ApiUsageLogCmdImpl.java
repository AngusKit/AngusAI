package cloud.xcan.angus.core.ai.application.cmd.analytics.impl;

import cloud.xcan.angus.core.ai.application.cmd.analytics.ApiUsageLogCmd;
import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLog;
import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLogRepo;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.spec.principal.Principal;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApiUsageLogCmdImpl extends CommCmd<ApiUsageLog, Long> implements ApiUsageLogCmd {

  @Resource
  private ApiUsageLogRepo apiUsageLogRepo;

  @Override
  @Transactional
  public void create(ApiUsageLog usageLog, Principal principal) {
    usageLog.setId(usageLog.getId());
    usageLog.setIpAddress(principal.getRemoteAddress());
    usageLog.setUserAgent(principal.getUserAgent());
    if (principal.getDeviceInfo() != null) {
      if (principal.getDeviceInfo().getDeviceType() != null){
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
  protected BaseRepository<ApiUsageLog, Long> getRepository() {
    return apiUsageLogRepo;
  }
}
