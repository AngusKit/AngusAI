package cloud.xcan.angus.core.ai.infra.persistence.postgres.application;

import cloud.xcan.angus.core.ai.domain.application.ApplicationStarRepo;
import org.springframework.stereotype.Repository;

@Repository("applicationStarRepo")
public interface ApplicationStarRepoPostgres extends ApplicationStarRepo {

}
