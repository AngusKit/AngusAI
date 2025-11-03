package cloud.xcan.angus.core.ai.infra.persistence.postgres.team;

import cloud.xcan.angus.core.ai.domain.team.activity.ActivityRepo;
import org.springframework.stereotype.Repository;

@Repository("activityRepo")
public interface ActivityRepoPostgres extends ActivityRepo {


}
