package cloud.xcan.angus.core.ai.interfaces.settings.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.settings.NotificationSettings;
import cloud.xcan.angus.core.ai.domain.settings.UserSession;
import cloud.xcan.angus.core.ai.domain.settings.UserSettings;
import cloud.xcan.angus.core.ai.domain.settings.dataexport.DataExport;
import cloud.xcan.angus.core.ai.domain.settings.loginhistory.LoginHistory;
import cloud.xcan.angus.core.ai.domain.settings.securitysettings.SecuritySettings;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DataExportVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.Enable2FAVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.NotificationSettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.SecuritySettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UserSettingsVo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.RandomStringUtils;

/**
 * 设置装配器
 */
public class SettingsAssembler {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * 转换为用户设置VO
   */
  public static UserSettingsVo toUserSettingsVo(UserSettings settings) {
    if (settings == null) {
      return null;
    }

    UserSettingsVo vo = new UserSettingsVo();
    vo.setUserId(settings.getUserId());

    // 个人资料
    UserSettingsVo.ProfileVo profile = new UserSettingsVo.ProfileVo();
    profile.setName(settings.getName());
    profile.setEmail(settings.getEmail());
    profile.setAvatar(settings.getAvatar());
    profile.setPhone(settings.getPhone());
    profile.setCompany(settings.getCompany());
    profile.setPosition(settings.getPosition());
    profile.setTimezone(settings.getTimezone());
    profile.setLanguage(settings.getLanguage());
    vo.setProfile(profile);

    // 偏好设置
    if (settings.getPreferences() != null) {
      UserSettingsVo.PreferencesVo preferences = new UserSettingsVo.PreferencesVo();
      preferences.setTheme(settings.getPreferences().getTheme());
      preferences.setLocale(settings.getPreferences().getLocale());
      preferences.setDateFormat(settings.getPreferences().getDateFormat());
      preferences.setTimeFormat(settings.getPreferences().getTimeFormat());
      preferences.setDefaultView(settings.getPreferences().getDefaultView());
      vo.setPreferences(preferences);
    }

    // 隐私设置
    if (settings.getPrivacy() != null) {
      UserSettingsVo.PrivacyVo privacy = new UserSettingsVo.PrivacyVo();
      privacy.setProfileVisibility(settings.getPrivacy().getProfileVisibility());
      privacy.setShowEmail(settings.getPrivacy().getShowEmail());
      privacy.setShowActivity(settings.getPrivacy().getShowActivity());
      vo.setPrivacy(privacy);
    }

    return vo;
  }

