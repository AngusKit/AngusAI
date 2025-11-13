package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import java.util.Map;

public interface ApiSchemaCmd {

  ApiSchema updateServers(Long collectionId, List<Server> servers);

  ApiSchema updateSecurities(Long collectionId, Map<String, SecurityScheme> securities);

  void init(ApiCollection collection);

  void updateImportSchema(ApiSchema apiSchema, OpenAPI openApi, boolean mergeSchema,
      boolean cover);

}
