package cloud.xcan.angus.core.ai.infra.persistence.mysql.activity;

import cloud.xcan.angus.core.ai.domain.team.activity.ActivityRepo;
import org.springframework.stereotype.Repository;

@Repository("activityRepo")
public interface ActivityRepoMysql extends ActivityRepo {


}
