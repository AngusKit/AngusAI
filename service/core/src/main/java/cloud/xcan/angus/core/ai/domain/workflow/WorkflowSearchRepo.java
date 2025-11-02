package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface WorkflowSearchRepo extends CustomBaseRepository<Workflow> {

}
