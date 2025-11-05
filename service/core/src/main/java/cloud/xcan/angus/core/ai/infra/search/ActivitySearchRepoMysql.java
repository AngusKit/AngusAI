package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivitySearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ActivitySearchRepoMysql extends SimpleSearchRepository<Activity>
    implements ActivitySearchRepo {
}
