package cloud.xcan.angus.core.ai.application.cmd.apis.impl;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiSchemaCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiSchemaConverter;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchemaRepo;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.OpenAPI;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class ApiSchemaCmdImpl extends CommCmd<ApiSchema, Long> implements ApiSchemaCmd {

  @Resource
  private ApiSchemaRepo apiSchemaRepo;

  @Override
  public void updateSchema(ApiSchema apiSchema, OpenAPI openApi, boolean mergeSchema,
      boolean cover) {
    ApiSchemaConverter.updateSchema(apiSchema, openApi, mergeSchema, cover);
    apiSchemaRepo.save(apiSchema);
  }

  @Override
  protected BaseRepository<ApiSchema, Long> getRepository() {
    return apiSchemaRepo;
  }
}
