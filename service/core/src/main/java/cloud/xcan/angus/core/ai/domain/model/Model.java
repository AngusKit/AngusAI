package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 模型实体
 */
@Entity
@Table(name = "model")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class Model extends TenantAuditingEntity<Model, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @Column(name = "description", nullable = false, length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private ModelType type;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "icon_bg")
  private String iconBg;

  @Column(name = "icon_color")
  private String iconColor;

  @Enumerated(EnumType.STRING)
  @Column(name = "provider", nullable = false)
  private ModelProvider provider;

  @Column(name = "version", length = 20)
  private String version;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ModelStatus status;

  @Column(name = "status_color")
  private String statusColor;

  @Column(name = "api_endpoint")
  private String apiEndpoint;

  @Column(name = "api_key")
  private String apiKey;

  @Column(name = "api_key_masked")
  private String apiKeyMasked;

  // 配置信息（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private ModelConfig config;

  // 性能指标
  @Column(name = "latency")
  private String latency;

  @Column(name = "latency_ms")
  private Double latencyMs;

  @Column(name = "throughput")
  private String throughput;

  @Column(name = "throughput_raw")
  private Double throughputRaw;

  @Column(name = "accuracy")
  private String accuracy;

  @Column(name = "accuracy_percent")
  private Double accuracyPercent;

  // 资源使用
  @Column(name = "cpu")
  private String cpu;

  @Column(name = "cpu_percent")
  private Double cpuPercent;

  @Column(name = "memory")
  private String memory;

  @Column(name = "memory_bytes")
  private Long memoryBytes;

  @Column(name = "gpu")
  private String gpu;

  @Column(name = "gpu_percent")
  private Double gpuPercent;

  // 统计数据
  @Column(name = "total_calls")
  private Long totalCalls = 0L;

  @Column(name = "successful_calls")
  private Long successfulCalls = 0L;

  @Column(name = "failed_calls")
  private Long failedCalls = 0L;

  @Column(name = "total_tokens")
  private Long totalTokens = 0L;

  @Column(name = "total_cost")
  private Double totalCost = 0.0;

  @Column(name = "avg_response_time")
  private Double avgResponseTime = 0.0;

  @Column(name = "success_rate")
  private Double successRate = 0.0;

  @Column(name = "last_24_hours_calls")
  private Long last24HoursCalls = 0L;

  // 部署相关
  @Column(name = "deployed")
  private String deployed;

  @Column(name = "deployed_at")
  private Long deployedAt;

  @Column(name = "last_call_at")
  private Long lastCallAt;

  // 限制配置
  @Column(name = "rate_limit")
  private Integer rateLimit;

  @Column(name = "daily_limit")
  private Integer dailyLimit;

  @Column(name = "max_concurrent")
  private Integer maxConcurrent;

  // 部署配置
  @Column(name = "region")
  private String region;

  @Column(name = "instance_type")
  private String instanceType;

  @Column(name = "replicas")
  private Integer replicas;

  @Column(name = "auto_scaling")
  private Boolean autoScaling = false;

  @Column(name = "min_replicas")
  private Integer minReplicas;

  @Column(name = "max_replicas")
  private Integer maxReplicas;

  // 错误信息
  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "error_count")
  private Long errorCount = 0L;

  @Transient
  private boolean configValidated;
  @Transient
  private boolean dependenciesChecked;
  @Transient
  private boolean resourcesCleaned;

  @Override
  public Long identity() {
    return this.id;
  }
}
