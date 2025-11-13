package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.ExternalDocConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.ParameterConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.RequestBodyConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.SecurityRequirementConverter;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

  @Column(name = "operation_id", length = 200)
  private String operationId;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  /**
   * @see Operation#getDeprecated()
   */
  private Boolean deprecated;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private List<String> tags;

  @Convert(converter = ParameterConverter.class)
  @Column(columnDefinition = "json", name = "parameters")
  private List<Parameter> parameters;

  @Convert(converter = RequestBodyConverter.class)
  @Column(columnDefinition = "json", name = "request_body")
  private RequestBody requestBody;

  @Convert(converter = ApiResponseConverter.class)
  @Column(columnDefinition = "json", name = "responses")
  private Map<String, ApiResponse> responses;

  /**
   * @see Operation#getSecurity()
   */
  @Convert(converter = SecurityRequirementConverter.class)
  @Column(name = "security")
  private List<SecurityRequirement> security;

  /**
   * @see Operation#getExternalDocs()
   */
  @Convert(converter = ExternalDocConverter.class)
  @Column(name = "external_docs")
  private ExternalDocumentation externalDocs;

  @Column(name = "schema_hash")
  private int schemaHash;

  public Long identity() {
    return this.id;
  }
}

