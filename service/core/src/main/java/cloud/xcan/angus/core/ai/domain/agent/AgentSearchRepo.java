package cloud.xcan.angus.core.ai.domain.agent;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface AgentSearchRepo extends CustomBaseRepository<Agent> {

}