  /**
   * 转换为通知设置VO
   */
  public static NotificationSettingsVo toNotificationSettingsVo(NotificationSettings settings) {
    if (settings == null) {
      return new NotificationSettingsVo();
    }

    NotificationSettingsVo vo = new NotificationSettingsVo();

    // 邮件通知
    if (settings.getEmail() != null) {
      NotificationSettingsVo.EmailNotificationVo email = new NotificationSettingsVo.EmailNotificationVo();
      email.setEnabled(settings.getEmail().getEnabled());
      email.setFrequency(settings.getEmail().getFrequency());

      if (settings.getEmail().getNotifications() != null) {
        NotificationSettingsVo.NotificationTypesVo types = new NotificationSettingsVo.NotificationTypesVo();
        types.setSystemUpdates(settings.getEmail().getNotifications().getSystemUpdates());
        types.setSecurityAlerts(settings.getEmail().getNotifications().getSecurityAlerts());
        types.setUsageAlerts(settings.getEmail().getNotifications().getUsageAlerts());
        types.setBillingNotices(settings.getEmail().getNotifications().getBillingNotices());
        types.setTeamInvitations(settings.getEmail().getNotifications().getTeamInvitations());
        types.setResourceSharing(settings.getEmail().getNotifications().getResourceSharing());
        types.setWorkflowStatus(settings.getEmail().getNotifications().getWorkflowStatus());
        types.setApiErrors(settings.getEmail().getNotifications().getApiErrors());
        email.setNotifications(types);
      }
      vo.setEmail(email);
    }

    // 浏览器通知
    if (settings.getBrowser() != null) {
      NotificationSettingsVo.BrowserNotificationVo browser = new NotificationSettingsVo.BrowserNotificationVo();
      browser.setEnabled(settings.getBrowser().getEnabled());

      if (settings.getBrowser().getNotifications() != null) {
        NotificationSettingsVo.BrowserNotificationTypesVo types = new NotificationSettingsVo.BrowserNotificationTypesVo();
        types.setChatMessages(settings.getBrowser().getNotifications().getChatMessages());
        types.setWorkflowComplete(settings.getBrowser().getNotifications().getWorkflowComplete());
        types.setErrorAlerts(settings.getBrowser().getNotifications().getErrorAlerts());
        browser.setNotifications(types);
      }
      vo.setBrowser(browser);
    }

    // 应用内通知
    if (settings.getInApp() != null) {
      NotificationSettingsVo.InAppNotificationVo inApp = new NotificationSettingsVo.InAppNotificationVo();
      inApp.setEnabled(settings.getInApp().getEnabled());
      inApp.setShowBadge(settings.getInApp().getShowBadge());
      inApp.setPlaySound(settings.getInApp().getPlaySound());
      vo.setInApp(inApp);
    }

    // 移动推送
    if (settings.getMobile() != null) {
      NotificationSettingsVo.MobileNotificationVo mobile = new NotificationSettingsVo.MobileNotificationVo();
      mobile.setEnabled(settings.getMobile().getEnabled());

      if (settings.getMobile().getQuietHours() != null) {
        NotificationSettingsVo.QuietHoursVo quietHours = new NotificationSettingsVo.QuietHoursVo();
        quietHours.setEnabled(settings.getMobile().getQuietHours().getEnabled());
        quietHours.setStart(settings.getMobile().getQuietHours().getStart());
        quietHours.setEnd(settings.getMobile().getQuietHours().getEnd());
        mobile.setQuietHours(quietHours);
      }
      vo.setMobile(mobile);
    }

    return vo;
  }

