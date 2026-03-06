package com.agentx.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowDefinitionRepository extends
    JpaRepository<WorkflowDefinitionEntity, String> {

  List<WorkflowDefinitionEntity> findByTenantId(String tenantId);
}
