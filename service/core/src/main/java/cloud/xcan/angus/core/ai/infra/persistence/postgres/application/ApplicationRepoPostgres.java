package cloud.xcan.angus.core.ai.infra.persistence.postgres.application;

import cloud.xcan.angus.core.ai.domain.application.ApplicationRepo;
import org.springframework.stereotype.Repository;

@Repository("applicationRepo")
public interface ApplicationRepoPostgres extends ApplicationRepo {

}
