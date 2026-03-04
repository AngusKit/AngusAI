package cloud.xcan.angus.core.ai.domain.apis;


import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.headers.Header;
import io.swagger.v3.oas.models.links.Link;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityScheme;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import javax.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


@Slf4j
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
@Entity
@Table(name = "ai_api_component")
@EntityListeners({AuditingEntityListener.class})
@DynamicInsert
@Setter
@Getter
@Accessors(chain = true)
public class ApiComponent extends TenantEntity<ApiComponent, Long> {

  @Id
  private Long id;

  @Column(name = "collection_id", nullable = false)
  private Long collectionId;

  @Enumerated(EnumType.STRING)
  private ApiComponentType type;

  @Column(name = "`key`")
  private String key;

  private String ref;

  private String model;

  private String description;

  @Column(name = "schema_hash")
  private int schemaHash;

  @Column(name = "modified_by")
  @LastModifiedBy
  private Long modifiedBy;

  @Column(name = "modified_date")
  @LastModifiedDate
  private LocalDateTime modifiedDate;

  // @Transient -> transient <- Json and jpa both ignore
  @JsonIgnore
  public transient Schema schema;
  @JsonIgnore
  public transient ApiResponse response;
  @JsonIgnore
  public transient Parameter parameter;
  @JsonIgnore
  public transient Example example;
  @JsonIgnore
  public transient RequestBody requestBody;
  @JsonIgnore
  public transient Header header;
  @JsonIgnore
  public transient SecurityScheme securityScheme;
  @JsonIgnore
  public transient Link link;
  //public transient Callback callback;
  @JsonIgnore
  public transient Object extension;
  //@OpenAPI31
  //public transient PathItem pathItem;
  @JsonIgnore
  private transient Map<String, String> resolvedRefModels;

  @Nullable
  public <T> T toComponent(Class<T> clz) {
    try {
      // model value `{"scheme":"noauth"}`:  throw java.lang.NullPointerException: null
      return isEmpty(model) ? null : OPENAPI_MAPPER.readValue(model, clz);
    } catch (Exception e) {
      log.error("Failed to convert model to component exception: \n model = {} \n cause = {}",
          model, e.getMessage());
      return null;
    }
  }

  @Override
  public Long identity() {
    return this.id;
  }

  /**
   * Use schemaHash() instead.
   */
  @Deprecated
  public boolean sameSchemaInfoAs(ApiComponent o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    return collectionId.equals(o.collectionId) &&
        type == o.type &&
        Objects.equals(schema, o.schema) &&
        Objects.equals(response, o.response) &&
        Objects.equals(parameter, o.parameter) &&
        Objects.equals(example, o.example) &&
        Objects.equals(requestBody, o.requestBody) &&
        Objects.equals(header, o.header) &&
        Objects.equals(securityScheme, o.securityScheme) &&
        Objects.equals(link, o.link) &&
        Objects.equals(extension, o.extension);
  }
}
