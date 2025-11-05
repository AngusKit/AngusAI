package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiEndpointRepo extends BaseRepository<ApiEndpoint, Long> {

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId")
  Long countByCollectionId(@Param("collectionId") Long collectionId);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId AND e.enabled = true")
  Long countEnabledByCollectionId(@Param("collectionId") Long collectionId);

  boolean existsByCollectionIdAndMethodAndPath(Long collectionId, HttpMethod method, String path);

  boolean existsByCollectionIdAndMethodAndPathAndIdNot(Long collectionId, HttpMethod method,
      String path, Long id);

  @Modifying
  void deleteByCollectionId(Long id);
}