  /**
   * 转换为安全设置VO
   */
  public static SecuritySettingsVo toSecuritySettingsVo(SecuritySettings settings,
      List<UserSession> sessions, List<LoginHistory> loginHistory) {
    SecuritySettingsVo vo = new SecuritySettingsVo();

    // 双因素认证
    SecuritySettingsVo.TwoFactorVo twoFactor = new SecuritySettingsVo.TwoFactorVo();
    if (settings != null) {
      twoFactor.setEnabled(settings.getTwoFactorEnabled());
      twoFactor.setMethod(settings.getTwoFactorMethod());
      twoFactor.setSetupAt(settings.getTwoFactorSetupAt());
    } else {
      twoFactor.setEnabled(false);
    }
    vo.setTwoFactor(twoFactor);

    // 会话管理
    SecuritySettingsVo.SessionsVo sessionsVo = new SecuritySettingsVo.SessionsVo();
    if (settings != null) {
      sessionsVo.setMaxActiveSessions(settings.getMaxActiveSessions());
      sessionsVo.setSessionTimeout(settings.getSessionTimeout());
    }
    sessionsVo.setCurrentSessions(sessions != null ? sessions.size() : 0);
    sessionsVo.setActiveSessions(
        sessions != null ? sessions.stream()
            .map(SettingsAssembler::toActiveSessionVo)
            .collect(Collectors.toList()) : Collections.emptyList()
    );
    vo.setSessions(sessionsVo);

    // 登录历史
    vo.setLoginHistory(
        loginHistory != null ? loginHistory.stream()
            .map(SettingsAssembler::toLoginHistoryItemVo)
            .collect(Collectors.toList()) : Collections.emptyList()
    );

    // 密码策略
    SecuritySettingsVo.PasswordPolicyVo passwordPolicy = new SecuritySettingsVo.PasswordPolicyVo();
    passwordPolicy.setMinLength(8);
    passwordPolicy.setRequireUppercase(true);
    passwordPolicy.setRequireLowercase(true);
    passwordPolicy.setRequireNumbers(true);
    passwordPolicy.setRequireSpecialChars(true);
    if (settings != null) {
      passwordPolicy.setLastChangedAt(settings.getPasswordLastChangedAt());
      passwordPolicy.setExpiresIn(settings.getPasswordExpiresIn());
    }
    vo.setPasswordPolicy(passwordPolicy);

    // IP白名单
    SecuritySettingsVo.IpWhitelistVo ipWhitelist = new SecuritySettingsVo.IpWhitelistVo();
    if (settings != null) {
      ipWhitelist.setEnabled(settings.getIpWhitelistEnabled());
      // 解析JSON数组
      try {
        if (settings.getIpWhitelist() != null) {
          List<String> addresses = objectMapper.readValue(settings.getIpWhitelist(),
              objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
          ipWhitelist.setAddresses(addresses);
        }
      } catch (JsonProcessingException e) {
        ipWhitelist.setAddresses(Collections.emptyList());
      }
    } else {
      ipWhitelist.setEnabled(false);
      ipWhitelist.setAddresses(Collections.emptyList());
    }
    vo.setIpWhitelist(ipWhitelist);

    return vo;
  }

  /**
   * 转换为活跃会话VO
   */
  private static SecuritySettingsVo.ActiveSessionVo toActiveSessionVo(UserSession session) {
    SecuritySettingsVo.ActiveSessionVo vo = new SecuritySettingsVo.ActiveSessionVo();
    vo.setId(session.getSessionId());
    vo.setDevice(session.getDevice());
    vo.setBrowser(session.getBrowser());
    vo.setIp(session.getIp());
    vo.setLocation(session.getLocation());
    vo.setCurrent(session.getIsCurrent());
    vo.setLastActiveAt(session.getLastActiveAt());
    vo.setCreatedDate(session.getCreatedDate());
    return vo;
  }

  /**
   * 转换为登录历史项VO
   */
  private static SecuritySettingsVo.LoginHistoryItemVo toLoginHistoryItemVo(
      LoginHistory history) {
    SecuritySettingsVo.LoginHistoryItemVo vo = new SecuritySettingsVo.LoginHistoryItemVo();
    vo.setId(history.getId());
    vo.setDatetime(history.getLoginDatetime());
    vo.setIp(history.getIp());
    vo.setLocation(history.getLocation());
    vo.setDevice(history.getDevice());
    vo.setBrowser(history.getBrowser());
    vo.setStatus(history.getStatus());
    return vo;
  }

  /**
   * 转换为启用双因素认证VO
   */
  public static Enable2FAVo toEnable2FAVo(SecuritySettings settings) {
    Enable2FAVo vo = new Enable2FAVo();

    if (settings != null && settings.getTwoFactorSecret() != null) {
      Enable2FAVo.TotpVo totp = new Enable2FAVo.TotpVo();
      totp.setSecret(settings.getTwoFactorSecret());
      // TODO: 生成真实的二维码URL
      totp.setQrCode("https://example.com/qr/" + settings.getTwoFactorSecret());

      // 生成备用码
      List<String> backupCodes = new ArrayList<>();
      for (int i = 0; i < 10; i++) {
        backupCodes.add(RandomStringUtils.randomAlphanumeric(8).toUpperCase());
      }
      totp.setBackupCodes(backupCodes);

      vo.setTotp(totp);
    } else {
      vo.setVerificationCodeSent(true);
    }

    return vo;
  }

  /**
   * 转换为数据导出VO
   */
  public static DataExportVo toDataExportVo(DataExport export) {
    if (export == null) {
      return null;
    }

    DataExportVo vo = new DataExportVo();
    vo.setId(export.getId());
    vo.setType(export.getType());
    vo.setFormat(export.getFormat());
    vo.setStatus(export.getStatus());
    vo.setFileSize(export.getFileSize());
    vo.setDownloadUrl(export.getDownloadUrl());
    vo.setExpiresAt(export.getExpiresAt());
    vo.setRequestedAt(export.getRequestedAt());
    vo.setCompletedAt(export.getCompletedAt());

    // 解析导出范围
    if (export.getScope() != null) {
      try {
        DataExportVo.ExportScopeVo scope = objectMapper.readValue(export.getScope(),
            DataExportVo.ExportScopeVo.class);
        vo.setScope(scope);
      } catch (JsonProcessingException e) {
        vo.setScope(new DataExportVo.ExportScopeVo());
      }
    }

    return vo;
  }
}
