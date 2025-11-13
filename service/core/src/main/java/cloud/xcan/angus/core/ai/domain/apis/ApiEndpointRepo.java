package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiEndpointRepo extends BaseRepository<ApiEndpoint, Long> {

  List<ApiEndpoint> findByCollectionId(Long collectionId);

  List<ApiEndpoint> findByCollectionIdAndEnabled(Long collectionId, boolean enabled);

  Optional<ApiEndpoint> findByIdAndCollectionId(Long id, Long collectionId);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId")
  Long countByCollectionId(@Param("collectionId") Long collectionId);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId AND e.enabled = true")
  Long countEnabledByCollectionId(@Param("collectionId") Long collectionId);

  /**
   * 批量统计接口集下的端点数量 返回 List<Object[]>，其中 [0]=collectionId (Long), [1]=count (Long)
   */
  @Query("SELECT e.collectionId, COUNT(e) FROM ApiEndpoint e WHERE e.collectionId IN :collectionIds GROUP BY e.collectionId")
  List<Object[]> countByCollectionIds(@Param("collectionIds") List<Long> collectionIds);

  /**
   * 批量统计接口集下启用的端点数量 返回 List<Object[]>，其中 [0]=collectionId (Long), [1]=count (Long)
   */
  @Query("SELECT e.collectionId, COUNT(e) FROM ApiEndpoint e WHERE e.collectionId IN :collectionIds AND e.enabled = true GROUP BY e.collectionId")
  List<Object[]> countEnabledByCollectionIds(@Param("collectionIds") List<Long> collectionIds);

  /**
   * 统计所有已启用的端点数量
   */
  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.enabled = true")
  Long countEnabled();

  boolean existsByCollectionIdAndMethodAndPath(Long collectionId, HttpMethod method, String path);

  boolean existsByCollectionIdAndMethodAndPathAndIdNot(Long collectionId, HttpMethod method,
      String path, Long id);

  @Modifying
  void deleteByCollectionId(Long id);

}
