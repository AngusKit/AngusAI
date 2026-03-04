package cloud.xcan.angus.core.ai.infra.persistence.postgres.notification;

import cloud.xcan.angus.core.ai.domain.notification.NotificationRepo;
import org.springframework.stereotype.Repository;

/**
 * PostgreSQL通知仓储实现
 */
@Repository
public interface NotificationRepoPostgres extends NotificationRepo {

}
