package cloud.xcan.angus.core.ai.infra.persistence.mysql.chat;

import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import org.springframework.stereotype.Repository;

@Repository("sessionRepo")
public interface SessionRepoMysql extends SessionRepo {

}
