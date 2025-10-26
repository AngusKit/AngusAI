package cloud.xcan.angus.core.ai.interfaces.settings.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.settings.SettingsCmd;
import cloud.xcan.angus.core.ai.application.query.settings.SettingsQuery;
import cloud.xcan.angus.core.ai.domain.settings.dataexport.DataExport;
import cloud.xcan.angus.core.ai.domain.settings.loginhistory.LoginHistory;
import cloud.xcan.angus.core.ai.domain.settings.NotificationSettings;
import cloud.xcan.angus.core.ai.domain.settings.securitysettings.SecuritySettings;
import cloud.xcan.angus.core.ai.domain.settings.UserSession;
import cloud.xcan.angus.core.ai.domain.settings.UserSettings;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.SettingsFacade;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ChangePasswordDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DataExportRequestDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DeleteAccountDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Enable2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.NotificationSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.UserSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Verify2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.internal.assembler.SettingsAssembler;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ChangePasswordVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DataExportVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DeleteAccountVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.Enable2FAVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.NotificationSettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.SecuritySettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UploadAvatarVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UserSettingsVo;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * 设置门面实现类
 */
@Component
public class SettingsFacadeImpl implements SettingsFacade {

  @Resource
  private SettingsQuery settingsQuery;

  @Resource
  private SettingsCmd settingsCmd;

  @Override
  public DataExportVo requestDataExport(Long userId, DataExportRequestDto dto) {
    DataExport export = settingsCmd.requestDataExport(userId, dto);
    return SettingsAssembler.toDataExportVo(export);
  }

