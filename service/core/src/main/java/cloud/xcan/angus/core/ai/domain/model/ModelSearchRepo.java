package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ModelSearchRepo extends CustomBaseRepository<Model> {

}
