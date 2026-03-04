package cloud.xcan.angus.core.ai.domain.activity;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ActivitySearchRepo extends CustomBaseRepository<Activity> {

}
