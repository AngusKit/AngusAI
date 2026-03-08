package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class AgentSearchRepoMysql extends SimpleSearchRepository<Agent>
    implements AgentSearchRepo {

}
