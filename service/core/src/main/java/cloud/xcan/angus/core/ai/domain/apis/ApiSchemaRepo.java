package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApiSchemaRepo extends BaseRepository<ApiSchema, Long> {

  ApiSchema findByCollectionId(Long id);
}
