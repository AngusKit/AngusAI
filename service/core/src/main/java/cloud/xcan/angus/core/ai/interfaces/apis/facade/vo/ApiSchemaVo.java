package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.SpecVersion;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApiSchemaVo {

  private Long id;

  private Long collectionId;

  private String openapi;

  private Info info;

  private ExternalDocumentation externalDocs;

  private List<Server> servers;

  private List<SecurityRequirement> securityRequirements;

  private List<Tag> tags;

  private Map<String, Object> extensions;

  private SpecVersion specVersion;

  private Map<String, SecurityScheme> securities;

}
