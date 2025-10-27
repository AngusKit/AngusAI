package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class DatasetDataSearchRepoMysql extends SimpleSearchRepository<DatasetData>
    implements DatasetDataSearchRepo {

}
