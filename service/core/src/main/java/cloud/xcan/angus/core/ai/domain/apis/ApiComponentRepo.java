package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.servers.Server;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApiComponentRepo extends BaseRepository<ApiComponent, Long> {

  List<ApiComponent> findByCollectionIdAndType(Long collectionId, ApiComponentType type);

  List<ApiComponent> findByCollectionId(Long collectionId);

  @Modifying
  void deleteByCollectionIdAndRefIn(Long collectionId, Collection<String> refs);

  @Modifying
  void deleteByCollectionId(Long collectionId);

}
