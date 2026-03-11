package cloud.xcan.angus.core.ai.domain.analytics;

import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Table(name = "ai_api_usage_log")
@Setter
@Getter
@Accessors(chain = true)
public class ApiUsageLog extends TenantEntity<ApiUsageLog, Long> {

  @Id
  private Long id;

  @Column(name = "app_id")
  private Long appId;

  @Column(name = "agent_id")
  private Long agentId;

  @Column(name = "model_id")
  private Long modelId;

  /**
   * 会话ID(UUID)，关联对话
   */
  @Column(name = "session_id", length = 36)
  private String sessionId;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "endpoint", nullable = false, length = 200)
  private String endpoint;

  @Column(name = "method", nullable = false, length = 10)
  private String method;

  @Column(name = "status_code", nullable = false)
  private Integer statusCode;

  @Column(name = "response_time_ms", nullable = false)
  private Integer responseTimeMs;

  @Column(name = "input_tokens")
  private Integer inputTokens;

  @Column(name = "output_tokens")
  private Integer outputTokens;

  @Column(name = "total_tokens")
  private Integer totalTokens;

  /**
   * 费用(美元、分)
   */
  @Column(name = "cost")
  private Integer cost;

  @Column(name = "is_successful", nullable = false)
  private Boolean isSuccessful;

  @Column(name = "error_message", length = 1000)
  private String errorMessage;

  @Column(name = "ip_address", length = 40)
  private String ipAddress;

  @Column(name = "user_agent", length = 400)
  private String userAgent;

  @Column(name = "device", length = 80)
  private String device;

  @Column(name = "device_id", length = 100)
  private String deviceId;

  @Column(name = "request_time", nullable = false)
  private LocalDateTime requestTime;

  @Override
  public Long identity() {
    return id;
  }

}
