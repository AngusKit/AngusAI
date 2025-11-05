package cloud.xcan.angus.core.ai.domain.vector;

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
 * 向量存储源访问记录实体
 * 用于记录向量存储源的查询访问记录，包括查询时间、响应时间、状态等信息
 */
@Entity
@Table(name = "vector_store_access_log")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class VectorStoreAccessLog extends TenantEntity<VectorStoreAccessLog, Long> {

  @Id
  private Long id;

  /**
   * 向量存储源ID
   */
  @Column(name = "vector_store_id", nullable = false)
  private Long vectorStoreId;

  /**
   * 查询时间
   */
  @Column(name = "query_date", nullable = false)
  private LocalDateTime queryDate;

  /**
   * 响应时间（毫秒）
   */
  @Column(name = "response_time")
  private Long responseTime;

  /**
   * 查询状态：SUCCESS-成功，FAILED-失败
   */
  @Column(name = "status", nullable = false, length = 20)
  private String status;

  /**
   * 用户ID（可选）
   */
  @Column(name = "user_id")
  private Long userId;

  /**
   * 错误信息（失败时记录）
   */
  @Column(name = "error_message", length = 500)
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

