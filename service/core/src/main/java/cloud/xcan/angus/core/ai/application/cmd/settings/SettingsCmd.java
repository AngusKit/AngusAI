package cloud.xcan.angus.core.ai.application.cmd.settings;

import cloud.xcan.angus.core.ai.domain.settings.NotificationSettings;
import cloud.xcan.angus.core.ai.domain.settings.PrivacySettings;
import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import cloud.xcan.angus.core.ai.domain.settings.UserPreferences;
import cloud.xcan.angus.core.ai.domain.settings.UserSettings;
import cloud.xcan.angus.core.ai.domain.settings.dataexport.DataExport;
import cloud.xcan.angus.core.ai.domain.settings.securitysettings.SecuritySettings;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DataExportRequestDto;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 设置命令服务接口
 */
public interface SettingsCmd {

  /**
   * 初始化用户设置(用户首次登录时调用)
   */
  UserSettings initUserSettings(Long userId, String email);

  /**
   * 请求数据导出
   */
  DataExport requestDataExport(Long userId, DataExportRequestDto request);

  /**
   * 更新用户个人资料
   */
  UserSettings updateProfile(Long userId, Map<String, Object> profile);

  /**
   * 更新用户偏好设置
   */
  UserSettings updatePreferences(Long userId, UserPreferences preferences);

  /**
   * 更新隐私设置
   */
  UserSettings updatePrivacy(Long userId, PrivacySettings privacy);

  /**
   * 上传头像
   */
  UserSettings uploadAvatar(Long userId, String avatarUrl);

  /**
   * 更新通知设置
   */
  UserSettings updateNotificationSettings(Long userId, NotificationSettings notificationSettings);

  /**
   * 启用双因素认证
   */
  SecuritySettings enable2FA(Long userId, TwoFactorMethod method);

  /**
   * 验证并完成双因素认证设置
   */
  SecuritySettings verify2FA(Long userId, String code);

  /**
   * 禁用双因素认证
   */
  SecuritySettings disable2FA(Long userId, String password, String code);

  /**
   * 修改密码
   */
  LocalDateTime changePassword(Long userId, String currentPassword, String newPassword);

  /**
   * 终止指定会话
   */
  void terminateSession(Long userId, String sessionId);

  /**
   * 终止所有其他会话
   */
  int revokeAllOtherSessions(Long userId, String currentSessionId);

  /**
   * 取消删除账户
   */
  void cancelDeleteAccount(Long userId);

  /**
   * 删除头像
   */
  UserSettings deleteAvatar(Long userId);

  /**
   * 请求删除账户
   */
  LocalDateTime requestDeleteAccount(Long userId, String password, String reason, String feedback);
}
