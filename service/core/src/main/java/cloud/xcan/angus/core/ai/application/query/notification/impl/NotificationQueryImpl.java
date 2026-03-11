package cloud.xcan.angus.core.ai.application.query.notification.impl;

import cloud.xcan.angus.core.ai.application.query.notification.NotificationQuery;
import cloud.xcan.angus.core.ai.domain.notification.Notification;
import cloud.xcan.angus.core.ai.domain.notification.NotificationRepo;
import cloud.xcan.angus.core.ai.domain.notification.NotificationSearchRepo;
import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationPriority;
import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationType;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 通知查询服务实现
 */
@Service
public class NotificationQueryImpl implements NotificationQuery {

  @Resource
  private NotificationRepo notificationRepo;

  @Resource
  private NotificationSearchRepo notificationSearchRepo;

  @Override
  public Notification detail(Long id) {
    return new BizTemplate<Notification>() {
      @Override
      protected Notification process() {
        return findAndCheck(id);
      }
    }.execute();
  }

  @Override
  public Notification findAndCheck(Long id) {
    return new BizTemplate<Notification>() {
      @Override
      protected Notification process() {
        return notificationRepo.findById(id).orElseThrow(
            () -> ResourceNotFound.of("通知「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Page<Notification> list(GenericSpecification<Notification> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Notification>>() {
      @Override
      protected Page<Notification> process() {
        return fullTextSearch
            ? notificationSearchRepo.find(spec.getCriteria(), pageable, Notification.class, match)
            : notificationRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public NotificationStatisticsVo getStatistics() {
    return new BizTemplate<NotificationStatisticsVo>() {
      @Override
      protected NotificationStatisticsVo process() {
        Long currentUserId = PrincipalContext.getUserId();

        NotificationStatisticsVo vo = new NotificationStatisticsVo();

        long total = notificationRepo.countAll(currentUserId);
        long unread = notificationRepo.countUnread(currentUserId);
        long starred = notificationRepo.countStarred(currentUserId);
        long archived = notificationRepo.countArchived(currentUserId);
        long todayNew = notificationRepo.countTodayNew(currentUserId);

        vo.setTotal(total);
        vo.setUnread(unread);
        vo.setStarred(starred);
        vo.setArchived(archived);
        vo.setTodayNew(todayNew);
        vo.setComparedYesterday(todayNew);

        Map<String, Long> byType = new HashMap<>();
        List<Object[]> typeResults = notificationRepo.countByType(currentUserId);
        for (Object[] result : typeResults) {
          NotificationType type = (NotificationType) result[0];
          Long count = ((Number) result[1]).longValue();
          byType.put(type.name(), count);
        }
        for (NotificationType type : NotificationType.values()) {
          byType.putIfAbsent(type.name(), 0L);
        }
        vo.setByType(byType);

        Map<String, Long> byPriority = new HashMap<>();
        List<Object[]> priorityResults = notificationRepo.countByPriority(currentUserId);
        for (Object[] result : priorityResults) {
          NotificationPriority priority = (NotificationPriority) result[0];
          Long count = ((Number) result[1]).longValue();
          byPriority.put(priority.name(), count);
        }
        for (NotificationPriority priority : NotificationPriority.values()) {
          byPriority.putIfAbsent(priority.name(), 0L);
        }
        vo.setByPriority(byPriority);

        Map<String, Long> byCategory = new HashMap<>();
        List<Object[]> categoryResults = notificationRepo.countByCategory(currentUserId);
        for (Object[] result : categoryResults) {
          String category = (String) result[0];
          Long count = ((Number) result[1]).longValue();
          byCategory.put(category, count);
        }
        vo.setByCategory(byCategory);

        return vo;
      }
    }.execute();
  }

  @Override
  public List<Notification> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
    Long currentUserId = PrincipalContext.getUserId();
    return notificationRepo.findByTimeRange(currentUserId, startTime, endTime);
  }

  @Override
  public long countUnread(Long userId) {
    if (userId == null) {
      return 0L;
    }
    return notificationRepo.countUnread(userId);
  }
}
