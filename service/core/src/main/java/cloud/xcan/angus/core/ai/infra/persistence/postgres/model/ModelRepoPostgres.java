package cloud.xcan.angus.core.ai.infra.persistence.postgres.model;

import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import org.springframework.stereotype.Repository;

@Repository("modelRepo")
public interface ModelRepoPostgres extends ModelRepo {

}

