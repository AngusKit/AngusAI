package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint.HttpMethod;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiEndpointRepo extends BaseRepository<ApiEndpoint, Long> {

  List<ApiEndpoint> findByCollectionId(Long collectionId);

  List<ApiEndpoint> findByCollectionIdAndEnabled(Long collectionId, Boolean enabled);

  List<ApiEndpoint> findByCollectionIdAndMethod(Long collectionId, HttpMethod method);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId")
  Long countByCollectionId(@Param("collectionId") Long collectionId);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId AND e.enabled = true")
  Long countEnabledByCollectionId(@Param("collectionId") Long collectionId);

  boolean existsByCollectionIdAndMethodAndPath(Long collectionId, HttpMethod method, String path);

  boolean existsByCollectionIdAndMethodAndPathAndIdNot(Long collectionId, HttpMethod method, String path, Long id);
}

