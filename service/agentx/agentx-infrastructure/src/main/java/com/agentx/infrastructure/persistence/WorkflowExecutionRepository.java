package com.agentx.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowExecutionRepository extends
    JpaRepository<WorkflowExecutionEntity, String> {

  List<WorkflowExecutionEntity> findByWorkflowId(String workflowId);

  List<WorkflowExecutionEntity> findByTenantId(String tenantId);
}
