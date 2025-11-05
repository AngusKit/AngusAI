package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface VectorStoreRepo extends BaseRepository<VectorStore, Long> {

  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

  List<VectorStore> findByType(VectorStoreType type);

  List<VectorStore> findByStatus(String status);

  List<VectorStore> findByEnabled(Boolean enabled);

  @Query("SELECT COUNT(v) FROM VectorStore v WHERE v.type = :type")
  Long countByType(@Param("type") VectorStoreType type);

  @Query("SELECT COUNT(v) FROM VectorStore v WHERE v.status = :status")
  Long countByStatus(@Param("status") String status);
}

