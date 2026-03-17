package cloud.xcan.angus.core.ai.application.cmd.activity;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.activity.Activity;
import java.util.Collection;
import java.util.List;

public interface ActivityCmd {

  void add(Activity activity);

  void addAll(Collection<Activity> activities);

  void deleteByTarget(FullResourceType targetType, List<Long> targetIds);

  /**
   * 记录应用操作活动（国际化）
   *
   * @param applicationId   应用ID
   * @param applicationName 应用名称
   * @param actionKey       活动消息键（ActivityActions 中定义）
   * @param args            消息参数
   */
  void recordApplicationActivity(Long applicationId, String applicationName, String actionKey,
      Object... args);

}




