package cloud.xcan.angus.core.ai.infra.persistence.mysql.application;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationSearchRepo;
import cloud.xcan.angus.core.jpa.repository.AbstractSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationSearchRepoMysql extends AbstractSearchRepository<Application>
    implements ApplicationSearchRepo {

}
