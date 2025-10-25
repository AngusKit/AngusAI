package cloud.xcan.angus.core.ai.domain.settings.apikey;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * API密钥实体
 */
@Entity
@Table(name = "api_key")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class ApiKey extends TenantAuditingEntity<ApiKey, Long> {

  @Id
  private Long id;

  /**
   * 密钥名称
   */
  @Column(name = "name", nullable = false, length = 100)
  private String name;

  /**
   * 密钥描述
   */
  @Column(name = "description", length = 500)
  private String description;

  /**
   * API密钥（加密存储）
   */
  @Column(name = "key_hash", nullable = false, length = 255)
  private String keyHash;

  /**
   * 密钥前缀（用于部分显示）sk-abc123
   */
  @Column(name = "key_prefix", length = 20)
  private String keyPrefix;

  /**
   * 状态
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ApiKeyStatus status = ApiKeyStatus.ACTIVE;

  /**
   * 权限列表
   */
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "api_key_permission", joinColumns = @JoinColumn(name = "api_key_id"))
  @Column(name = "permission")
  @Enumerated(EnumType.STRING)
  private List<ApiKeyPermission> permissions = new ArrayList<>();

  /**
   * 速率限制（次/分钟）
   */
  @Column(name = "rate_limit")
  private Integer rateLimit = 1000;

  /**
   * 每日限额
   */
  @Column(name = "daily_limit")
  private Integer dailyLimit;

  /**
   * IP白名单（JSON格式）
   */
  @Column(name = "ip_whitelist", columnDefinition = "TEXT")
  private String ipWhitelist;

  /**
   * 使用次数统计
   */
  @Column(name = "usage_count")
  private Long usageCount = 0L;

  /**
   * 最后使用时间
   */
  @Column(name = "last_used_at")
  private LocalDateTime lastUsedAt;

  /**
   * 过期时间
   */
  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  /**
   * 撤销时间
   */
  @Column(name = "revoked_at")
  private LocalDateTime revokedAt;

  /**
   * 撤销原因
   */
  @Column(name = "revoke_reason", length = 500)
  private String revokeReason;

  /**
   * 刷新时间
   */
  @Column(name = "refreshed_at")
  private LocalDateTime refreshedAt;

  /**
   * 是否已过期
   */
  public boolean isExpired() {
    if (expiresAt == null) {
      return false;
    }
    return LocalDateTime.now().isAfter(expiresAt);
  }

  /**
   * 是否激活
   */
  public boolean isActive() {
    return status == ApiKeyStatus.ACTIVE && !isExpired();
  }

  @Override
  public Long identity() {
    return this.id;
  }
}
