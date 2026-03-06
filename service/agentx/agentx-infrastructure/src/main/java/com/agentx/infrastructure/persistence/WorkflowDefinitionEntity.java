package com.agentx.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

/**
 * Workflow 定义持久化实体
 */
@Data
@Entity
@Table(name = "workflow_definitions")
public class WorkflowDefinitionEntity {

  @Id
  @Column(length = 64)
  private String id;

  @Column(nullable = false, length = 128)
  private String name;

  @Column(length = 512)
  private String description;

  @Column(nullable = false, length = 16)
  private String version;

  @Column(name = "tenant_id", length = 64)
  private String tenantId;

  @Column(nullable = false, length = 32)
  private String status;

  @Column(name = "definition_json", columnDefinition = "TEXT")
  private String definitionJson;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = Instant.now();
    updatedAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }
}
