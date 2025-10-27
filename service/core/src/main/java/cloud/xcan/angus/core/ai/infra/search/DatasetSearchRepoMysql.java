package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class DatasetSearchRepoMysql extends SimpleSearchRepository<Dataset>
    implements DatasetSearchRepo {

}
