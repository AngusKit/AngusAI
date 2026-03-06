package cloud.xcan.agentx.infrastructure.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowExecutionRepository extends
    JpaRepository<WorkflowExecutionEntity, String> {

  List<WorkflowExecutionEntity> findByWorkflowId(String workflowId);

  List<WorkflowExecutionEntity> findByTenantId(String tenantId);
}
