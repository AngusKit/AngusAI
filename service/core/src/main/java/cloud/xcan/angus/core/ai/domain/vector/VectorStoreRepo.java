package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface VectorStoreRepo extends BaseRepository<VectorStore, Long> {

  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

  @Query(value = "SELECT COUNT(v) FROM vector_store v WHERE v.status = ?1", nativeQuery = true)
  Long countByStatus(String status);

  /**
   * 按类型分组统计存储源数量
   */
  @Query(value = "SELECT type, COUNT(1) cnt FROM vector_store GROUP BY type", nativeQuery = true)
  List<Object[]> countGroupByType();
}

