package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ResourceSharingAccessLogRepo extends
    BaseRepository<ResourceSharingAccessLog, Long> {

}
