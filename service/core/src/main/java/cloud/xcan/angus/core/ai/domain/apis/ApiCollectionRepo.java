package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiCollectionRepo extends BaseRepository<ApiCollection, Long> {

  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

  List<ApiCollection> findBySource(ApiCollectionSource source);

  List<ApiCollection> findByVisibility(Visibility visibility);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId")
  Long countEndpointsByCollectionId(@Param("collectionId") Long collectionId);

  @Query("SELECT COUNT(e) FROM ApiEndpoint e WHERE e.collectionId = :collectionId AND e.enabled = true")
  Long countEnabledEndpointsByCollectionId(@Param("collectionId") Long collectionId);
}

