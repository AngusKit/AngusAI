package cloud.xcan.agentx.infrastructure.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentDefinitionRepository extends JpaRepository<AgentDefinitionEntity, String> {

  List<AgentDefinitionEntity> findByTenantId(String tenantId);

  List<AgentDefinitionEntity> findByTenantIdAndStatus(String tenantId, String status);
}
