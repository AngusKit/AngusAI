package cloud.xcan.angus.core.ai.interfaces.settings.facade;

import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ChangePasswordDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DataExportRequestDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DeleteAccountDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Enable2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.NotificationSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.UserSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Verify2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ChangePasswordVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DataExportVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DeleteAccountVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.Enable2FAVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.NotificationSettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.SecuritySettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UploadAvatarVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UserSettingsVo;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 * 设置门面接口
 */
public interface SettingsFacade {

  /**
   * 请求数据导出
   */
  DataExportVo requestDataExport(Long userId, DataExportRequestDto dto);

  /**
   * 获取用户设置
   */
  UserSettingsVo getUserSettings(Long userId);

  /**
   * 更新用户设置
   */
  UserSettingsVo updateUserSettings(Long userId, UserSettingsUpdateDto dto);

  /**
   * 上传头像
   */
  UploadAvatarVo uploadAvatar(Long userId, MultipartFile file);

  /**
   * 获取通知设置
   */
  NotificationSettingsVo getNotificationSettings(Long userId);

  /**
   * 更新通知设置
   */
  NotificationSettingsVo updateNotificationSettings(Long userId, NotificationSettingsUpdateDto dto);

  /**
   * 获取安全设置
   */
  SecuritySettingsVo getSecuritySettings(Long userId);

  /**
   * 启用双因素认证
   */
  Enable2FAVo enable2FA(Long userId, Enable2FADto dto);

  /**
   * 验证双因素认证
   */
  SecuritySettingsVo verify2FA(Long userId, Verify2FADto dto);

  /**
   * 禁用双因素认证
   */
  void disable2FA(Long userId, String password, String code);

  /**
   * 修改密码
   */
  ChangePasswordVo changePassword(Long userId, ChangePasswordDto dto);

  /**
   * 终止会话
   */
  void terminateSession(Long userId, String sessionId);

  /**
   * 终止所有其他会话
   */
  void revokeAllSessions(Long userId, String currentSessionId);

  /**
   * 取消删除账户
   */
  void cancelDeleteAccount(Long userId);

  /**
   * 删除头像
   */
  void deleteAvatar(Long userId);

  /**
   * 删除账户
   */
  DeleteAccountVo deleteAccount(Long userId, DeleteAccountDto dto);

  /**
   * 获取数据导出列表
   */
  List<DataExportVo> getDataExports(Long userId);
}
