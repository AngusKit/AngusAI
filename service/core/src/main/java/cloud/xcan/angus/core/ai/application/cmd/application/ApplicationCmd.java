package cloud.xcan.angus.core.ai.application.cmd.application;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;

public interface ApplicationCmd {

  /**
   * 创建应用
   */
  AIApplication create(AIApplication application);

  /**
   * 复制应用
   */
  AIApplication duplicate(Long sourceId, String name);

  /**
   * 更新应用基本信息
   */
  AIApplication update(AIApplication application);

  /**
   * 更新应用配置
   */
  AIApplication updateConfig(Long id, ApplicationConfig config);

  /**
   * 发布应用
   */
  AIApplication modifyStatus(Long id, ApplicationStatus status);

  /**
   * 分享应用
   */
  AIApplication share(AIApplication application);

  /**
   * 删除应用
   */
  void delete(Long id);

  /**
   * 标星/取消标星应用
   */
  AIApplication star(Long id, Boolean isStarred);

}
