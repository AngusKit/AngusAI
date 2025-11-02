package cloud.xcan.angus.core.ai.application.query.setting;

import cloud.xcan.angus.core.ai.domain.setting.UserSession;
import cloud.xcan.angus.core.ai.domain.setting.UserSettings;
import cloud.xcan.angus.core.ai.domain.setting.dataexport.DataExport;
import cloud.xcan.angus.core.ai.domain.setting.loginhistory.LoginHistory;
import cloud.xcan.angus.core.ai.domain.setting.securitysettings.SecuritySettings;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 设置查询服务接口
 */
public interface SettingsQuery {

  /**
   * 根据用户ID查询用户设置
   */
  UserSettings findUserSettingsByUserId(Long userId);

  /**
   * 根据用户ID查询安全设置
   */
  SecuritySettings findSecuritySettingsByUserId(Long userId);

  /**
   * 查询用户的活跃会话列表
   */
  List<UserSession> findActiveSessionsByUserId(Long userId);

  /**
   * 根据会话ID查询会话
   */
  UserSession findSessionBySessionId(String sessionId);

  /**
   * 统计用户的活跃会话数
   */
  int countActiveSessionsByUserId(Long userId);

  /**
   * 分页查询用户登录历史
   */
  Page<LoginHistory> findLoginHistoryByUserId(Long userId, Pageable pageable);

  /**
   * 查询用户最近的登录历史
   */
  List<LoginHistory> findRecentLoginHistory(Long userId);

  /**
   * 查询用户的数据导出记录
   */
  List<DataExport> findDataExportsByUserId(Long userId);

  /**
   * 根据ID查询数据导出记录
   */
  DataExport findDataExportById(Long id);

  /**
   * 统计用户今天的导出次数
   */
  int countTodayExportsByUserId(Long userId);
}
