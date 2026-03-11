package cloud.xcan.angus.core.ai.infra.persistence.mysql.application;

import cloud.xcan.angus.core.ai.domain.application.ApplicationStarRepo;
import org.springframework.stereotype.Repository;

@Repository("applicationStarRepo")
public interface ApplicationStarRepoMysql extends ApplicationStarRepo {

}
