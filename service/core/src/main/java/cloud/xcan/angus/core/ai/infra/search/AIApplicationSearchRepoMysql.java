package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class AIApplicationSearchRepoMysql extends SimpleSearchRepository<AIApplication>
    implements AIApplicationSearchRepo {

}
