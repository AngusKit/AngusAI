package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 接口端点实体
 */
@Entity
@Table(name = "api_endpoint")
@Setter
@Getter
@Accessors(chain = true)
public class ApiEndpoint extends TenantAuditingEntity<ApiEndpoint, Long> {

  @Id
  private Long id;

  @Column(name = "collection_id", nullable = false)
  private Long collectionId;

  @Column(name = "name", nullable = false, length = 200)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "method", nullable = false, length = 10)
  private HttpMethod method;

  @Column(name = "path", nullable = false, length = 500)
  private String path;

  @Column(name = "description", length = 1000)
  private String description;

  @Column(name = "category", length = 100)
  private String category;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private List<String> tags;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "request_config")
  private Map<String, Object> requestConfig;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "response_config")
  private Map<String, Object> responseConfig;

  @Column(name = "last_used_at")
  private Long lastUsedAt;

  @Column(name = "usage_count")
  private Long usageCount = 0L;

  @Transient
  private String lastUsedDate;

  /**
   * HTTP方法枚举
   */
  public enum HttpMethod {
    GET, POST, PUT, DELETE, PATCH
  }

  @Override
  public Long identity() {
    return this.id;
  }
}

