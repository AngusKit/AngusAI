package cloud.xcan.angus.core.ai.infra.persistence.postgres.application;

import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import org.springframework.stereotype.Repository;

@Repository("aiApplicationRepo")
public interface AIApplicationRepoPostgres extends AIApplicationRepo {

}
