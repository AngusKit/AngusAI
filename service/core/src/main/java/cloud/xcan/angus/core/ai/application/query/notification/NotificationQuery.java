package cloud.xcan.angus.core.ai.application.query.notification;

import cloud.xcan.angus.core.ai.domain.notification.Notification;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 通知查询服务接口
 */
public interface NotificationQuery {

  Notification detail(Long id);

  Notification findAndCheck(Long id);

  Page<Notification> list(GenericSpecification<Notification> spec, Pageable pageable,
      boolean fullTextSearch, String[] match);

  NotificationStatisticsVo getStatistics();

  List<Notification> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime);

  /**
   * 统计当前用户未读通知数
   */
  long countUnread(Long userId);
}
