package com.agentx.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentDefinitionRepository extends JpaRepository<AgentDefinitionEntity, String> {

  List<AgentDefinitionEntity> findByTenantId(String tenantId);

  List<AgentDefinitionEntity> findByTenantIdAndStatus(String tenantId, String status);
}
