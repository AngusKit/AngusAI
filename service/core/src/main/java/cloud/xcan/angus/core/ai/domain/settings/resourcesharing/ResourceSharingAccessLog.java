package cloud.xcan.angus.core.ai.domain.settings.resourcesharing;

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
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 共享访问日志实体
 */
@Entity
@Table(name = "resource_sharing_access_log")
@Setter
@Getter
@Accessors(chain = true)
public class ResourceSharingAccessLog extends TenantAuditingEntity<ResourceSharingAccessLog, Long> {

  @Id
  private Long id;

  /**
   * 共享ID
   */
  @Column(name = "sharing_id", nullable = false)
  private Long sharingId;

  /**
   * 资源ID
   */
  @Column(name = "resource_id", nullable = false)
  private Long resourceId;

  /**
   * 资源类型
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "resource_type", nullable = false, length = 20)
  private ResourceType resourceType;

  /**
   * 访问用户ID
   */
  @Column(name = "user_id", nullable = false)
  private Long userId;

  /**
   * 操作类型
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "action", nullable = false, length = 20)
  private ShareAction action;

  /**
   * 元数据（JSON格式）
   */
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "metadata")
  private Map<String, Object> metadata;

  /**
   * IP地址
   */
  @Column(name = "ip_address", length = 50)
  private String ipAddress;

  /**
   * 用户代理
   */
  @Column(name = "user_agent", length = 500)
  private String userAgent;

  @Override
  public Long identity() {
    return this.id;
  }
}
