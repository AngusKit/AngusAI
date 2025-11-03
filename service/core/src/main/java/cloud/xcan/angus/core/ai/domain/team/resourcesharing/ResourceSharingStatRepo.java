package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ResourceSharingStatRepo extends BaseRepository<ResourceSharingStat, Long> {

  ResourceSharingStat findByResourceTypeAndResourceId(ResourceType type, Long id);
}
