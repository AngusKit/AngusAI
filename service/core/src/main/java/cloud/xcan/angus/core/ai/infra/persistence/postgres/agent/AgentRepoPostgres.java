package cloud.xcan.angus.core.ai.infra.persistence.postgres.agent;

import cloud.xcan.angus.core.ai.domain.agent.AgentRepo;
import org.springframework.stereotype.Repository;

@Repository("agentRepo")
public interface AgentRepoPostgres extends AgentRepo {

}
