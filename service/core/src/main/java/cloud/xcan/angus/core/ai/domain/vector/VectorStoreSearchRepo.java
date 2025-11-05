package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface VectorStoreSearchRepo extends CustomBaseRepository<VectorStore> {

}

