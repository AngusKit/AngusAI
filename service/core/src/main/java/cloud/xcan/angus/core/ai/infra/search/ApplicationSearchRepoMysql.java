package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationSearchRepoMysql extends SimpleSearchRepository<Application>
    implements ApplicationSearchRepo {

}
