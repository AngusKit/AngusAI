package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApiCollectionRepo extends BaseRepository<ApiCollection, Long> {

  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

}

