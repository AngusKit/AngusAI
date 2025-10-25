package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.ai.domain.BaseEntity;
import cloud.xcan.angus.core.jpa.type.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.Type;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "workflow")
public class Workflow extends BaseEntity {

  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "icon", length = 10)
  private String icon;

  @Column(name = "icon_bg", length = 20)
  private String iconBg;

  @Column(name = "icon_color", length = 20)
  private String iconColor;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private WorkflowType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private WorkflowStatus status = WorkflowStatus.DRAFT;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  @Column(name = "version", length = 20)
  private String version = "1.0.0";

  @Type(JsonType.class)
  @Column(name = "config", columnDefinition = "json")
  private WorkflowConfig config;

  // 统计信息
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

  // 节点和连线信息
  @Column(name = "nodes_count")
  private Integer nodesCount = 0;

  @Column(name = "edges_count")
  private Integer edgesCount = 0;

  // 版本控制
  @Column(name = "current_version_id")
  private Long currentVersionId;

  @Column(name = "version_count")
  private Integer versionCount = 1;

  // 执行控制
  @Column(name = "max_execution_time")
  private Integer maxExecutionTime = 300; // 默认5分钟

  @Column(name = "retry_on_error")
  private Boolean retryOnError = false;

  @Column(name = "max_retries")
  private Integer maxRetries = 3;

  // 触发配置
  @Type(JsonType.class)
  @Column(name = "triggers", columnDefinition = "json")
  private Object triggers;

  // 变量定义
  @Type(JsonType.class)
  @Column(name = "variables", columnDefinition = "json")
  private Object variables;

  // 归档相关
  @Column(name = "archived")
  private Boolean archived = false;

  @Column(name = "archived_at")
  private Long archivedAt;

  // 备份相关
  @Column(name = "backup_enabled")
  private Boolean backupEnabled = false;

  @Column(name = "last_backup_time")
  private Long lastBackupTime;

  // 清理相关
  @Column(name = "cleanup_enabled")
  private Boolean cleanupEnabled = true;

  @Column(name = "last_cleanup_time")
  private Long lastCleanupTime;

  // 监控相关
  @Column(name = "monitoring_enabled")
  private Boolean monitoringEnabled = true;

  @Column(name = "alert_enabled")
  private Boolean alertEnabled = false;

  @Type(JsonType.class)
  @Column(name = "alert_config", columnDefinition = "json")
  private Object alertConfig;

  // 性能相关
  @Column(name = "execution_timeout")
  private Integer executionTimeout = 300;

  @Column(name = "memory_limit")
  private Long memoryLimit;

  @Column(name = "cpu_limit")
  private Long cpuLimit;

  // 安全相关
  @Column(name = "access_control")
  private String accessControl = "private";

  @Type(JsonType.class)
  @Column(name = "permissions", columnDefinition = "json")
  private Object permissions;

  // 标签和分类
  @Type(JsonType.class)
  @Column(name = "tags", columnDefinition = "json")
  private Object tags;

  @Column(name = "category", length = 50)
  private String category;

  // 模板相关
  @Column(name = "is_template")
  private Boolean isTemplate = false;

  @Column(name = "template_id")
  private Long templateId;

  @Column(name = "template_version")
  private String templateVersion;

  // 依赖关系
  @Type(JsonType.class)
  @Column(name = "dependencies", columnDefinition = "json")
  private Object dependencies;

  @Type(JsonType.class)
  @Column(name = "dependents", columnDefinition = "json")
  private Object dependents;

  // 执行历史
  @Column(name = "last_successful_execution")
  private Long lastSuccessfulExecution;

  @Column(name = "last_failed_execution")
  private Long lastFailedExecution;

  @Column(name = "consecutive_failures")
  private Integer consecutiveFailures = 0;

  @Column(name = "max_consecutive_failures")
  private Integer maxConsecutiveFailures = 5;

  // 资源使用
  @Column(name = "total_memory_used")
  private Long totalMemoryUsed = 0L;

  @Column(name = "total_cpu_used")
  private Long totalCpuUsed = 0L;

  @Column(name = "total_storage_used")
  private Long totalStorageUsed = 0L;

  // 成本相关
  @Column(name = "estimated_cost")
  private Double estimatedCost = 0.0;

  @Column(name = "actual_cost")
  private Double actualCost = 0.0;

  @Column(name = "cost_threshold")
  private Double costThreshold;

  // 质量指标
  @Column(name = "reliability_score")
  private Double reliabilityScore = 0.0;

  @Column(name = "performance_score")
  private Double performanceScore = 0.0;

  @Column(name = "maintainability_score")
  private Double maintainabilityScore = 0.0;

  // 文档和元数据
  @Column(name = "documentation", columnDefinition = "text")
  private String documentation;

  @Type(JsonType.class)
  @Column(name = "metadata", columnDefinition = "json")
  private Object metadata;

  // 扩展字段
  @Type(JsonType.class)
  @Column(name = "extensions", columnDefinition = "json")
  private Object extensions;

}
