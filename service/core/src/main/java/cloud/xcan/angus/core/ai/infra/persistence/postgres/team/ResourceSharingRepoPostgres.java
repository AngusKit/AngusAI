package cloud.xcan.angus.core.ai.infra.persistence.postgres.team;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingRepo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceSharingRepoPostgres extends ResourceSharingRepo {

}
