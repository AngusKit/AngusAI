package cloud.xcan.angus.core.ai.application.cmd.notification;

import cloud.xcan.angus.core.ai.domain.notification.Notification;
import java.util.List;

/**
 * 通知命令服务接口
 */
public interface NotificationCmd {

  Notification create(Notification notification);

  Notification update(Long id, Notification notification);

  void updateReadStatus(List<Long> ids, Boolean isRead);

  void updateStarredStatus(List<Long> ids, Boolean isStarred);

  void archive(List<Long> ids);

  int markAllAsRead();

  void delete(List<Long> ids);
}
