package cloud.xcan.angus.core.ai.domain.apis;


import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.domain.apis.converter.ExtensionsConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.ExternalDocConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.InfoConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.SecurityRequirementConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.ServersConverter;
import cloud.xcan.angus.core.ai.domain.apis.converter.TagsConverter;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityResource;
import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.SpecVersion;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
@Entity
@Table(name = "ai_api_schema")
@EntityListeners({AuditingEntityListener.class})
@DynamicInsert
@Setter
@Getter
@Accessors(chain = true)
public class ApiSchema extends TenantEntity<ApiSchema, Long> implements ActivityResource {

  @Id
  private Long id;

  @Column(name = "collection_id", nullable = false)
  private Long collectionId;

  private String openapi;

  @Convert(converter = InfoConverter.class)
  private Info info;

  @Convert(converter = ExternalDocConverter.class)
  private ExternalDocumentation externalDocs;

  @Convert(converter = ServersConverter.class)
  private List<Server> servers = new ArrayList<>();

  @Convert(converter = SecurityRequirementConverter.class)
  private List<SecurityRequirement> security = new ArrayList<>();

  @Convert(converter = TagsConverter.class)
  private List<Tag> tags = new ArrayList<>();

  @Convert(converter = ExtensionsConverter.class)
  private Map<String, Object> extensions = new HashMap<>();

  @Enumerated(EnumType.STRING)
  private SpecVersion specVersion;

  @Column(name = "modified_by")
  @LastModifiedBy
  private Long modifiedBy;

  @Column(name = "modified_date")
  @LastModifiedDate
  private LocalDateTime modifiedDate;

  @Transient
  private Map<String, SecurityScheme> securities;

  @Override
  public Long identity() {
    return this.id;
  }

  @JsonIgnore
  @Override
  public String getName() {
    return nonNull(info) ? info.getTitle() : "OpenAPI";
  }

}
