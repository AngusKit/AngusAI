package cloud.xcan.angus.core.ai.application.cmd.notification.impl;

import static cloud.xcan.angus.core.utils.PrincipalContextUtils.getOptTenantId;

import cloud.xcan.angus.core.ai.application.cmd.notification.NotificationCmd;
import cloud.xcan.angus.core.ai.application.query.notification.NotificationQuery;
import cloud.xcan.angus.core.ai.domain.notification.Notification;
import cloud.xcan.angus.core.ai.domain.notification.NotificationRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 通知命令服务实现
 */
@Service
public class NotificationCmdImpl extends CommCmd<Notification, Long> implements NotificationCmd {

  @Resource
  private NotificationRepo notificationRepo;

  @Resource
  private NotificationQuery notificationQuery;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Notification create(Notification notification) {
    return new BizTemplate<Notification>() {
      @Override
      protected Notification process() {
        if (notification.getTimestamp() == null) {
          notification.setTimestamp(LocalDateTime.now());
        }
        if (notification.getIsRead() == null) {
          notification.setIsRead(false);
        }
        if (notification.getIsStarred() == null) {
          notification.setIsStarred(false);
        }
        if (notification.getIsArchived() == null) {
          notification.setIsArchived(false);
        }

        if (notification.getTenantId() == null) {
          Long optTenantId = getOptTenantId();
          if (optTenantId != null && optTenantId > 0) {
            notification.setTenantId(optTenantId);
          }
        }

        insert(notification);
        return notification;
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Notification update(Long id, Notification notification) {
    return new BizTemplate<Notification>() {
      Notification existing;

      @Override
      protected void checkParams() {
        existing = notificationQuery.findAndCheck(id);
      }

      @Override
      protected Notification process() {
        if (notification.getTitle() != null) {
          existing.setTitle(notification.getTitle());
        }
        if (notification.getDescription() != null) {
          existing.setDescription(notification.getDescription());
        }
        if (notification.getCategory() != null) {
          existing.setCategory(notification.getCategory());
        }
        if (notification.getPriority() != null) {
          existing.setPriority(notification.getPriority());
        }
        if (notification.getType() != null) {
          existing.setType(notification.getType());
        }
        notificationRepo.save(existing);
        return existing;
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updateReadStatus(List<Long> ids, Boolean isRead) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        notificationRepo.updateReadStatus(ids, isRead);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updateStarredStatus(List<Long> ids, Boolean isStarred) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        notificationRepo.updateStarredStatus(ids, isStarred);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void archive(List<Long> ids) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        notificationRepo.archiveByIds(ids);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public int markAllAsRead() {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        Long currentUserId = PrincipalContext.getUserId();
        return notificationRepo.markAllAsRead(currentUserId);
      }
    }.execute();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void delete(List<Long> ids) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        notificationRepo.deleteAllById(ids);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Notification, Long> getRepository() {
    return this.notificationRepo;
  }
}
