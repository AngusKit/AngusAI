package cloud.xcan.angus.core.ai.application.cmd.settings.impl;

import cloud.xcan.angus.core.ai.application.cmd.settings.SettingsCmd;
import cloud.xcan.angus.core.ai.application.query.settings.SettingsQuery;
import cloud.xcan.angus.core.ai.domain.settings.DataExport;
import cloud.xcan.angus.core.ai.domain.settings.DataExportRepo;
import cloud.xcan.angus.core.ai.domain.settings.ExportFormat;
import cloud.xcan.angus.core.ai.domain.settings.ExportStatus;
import cloud.xcan.angus.core.ai.domain.settings.ExportType;
import cloud.xcan.angus.core.ai.domain.settings.NotificationSettings;
import cloud.xcan.angus.core.ai.domain.settings.PrivacySettings;
import cloud.xcan.angus.core.ai.domain.settings.SecuritySettings;
import cloud.xcan.angus.core.ai.domain.settings.SecuritySettingsRepo;
import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import cloud.xcan.angus.core.ai.domain.settings.UserPreferences;
import cloud.xcan.angus.core.ai.domain.settings.UserSession;
import cloud.xcan.angus.core.ai.domain.settings.UserSessionRepo;
import cloud.xcan.angus.core.ai.domain.settings.UserSettings;
import cloud.xcan.angus.core.ai.domain.settings.UserSettingsRepo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DataExportRequestDto;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Map;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 设置命令服务实现
 */
@Component
@Biz
public class SettingsCmdImpl extends CommCmd<UserSettings, Long> implements SettingsCmd {

  @Resource
  private UserSettingsRepo userSettingsRepo;

  @Resource
  private SecuritySettingsRepo securitySettingsRepo;

  @Resource
  private UserSessionRepo userSessionRepo;

  @Resource
  private DataExportRepo dataExportRepo;

  @Resource
  private SettingsQuery settingsQuery;

  @Resource
  private ObjectMapper objectMapper;

  @Override
  protected BaseRepository<UserSettings, Long> getRepository() {
    return userSettingsRepo;
  }

