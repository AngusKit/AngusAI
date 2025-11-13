package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import io.swagger.v3.oas.models.OpenAPI;

public interface ApiSchemaCmd {

  void updateSchema(ApiSchema apiSchema, OpenAPI openApi, boolean mergeSchema,
      boolean cover);
}
