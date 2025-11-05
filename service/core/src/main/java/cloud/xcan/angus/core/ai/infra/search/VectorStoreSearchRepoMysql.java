package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class VectorStoreSearchRepoMysql extends SimpleSearchRepository<VectorStore>
    implements VectorStoreSearchRepo {

}