  @Override
  @Transactional
  public UserSettings initUserSettings(Long userId, String email) {
    return new BizTemplate<UserSettings>() {
      @Override
      protected UserSettings process() {
        // 检查是否已存在
        UserSettings existing = settingsQuery.findUserSettingsByUserId(userId);
        if (existing != null) {
          return existing;
        }

        // 创建默认设置
        UserSettings settings = new UserSettings()
            .setUserId(userId)
            .setEmail(email)
            .setTimezone("Asia/Shanghai")
            .setLanguage("zh-CN")
            .setPreferences(new UserPreferences())
            .setPrivacy(new PrivacySettings())
            .setNotificationSettings(new NotificationSettings());

        insert0(settings);
        return settings;
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings updateProfile(Long userId, Map<String, Object> profile) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        if (profile.containsKey("name")) {
          settings.setName((String) profile.get("name"));
        }
        if (profile.containsKey("phone")) {
          settings.setPhone((String) profile.get("phone"));
        }
        if (profile.containsKey("company")) {
          settings.setCompany((String) profile.get("company"));
        }
        if (profile.containsKey("position")) {
          settings.setPosition((String) profile.get("position"));
        }
        if (profile.containsKey("timezone")) {
          settings.setTimezone((String) profile.get("timezone"));
        }
        if (profile.containsKey("language")) {
          settings.setLanguage((String) profile.get("language"));
        }

        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings updatePreferences(Long userId, UserPreferences preferences) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        UserPreferences current = settings.getPreferences();
        if (current == null) {
          current = new UserPreferences();
        }

        // 更新偏好设置
        if (preferences.getTheme() != null) {
          current.setTheme(preferences.getTheme());
        }
        if (preferences.getLocale() != null) {
          current.setLocale(preferences.getLocale());
        }
        if (preferences.getDateFormat() != null) {
          current.setDateFormat(preferences.getDateFormat());
        }
        if (preferences.getTimeFormat() != null) {
          current.setTimeFormat(preferences.getTimeFormat());
        }
        if (preferences.getDefaultView() != null) {
          current.setDefaultView(preferences.getDefaultView());
        }

        settings.setPreferences(current);
        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings updatePrivacy(Long userId, PrivacySettings privacy) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        PrivacySettings current = settings.getPrivacy();
        if (current == null) {
          current = new PrivacySettings();
        }

        if (privacy.getProfileVisibility() != null) {
          current.setProfileVisibility(privacy.getProfileVisibility());
        }
        if (privacy.getShowEmail() != null) {
          current.setShowEmail(privacy.getShowEmail());
        }
        if (privacy.getShowActivity() != null) {
          current.setShowActivity(privacy.getShowActivity());
        }

        settings.setPrivacy(current);
        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings uploadAvatar(Long userId, String avatarUrl) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        settings.setAvatar(avatarUrl);
        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings deleteAvatar(Long userId) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        settings.setAvatar(null);
        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public UserSettings updateNotificationSettings(Long userId, NotificationSettings notificationSettings) {
    return new BizTemplate<UserSettings>() {
      UserSettings settings;

      @Override
      protected void checkParams() {
        settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }
      }

      @Override
      protected UserSettings process() {
        settings.setNotificationSettings(notificationSettings);
        return userSettingsRepo.save(settings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public SecuritySettings enable2FA(Long userId, TwoFactorMethod method) {
    return new BizTemplate<SecuritySettings>() {
      SecuritySettings securitySettings;

      @Override
      protected void checkParams() {
        securitySettings = settingsQuery.findSecuritySettingsByUserId(userId);
      }

      @Override
      protected SecuritySettings process() {
        if (securitySettings == null) {
          securitySettings = new SecuritySettings()
              .setUserId(userId);
        }

        // 生成密钥(实际应用中应使用真实的TOTP库)
        String secret = RandomStringUtils.randomAlphanumeric(32);
        securitySettings.setTwoFactorMethod(method)
            .setTwoFactorSecret(secret);

        return securitySettingsRepo.save(securitySettings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public SecuritySettings verify2FA(Long userId, String code) {
    return new BizTemplate<SecuritySettings>() {
      SecuritySettings securitySettings;

      @Override
      protected void checkParams() {
        securitySettings = settingsQuery.findSecuritySettingsByUserId(userId);
        if (securitySettings == null || securitySettings.getTwoFactorSecret() == null) {
          throw new IllegalArgumentException("未启动双因素认证设置流程");
        }

        // TODO: 验证code是否正确
      }

      @Override
      protected SecuritySettings process() {
        securitySettings.setTwoFactorEnabled(true)
            .setTwoFactorSetupAt(LocalDateTime.now());

        return securitySettingsRepo.save(securitySettings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public SecuritySettings disable2FA(Long userId, String password, String code) {
    return new BizTemplate<SecuritySettings>() {
      SecuritySettings securitySettings;

      @Override
      protected void checkParams() {
        securitySettings = settingsQuery.findSecuritySettingsByUserId(userId);
        if (securitySettings == null || !securitySettings.getTwoFactorEnabled()) {
          throw new IllegalArgumentException("双因素认证未启用");
        }

        // TODO: 验证密码和验证码
      }

      @Override
      protected SecuritySettings process() {
        securitySettings.setTwoFactorEnabled(false)
            .setTwoFactorMethod(null)
            .setTwoFactorSecret(null)
            .setTwoFactorSetupAt(null);

        return securitySettingsRepo.save(securitySettings);
      }
    }.execute();
  }

  @Override
  @Transactional
  public LocalDateTime changePassword(Long userId, String currentPassword, String newPassword) {
    return new BizTemplate<LocalDateTime>() {
      SecuritySettings securitySettings;

      @Override
      protected void checkParams() {
        // TODO: 验证当前密码
        // TODO: 验证新密码强度

        securitySettings = settingsQuery.findSecuritySettingsByUserId(userId);
      }

      @Override
      protected LocalDateTime process() {
        LocalDateTime now = LocalDateTime.now();

        if (securitySettings == null) {
          securitySettings = new SecuritySettings()
              .setUserId(userId);
        }

        securitySettings.setPasswordLastChangedAt(now);
        securitySettingsRepo.save(securitySettings);

        // TODO: 实际修改密码
        // TODO: 使其他会话失效

        return now;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void terminateSession(Long userId, String sessionId) {
    new BizTemplate<Void>() {
      UserSession session;

      @Override
      protected void checkParams() {
        session = settingsQuery.findSessionBySessionId(sessionId);
        if (session == null || !session.getUserId().equals(userId)) {
          throw ResourceNotFound.of("会话不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        userSessionRepo.delete(session);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public int revokeAllOtherSessions(Long userId, String currentSessionId) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        int count = settingsQuery.countActiveSessionsByUserId(userId);
        userSessionRepo.deleteByUserIdExceptCurrent(userId, currentSessionId);
        return count - 1; // 减去当前会话
      }
    }.execute();
  }

  @Override
  @Transactional
  public DataExport requestDataExport(Long userId, DataExportRequestDto request) {
    return new BizTemplate<DataExport>() {
      @Override
      protected void checkParams() {
        // 检查今天的导出次数
        int todayCount = settingsQuery.countTodayExportsByUserId(userId);
        if (todayCount >= 3) {
          throw new IllegalArgumentException("每天最多只能导出3次");
        }
      }

      @Override
      protected DataExport process() {
        String scopeJson = null;
        if (request.getScope() != null) {
          try {
            scopeJson = objectMapper.writeValueAsString(request.getScope());
          } catch (JsonProcessingException e) {
            // ignore
          }
        }

        DataExport export = new DataExport()
            .setUserId(userId)
            .setType(request.getType())
            .setFormat(request.getFormat())
            .setStatus(ExportStatus.PROCESSING)
            .setScope(scopeJson)
            .setRequestedAt(LocalDateTime.now());

        export = dataExportRepo.save(export);

        // TODO: 异步处理导出任务

        return export;
      }
    }.execute();
  }

  @Override
  @Transactional
  public LocalDateTime requestDeleteAccount(Long userId, String password, String reason, String feedback) {
    return new BizTemplate<LocalDateTime>() {
      @Override
      protected void checkParams() {
        // TODO: 验证密码
      }

      @Override
      protected LocalDateTime process() {
        UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }

        // 设置30天后删除
        LocalDateTime scheduledAt = LocalDateTime.now().plusDays(30);
        settings.setDeletionScheduledAt(scheduledAt)
            .setDeletionReason(reason);

        userSettingsRepo.save(settings);

        // TODO: 发送确认邮件

        return scheduledAt;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void cancelDeleteAccount(Long userId) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);
        if (settings == null) {
          throw ResourceNotFound.of("用户设置不存在", new Object[]{});
        }

        settings.setDeletionScheduledAt(null)
            .setDeletionReason(null);

        userSettingsRepo.save(settings);
        return null;
      }
    }.execute();
  }
}
