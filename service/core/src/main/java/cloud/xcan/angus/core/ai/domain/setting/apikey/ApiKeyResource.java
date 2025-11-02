package cloud.xcan.angus.core.ai.domain.setting.apikey;

import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * API密钥授权资源实体
 */
@Entity
@Table(name = "api_key_resource")
@Setter
@Getter
@Accessors(chain = true)
public class ApiKeyResource extends TenantEntity<ApiKeyResource, Long> {

  @Id
  private Long id;

  /**
   * API密钥ID
   */
  @Column(name = "api_key_id", nullable = false)
  private Long apiKeyId;

  /**
   * 资源类型
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "resource_type", nullable = false)
  private ResourceType resourceType;

  /**
   * 资源ID（0表示全部）
   */
  @Column(name = "resource_id", nullable = false)
  private Long resourceId = 0L;

  /**
   * 资源名称（冗余字段，便于查询）
   */
  @Column(name = "resource_name", length = 200)
  private String resourceName;

  @Override
  public Long identity() {
    return id;
  }
}
