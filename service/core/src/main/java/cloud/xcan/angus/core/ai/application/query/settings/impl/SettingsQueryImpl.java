package cloud.xcan.angus.core.ai.application.query.settings.impl;

import cloud.xcan.angus.core.ai.application.query.settings.SettingsQuery;
import cloud.xcan.angus.core.ai.domain.settings.UserSession;
import cloud.xcan.angus.core.ai.domain.settings.UserSessionRepo;
import cloud.xcan.angus.core.ai.domain.settings.UserSettings;
import cloud.xcan.angus.core.ai.domain.settings.UserSettingsRepo;
import cloud.xcan.angus.core.ai.domain.settings.dataexport.DataExport;
import cloud.xcan.angus.core.ai.domain.settings.dataexport.DataExportRepo;
import cloud.xcan.angus.core.ai.domain.settings.loginhistory.LoginHistory;
import cloud.xcan.angus.core.ai.domain.settings.loginhistory.LoginHistoryRepo;
import cloud.xcan.angus.core.ai.domain.settings.securitysettings.SecuritySettings;
import cloud.xcan.angus.core.ai.domain.settings.securitysettings.SecuritySettingsRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 设置查询服务实现
 */
@Service
public class SettingsQueryImpl implements SettingsQuery {

  @Resource
  private UserSettingsRepo userSettingsRepo;

  @Resource
  private SecuritySettingsRepo securitySettingsRepo;

  @Resource
  private UserSessionRepo userSessionRepo;

  @Resource
  private LoginHistoryRepo loginHistoryRepo;

  @Resource
  private DataExportRepo dataExportRepo;

  @Override
  public UserSettings findUserSettingsByUserId(Long userId) {
    return new BizTemplate<UserSettings>() {
      @Override
      protected UserSettings process() {
        return userSettingsRepo.findByUserId(userId).orElse(null);
      }
    }.execute();
  }

  @Override
  public SecuritySettings findSecuritySettingsByUserId(Long userId) {
    return new BizTemplate<SecuritySettings>() {
      @Override
      protected SecuritySettings process() {
        return securitySettingsRepo.findByUserId(userId).orElse(null);
      }
    }.execute();
  }

  @Override
  public List<UserSession> findActiveSessionsByUserId(Long userId) {
    return new BizTemplate<List<UserSession>>() {
      @Override
      protected List<UserSession> process() {
        return userSessionRepo.findByUserIdOrderByLastActiveAtDesc(userId);
      }
    }.execute();
  }

  @Override
  public UserSession findSessionBySessionId(String sessionId) {
    return new BizTemplate<UserSession>() {
      @Override
      protected UserSession process() {
        return userSessionRepo.findBySessionId(sessionId);
      }
    }.execute();
  }

  @Override
  public int countActiveSessionsByUserId(Long userId) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        return userSessionRepo.countActiveSessionsByUserId(userId, LocalDateTime.now());
      }
    }.execute();
  }

  @Override
  public Page<LoginHistory> findLoginHistoryByUserId(Long userId, Pageable pageable) {
    return new BizTemplate<Page<LoginHistory>>() {
      @Override
      protected Page<LoginHistory> process() {
        return loginHistoryRepo.findByUserIdOrderByLoginDatetimeDesc(userId, pageable);
      }
    }.execute();
  }

  @Override
  public List<LoginHistory> findRecentLoginHistory(Long userId) {
    return new BizTemplate<List<LoginHistory>>() {
      @Override
      protected List<LoginHistory> process() {
        return loginHistoryRepo.findTop10ByUserIdOrderByLoginDatetimeDesc(userId);
      }
    }.execute();
  }

  @Override
  public List<DataExport> findDataExportsByUserId(Long userId) {
    return new BizTemplate<List<DataExport>>() {
      @Override
      protected List<DataExport> process() {
        return dataExportRepo.findByUserIdOrderByRequestedAtDesc(userId);
      }
    }.execute();
  }

  @Override
  public DataExport findDataExportById(Long id) {
    return new BizTemplate<DataExport>() {
      @Override
      protected DataExport process() {
        return dataExportRepo.findById(id).orElse(null);
      }
    }.execute();
  }

  @Override
  public int countTodayExportsByUserId(Long userId) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return dataExportRepo.countTodayExportsByUserId(userId, startOfDay);
      }
    }.execute();
  }
}
