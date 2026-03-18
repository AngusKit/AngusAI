package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class MessageSearchMysql extends SimpleSearchRepository<Message> implements
    MessageSearchRepo {

}
