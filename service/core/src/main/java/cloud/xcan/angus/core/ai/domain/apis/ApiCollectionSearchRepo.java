package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApiCollectionSearchRepo extends CustomBaseRepository<ApiCollection> {

}

