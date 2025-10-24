package cloud.xcan.angus.core.ai.application.cmd.application;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;

public interface ApplicationCmd {

  /**
   * 创建应用
   */
  Application create(Application application);

  /**
   * 复制应用
   */
  Application duplicate(Long sourceId, String name);

  /**
   * 更新应用基本信息
   */
  Application update(Application application);

  /**
   * 更新应用配置
   */
  Application updateConfig(Long id, ApplicationConfig config);

  /**
   * 发布应用
   */
  Application modifyStatus(Long id, ApplicationStatus status);

  /**
   * 分享应用
   */
  Application share(Application application);

  /**
   * 删除应用
   */
  void delete(Long id);

}
