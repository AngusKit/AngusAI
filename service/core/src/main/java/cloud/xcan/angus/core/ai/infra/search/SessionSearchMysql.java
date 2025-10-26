package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class SessionSearchMysql extends SimpleSearchRepository<Session> implements
    SessionSearchRepo {

}
