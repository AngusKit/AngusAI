package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class WorkflowSearchRepoMysql extends SimpleSearchRepository<Workflow>
    implements WorkflowSearchRepo {

}
