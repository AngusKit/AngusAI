package cloud.xcan.agentx.infrastructure.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowDefinitionRepository extends
    JpaRepository<WorkflowDefinitionEntity, String> {

  List<WorkflowDefinitionEntity> findByTenantId(String tenantId);
}
