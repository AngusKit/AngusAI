package cloud.xcan.angus.core.ai.infra.persistence.mysql.application;

import cloud.xcan.angus.core.ai.domain.application.ApplicationRepo;
import org.springframework.stereotype.Repository;

@Repository("applicationRepo")
public interface ApplicationRepoMysql extends ApplicationRepo {

}
