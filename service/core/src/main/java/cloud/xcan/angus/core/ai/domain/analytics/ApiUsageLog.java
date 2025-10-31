package cloud.xcan.angus.core.ai.domain.analytics;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * API使用日志实体
 */
@Entity
@Table(name = "api_usage_log")
@Setter
@Getter
@Accessors(chain = true)
public class ApiUsageLog extends TenantAuditingEntity<ApiUsageLog, Long> {

  @Id
  private Long id;

  /**
   * 应用ID
   */
  @Column(name = "app_id")
  private Long appId;

  /**
   * 用户ID
   */
  @Column(name = "user_id")
  private Long userId;

  /**
   * 接口路径
   */
  @Column(name = "endpoint", nullable = false, length = 200)
  private String endpoint;

  /**
   * HTTP方法
   */
  @Column(name = "method", nullable = false, length = 10)
  private String method;

  /**
   * 模型ID
   */
  @Column(name = "model_id")
  private Long modelId;

  /**
   * 模型名称
   */
  @Column(name = "model_name", length = 100)
  private String modelName;

  /**
   * HTTP状态码
   */
  @Column(name = "status_code", nullable = false)
  private Integer statusCode;

  /**
   * 响应时间(毫秒)
   */
  @Column(name = "response_time_ms", nullable = false)
  private Integer responseTimeMs;

  /**
   * 输入Token数
   */
  @Column(name = "input_tokens")
  private Integer inputTokens;

  /**
   * 输出Token数
   */
  @Column(name = "output_tokens")
  private Integer outputTokens;

  /**
   * 总Token数
   */
  @Column(name = "total_tokens")
  private Integer totalTokens;

  /**
   * 费用(分)
   */
  @Column(name = "cost")
  private Integer cost;

  /**
   * 是否成功
   */
  @Column(name = "is_successful", nullable = false)
  private Boolean isSuccessful;

  /**
   * 错误信息
   */
  @Column(name = "error_message", length = 1000)
  private String errorMessage;

  /**
   * IP地址
   */
  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  /**
   * 用户代理
   */
  @Column(name = "user_agent", length = 500)
  private String userAgent;

  /**
   * 请求时间
   */
  @Column(name = "request_time", nullable = false)
  private LocalDateTime requestTime;

  @Override
  public Long identity() {
    return id;
  }

}
