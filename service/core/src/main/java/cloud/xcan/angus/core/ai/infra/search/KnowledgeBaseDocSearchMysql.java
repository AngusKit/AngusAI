package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class KnowledgeBaseDocSearchMysql extends SimpleSearchRepository<KnowledgeBaseDoc>
    implements KnowledgeBaseDocSearchRepo {

}
