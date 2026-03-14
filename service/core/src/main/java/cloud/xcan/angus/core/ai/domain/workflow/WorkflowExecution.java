package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

/**
 * 工作流执行记录
 * 根据工作流节点信息记录每次执行的输入、输出、节点执行详情
 */
@Setter
@Getter
@Entity
@Table(name = "ai_workflow_execution")
public class WorkflowExecution extends TenantAuditingEntity<WorkflowExecution, Long> {

  @Id
  private Long id;

  /** 执行ID（业务标识，UUID），供前端查询 */
  @Column(name = "execution_id", nullable = false, unique = true, length = 64)
  private String executionId;

  /** 工作流ID */
  @Column(name = "workflow_id", nullable = false)
  private Long workflowId;

  /** 工作流名称（冗余存储，便于列表展示） */
  @Column(name = "workflow_name", length = 100)
  private String workflowName;

  /** 活动描述，如「执行工作流」 */
  @Column(name = "activity", length = 200)
  private String activity;

  /** 执行状态：SUCCESS, FAILED, RUNNING */
  @Column(name = "status", nullable = false, length = 20)
  private String status;

  /** 开始时间 */
  @Column(name = "started_at", nullable = false)
  private LocalDateTime startedAt;

  /** 完成时间 */
  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  /** 执行时长（毫秒） */
  @Column(name = "execution_time")
  private Long executionTime;

  @Type(JsonType.class)
  @Column(name = "inputs", columnDefinition = "json")
  private Object inputs;

  @Type(JsonType.class)
  @Column(name = "outputs", columnDefinition = "json")
  private Object outputs;

  /** 节点执行详情：nodeId -> { status, result, error } */
  @Type(JsonType.class)
  @Column(name = "node_executions", columnDefinition = "json")
  private Object nodeExecutions;

  /** 错误信息 */
  @Column(name = "error_message", length = 2000)
  private String errorMessage;

  @Override
  public Long identity() {
    return id;
  }
}
