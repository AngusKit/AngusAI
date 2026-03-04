package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface AIApplicationSearchRepo extends CustomBaseRepository<AIApplication> {

}
