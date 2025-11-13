package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.Map;
import org.jetbrains.annotations.NotNull;

public interface ApiSchemaQuery {

  ApiSchema findByCollectionId(Long id);

  ApiSchema findAndCheckByCollectionId(Long collectionId);

  @NotNull
  Map<String, SecurityScheme> getSecuritySchemeMap(Long collectionId);
}
