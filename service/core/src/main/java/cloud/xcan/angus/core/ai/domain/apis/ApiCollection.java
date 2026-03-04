package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
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

/**
 * 接口集实体
 */
@Entity
@Table(name = "ai_api_collection")
@Setter
@Getter
@Accessors(chain = true)
public class ApiCollection extends TenantAuditingEntity<ApiCollection, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "source", nullable = false)
  private ApiCollectionSource source;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility;

  @Transient
  private List<Server> servers;
  @Transient
  private Map<String, SecurityScheme> securities;
  @Transient
  private Long endpointsCount = 0L;
  @Transient
  private Long enabledEndpointsCount = 0L;

  @Override
  public Long identity() {
    return this.id;
  }
}

