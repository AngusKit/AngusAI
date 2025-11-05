package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ApiCollectionSearchRepoMysql extends SimpleSearchRepository<ApiCollection>
    implements ApiCollectionSearchRepo {

}

