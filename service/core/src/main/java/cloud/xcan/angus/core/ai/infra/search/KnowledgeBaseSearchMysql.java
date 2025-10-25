package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class KnowledgeBaseSearchMysql extends SimpleSearchRepository<KnowledgeBase>
    implements KnowledgeBaseSearchRepo {

}
