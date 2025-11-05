package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ApiEndpointSearchRepoMysql extends SimpleSearchRepository<ApiEndpoint>
    implements ApiEndpointSearchRepo {

}
