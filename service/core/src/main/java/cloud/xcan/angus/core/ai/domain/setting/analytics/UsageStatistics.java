package cloud.xcan.angus.core.ai.domain.setting.analytics;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 使用统计聚合实体(按天/周聚合)
 */
@Entity
@Table(name = "usage_statistics")
@Setter
@Getter
@Accessors(chain = true)
public class UsageStatistics extends TenantAuditingEntity<UsageStatistics, Long> {

  @Id
  private Long id;

  /**
   * 统计日期
   */
  @Column(name = "stat_date", nullable = false)
  private LocalDate statDate;

  /**
   * 统计粒度
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "granularity", nullable = false, length = 20)
  private StatGranularity granularity;

  /**
   * 应用ID
   */
  @Column(name = "app_id")
  private Long appId;

  /**
   * 模型ID
   */
  @Column(name = "model_id")
  private Long modelId;

  /**
   * 总调用次数
   */
  @Column(name = "total_calls", nullable = false)
  private Integer totalCalls;

  /**
   * 成功调用次数
   */
  @Column(name = "successful_calls", nullable = false)
  private Integer successfulCalls;

  /**
   * 失败调用次数
   */
  @Column(name = "failed_calls", nullable = false)
  private Integer failedCalls;

  /**
   * 总输入Token
   */
  @Column(name = "total_input_tokens")
  private Long totalInputTokens;

  /**
   * 总输出Token
   */
  @Column(name = "total_output_tokens")
  private Long totalOutputTokens;

  /**
   * 总Token数
   */
  @Column(name = "total_tokens")
  private Long totalTokens;

  /**
   * 总费用(分)
   */
  @Column(name = "total_cost")
  private Long totalCost;

  /**
   * 平均响应时间(毫秒)
   */
  @Column(name = "avg_response_time_ms")
  private Integer avgResponseTimeMs;

  /**
   * P50响应时间(毫秒)
   */
  @Column(name = "p50_response_time_ms")
  private Integer p50ResponseTimeMs;

  /**
   * P95响应时间(毫秒)
   */
  @Column(name = "p95_response_time_ms")
  private Integer p95ResponseTimeMs;

  /**
   * P99响应时间(毫秒)
   */
  @Column(name = "p99_response_time_ms")
  private Integer p99ResponseTimeMs;

  /**
   * 活跃用户数
   */
  @Column(name = "active_users")
  private Integer activeUsers;

  @Override
  public Long identity() {
    return id;
  }

}
