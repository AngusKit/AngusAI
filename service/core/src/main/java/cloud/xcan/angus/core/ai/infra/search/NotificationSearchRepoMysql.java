package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.notification.Notification;
import cloud.xcan.angus.core.ai.domain.notification.NotificationSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class NotificationSearchRepoMysql extends SimpleSearchRepository<Notification>
    implements NotificationSearchRepo {

}
