package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;

public interface ApiSchemaQuery {

  ApiSchema findByCollectionId(Long id);

}
