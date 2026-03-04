package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ai_workflow")
public class Workflow extends TenantAuditingEntity<Workflow, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "icon", length = 10)
  private String icon;

  @Column(name = "icon_bg", length = 20)
  private String iconBg;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private WorkflowType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private WorkflowStatus status;

  @Column(name = "version", length = 20)
  private String version;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility;

  @Type(JsonType.class)
  @Column(name = "config", columnDefinition = "json")
  private WorkflowConfig config;

  // 标签和分类
  @Type(JsonType.class)
  @Column(name = "tags", columnDefinition = "json")
  private List<String> tags;

  // 版本控制
  @Column(name = "current_version_id")
  private Long currentVersionId;

  @Column(name = "version_count")
  private Integer versionCount = 1;

  // 性能相关
  @Column(name = "execution_timeout")
  private Integer executionTimeout = 300;

  // 执行统计信息
  @Column(name = "total_executions")
  private Long totalExecutions = 0L;

  @Column(name = "successful_executions")
  private Long successfulExecutions = 0L;

  @Column(name = "failed_executions")
  private Long failedExecutions = 0L;

  @Column(name = "avg_execution_time")
  private Double avgExecutionTime = 0.0;

  @Column(name = "last_execution_time")
  private Long lastExecutionTime;

  @Column(name = "last_execution_status")
  private String lastExecutionStatus;

  @Override
  public Long identity() {
    return id;
  }
}
