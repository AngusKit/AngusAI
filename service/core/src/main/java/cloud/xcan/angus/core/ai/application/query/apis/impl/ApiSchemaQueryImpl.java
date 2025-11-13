package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiSchemaQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchemaRepo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class ApiSchemaQueryImpl implements ApiSchemaQuery {

  @Resource
  private ApiSchemaRepo apiSchemaRepo;

  @Override
  public ApiSchema findByCollectionId(Long collectionId) {
    return apiSchemaRepo.findByCollectionId(collectionId);
  }

}
