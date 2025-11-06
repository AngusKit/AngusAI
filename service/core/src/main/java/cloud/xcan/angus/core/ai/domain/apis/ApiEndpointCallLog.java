package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * API端点调用记录实体 用于记录API端点的调用记录，包括调用时间、响应时间、状态等信息
 */
@Entity
@Table(name = "api_endpoint_call_log")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class ApiEndpointCallLog extends TenantEntity<ApiEndpointCallLog, Long> {

  @Id
  private Long id;

  /**
   * 端点ID
   */
  @Column(name = "endpoint_id", nullable = false)
  private Long endpointId;

  /**
   * 调用时间
   */
  @Column(name = "call_date", nullable = false)
  private LocalDateTime callDate;

  /**
   * 响应时间（毫秒）
   */
  @Column(name = "response_time_ms")
  private Long responseTimeMs;

  /**
   * 调用状态：SUCCESS-成功，FAILED-失败
   */
  @Column(name = "status", nullable = false, length = 20)
  private String status;

  /**
   * HTTP状态码
   */
  @Column(name = "status_code")
  private Integer statusCode;

  /**
   * 用户ID（可选）
   */
  @Column(name = "user_id")
  private Long userId;

  /**
   * 错误信息（失败时记录）
   */
  @Column(name = "error_message", length = 1000)
  private String errorMessage;

  /**
   * IP地址
   */
  @Column(name = "ip_address", length = 50)
  private String ipAddress;

  @Override
  public Long identity() {
    return this.id;
  }
}

