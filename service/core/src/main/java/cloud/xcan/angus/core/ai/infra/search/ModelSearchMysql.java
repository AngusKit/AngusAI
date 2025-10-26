package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ModelSearchMysql extends SimpleSearchRepository<Model> implements ModelSearchRepo {

}