  @Override
  public UserSettingsVo getUserSettings(Long userId) {
    UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);
    if (settings == null) {
      // 如果不存在，创建默认设置
      settings = settingsCmd.initUserSettings(userId, "user@example.com");
    }
    return SettingsAssembler.toUserSettingsVo(settings);
  }

  @Override
  public UserSettingsVo updateUserSettings(Long userId, UserSettingsUpdateDto dto) {
    UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);

    // 更新个人资料
    if (dto.getProfile() != null) {
      java.util.Map<String, Object> profile = new java.util.HashMap<>();
      if (dto.getProfile().getName() != null) {
        profile.put("name", dto.getProfile().getName());
      }
      if (dto.getProfile().getPhone() != null) {
        profile.put("phone", dto.getProfile().getPhone());
      }
      if (dto.getProfile().getCompany() != null) {
        profile.put("company", dto.getProfile().getCompany());
      }
      if (dto.getProfile().getPosition() != null) {
        profile.put("position", dto.getProfile().getPosition());
      }
      if (dto.getProfile().getTimezone() != null) {
        profile.put("timezone", dto.getProfile().getTimezone());
      }
      if (dto.getProfile().getLanguage() != null) {
        profile.put("language", dto.getProfile().getLanguage());
      }
      settings = settingsCmd.updateProfile(userId, profile);
    }

    // 更新偏好设置
    if (dto.getPreferences() != null && settings.getPreferences() != null) {
      cloud.xcan.angus.core.ai.domain.settings.UserPreferences prefs = settings.getPreferences();
      if (dto.getPreferences().getTheme() != null) {
        prefs.setTheme(dto.getPreferences().getTheme());
      }
      if (dto.getPreferences().getLocale() != null) {
        prefs.setLocale(dto.getPreferences().getLocale());
      }
      if (dto.getPreferences().getDateFormat() != null) {
        prefs.setDateFormat(dto.getPreferences().getDateFormat());
      }
      if (dto.getPreferences().getTimeFormat() != null) {
        prefs.setTimeFormat(dto.getPreferences().getTimeFormat());
      }
      if (dto.getPreferences().getDefaultView() != null) {
        prefs.setDefaultView(dto.getPreferences().getDefaultView());
      }
      settings = settingsCmd.updatePreferences(userId, prefs);
    }

    // 更新隐私设置
    if (dto.getPrivacy() != null && settings.getPrivacy() != null) {
      cloud.xcan.angus.core.ai.domain.settings.PrivacySettings privacy = settings.getPrivacy();
      if (dto.getPrivacy().getProfileVisibility() != null) {
        privacy.setProfileVisibility(dto.getPrivacy().getProfileVisibility());
      }
      if (dto.getPrivacy().getShowEmail() != null) {
        privacy.setShowEmail(dto.getPrivacy().getShowEmail());
      }
      if (dto.getPrivacy().getShowActivity() != null) {
        privacy.setShowActivity(dto.getPrivacy().getShowActivity());
      }
      settings = settingsCmd.updatePrivacy(userId, privacy);
    }

    return SettingsAssembler.toUserSettingsVo(settings);
  }

  @Override
  public UploadAvatarVo uploadAvatar(Long userId, MultipartFile file) {
    // TODO: 实现文件上传到OSS,这里模拟返回URL
    String avatarUrl = "https://example.com/avatars/" + userId + ".jpg";
    settingsCmd.uploadAvatar(userId, avatarUrl);

    UploadAvatarVo vo = new UploadAvatarVo();
    vo.setAvatarUrl(avatarUrl);
    vo.setUploadedAt(System.currentTimeMillis());
    return vo;
  }

  @Override
  public NotificationSettingsVo getNotificationSettings(Long userId) {
    UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);
    if (settings == null) {
      throw ResourceNotFound.of("用户设置不存在", new Object[]{});
    }
    return SettingsAssembler.toNotificationSettingsVo(settings.getNotificationSettings());
  }

  @Override
  public NotificationSettingsVo updateNotificationSettings(Long userId,
      NotificationSettingsUpdateDto dto) {
    // 先获取当前设置
    UserSettings settings = settingsQuery.findUserSettingsByUserId(userId);
    if (settings == null) {
      throw ResourceNotFound.of("用户设置不存在", new Object[]{});
    }

    // 构建NotificationSettings对象
    NotificationSettings notificationSettings = settings.getNotificationSettings();
    if (notificationSettings == null) {
      notificationSettings = new NotificationSettings();
    }

    // 更新邮件通知
    if (dto.getEmail() != null) {
      if (notificationSettings.getEmail() == null) {
        notificationSettings.setEmail(new NotificationSettings.EmailNotification());
      }
      if (dto.getEmail().getEnabled() != null) {
        notificationSettings.getEmail().setEnabled(dto.getEmail().getEnabled());
      }
      if (dto.getEmail().getFrequency() != null) {
        notificationSettings.getEmail().setFrequency(dto.getEmail().getFrequency());
      }
      // 更新具体通知类型...
    }

    // 更新其他通知类型...

    settings = settingsCmd.updateNotificationSettings(userId, notificationSettings);
    return SettingsAssembler.toNotificationSettingsVo(settings.getNotificationSettings());
  }

  @Override
  public SecuritySettingsVo getSecuritySettings(Long userId) {
    SecuritySettings securitySettings = settingsQuery.findSecuritySettingsByUserId(userId);
    List<UserSession> sessions = settingsQuery.findActiveSessionsByUserId(userId);
    List<LoginHistory> loginHistory = settingsQuery.findRecentLoginHistory(userId);

    return SettingsAssembler.toSecuritySettingsVo(securitySettings, sessions, loginHistory);
  }

  @Override
  public Enable2FAVo enable2FA(Long userId, Enable2FADto dto) {
    SecuritySettings settings = settingsCmd.enable2FA(userId, dto.getMethod());
    return SettingsAssembler.toEnable2FAVo(settings);
  }

  @Override
  public SecuritySettingsVo verify2FA(Long userId, Verify2FADto dto) {
    SecuritySettings settings = settingsCmd.verify2FA(userId, dto.getCode());
    List<UserSession> sessions = settingsQuery.findActiveSessionsByUserId(userId);
    List<LoginHistory> loginHistory = settingsQuery.findRecentLoginHistory(userId);

    return SettingsAssembler.toSecuritySettingsVo(settings, sessions, loginHistory);
  }

  @Override
  public void disable2FA(Long userId, String password, String code) {
    settingsCmd.disable2FA(userId, password, code);
  }

  @Override
  public ChangePasswordVo changePassword(Long userId, ChangePasswordDto dto) {
    LocalDateTime changedAt = settingsCmd.changePassword(userId,
        dto.getCurrentPassword(), dto.getNewPassword());

    ChangePasswordVo vo = new ChangePasswordVo();
    vo.setChangedAt(changedAt);
    return vo;
  }

  @Override
  public void terminateSession(Long userId, String sessionId) {
    settingsCmd.terminateSession(userId, sessionId);
  }

  @Override
  public void revokeAllSessions(Long userId, String currentSessionId) {
    settingsCmd.revokeAllOtherSessions(userId, currentSessionId);
  }

  @Override
  public void cancelDeleteAccount(Long userId) {
    settingsCmd.cancelDeleteAccount(userId);
  }

  @Override
  public void deleteAvatar(Long userId) {
    settingsCmd.deleteAvatar(userId);
  }

  @Override
  public DeleteAccountVo deleteAccount(Long userId, DeleteAccountDto dto) {
    LocalDateTime scheduledAt = settingsCmd.requestDeleteAccount(userId,
        dto.getPassword(), dto.getReason(), dto.getFeedback());

    DeleteAccountVo vo = new DeleteAccountVo();
    vo.setScheduledAt(scheduledAt);
    vo.setCancellable(true);
    return vo;
  }

  @Override
  public List<DataExportVo> getDataExports(Long userId) {
    List<DataExport> exports = settingsQuery.findDataExportsByUserId(userId);
    return exports.stream()
        .map(SettingsAssembler::toDataExportVo)
        .collect(Collectors.toList());
  }
}
