package com.agentx.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Data;

/**
 * Workflow 执行记录实体
 */
@Data
@Entity
@Table(name = "workflow_executions")
public class WorkflowExecutionEntity {

  @Id
  @Column(length = 64)
  private String executionId;

  @Column(name = "workflow_id", nullable = false, length = 64)
  private String workflowId;

  @Column(nullable = false, length = 32)
  private String status;

  @Column(name = "input_json", columnDefinition = "TEXT")
  private String inputJson;

  @Column(name = "output_json", columnDefinition = "TEXT")
  private String outputJson;

  @Column(name = "error_message", length = 2048)
  private String errorMessage;

  @Column(name = "started_at")
  private Instant startedAt;

  @Column(name = "completed_at")
  private Instant completedAt;

  @Column(name = "tenant_id", length = 64)
  private String tenantId;

  @PrePersist
  protected void onCreate() {
    startedAt = Instant.now();
  }
}
