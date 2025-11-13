package cloud.xcan.angus.core.ai.application.cmd.apis.impl;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiComponentCmd;
import cloud.xcan.angus.core.ai.application.cmd.apis.ApiSchemaCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiSchemaConverter;
import cloud.xcan.angus.core.ai.application.query.apis.ApiSchemaQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchemaRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ApiSchemaCmdImpl extends CommCmd<ApiSchema, Long> implements ApiSchemaCmd {

  @Resource
  private ApiSchemaRepo apiSchemaRepo;

  @Resource
  private ApiSchemaQuery apiSchemaQuery;

  @Resource
  private ApiComponentCmd apiComponentCmd;

  @Transactional
  @Override
  public ApiSchema updateServers(Long collectionId, List<Server> servers) {
    return new BizTemplate<ApiSchema>() {
      ApiSchema apiSchema;

      @Override
      protected void checkParams() {
        apiSchema = apiSchemaQuery.findAndCheckByCollectionId(collectionId);
      }

      @Override
      protected ApiSchema process() {
        apiSchema.setServers(servers);
        apiSchemaRepo.save(apiSchema);
        return apiSchema;
      }
    }.execute();
  }

  @Transactional
  @Override
  public ApiSchema updateSecurities(Long collectionId, Map<String, SecurityScheme> securities) {
    return new BizTemplate<ApiSchema>() {
      ApiSchema apiSchema;

      @Override
      protected void checkParams() {
        apiSchema = apiSchemaQuery.findAndCheckByCollectionId(collectionId);
      }

      @Override
      protected ApiSchema process() {
        apiComponentCmd.replaceSecuritiesComponent(collectionId, securities);
        apiSchema.setSecurities(securities);
        return apiSchema;
      }
    }.execute();
  }

  @Override
  public void init(Long collectionId) {
    ApiSchema apiSchema = new ApiSchema();
    apiSchema.setCollectionId(collectionId);
    insert(apiSchema);
  }

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
