package cloud.xcan.angus.core.ai.application.query.apis.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.converter.ApiEndpointConverter;
import cloud.xcan.angus.core.ai.application.converter.ApiSchemaConverter;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiComponentQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiSchemaQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSearchRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ExportApiFormat;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import io.swagger.v3.core.util.Json31;
import io.swagger.v3.core.util.Yaml31;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 接口集查询服务实现
 */
@Service
public class ApiCollectionQueryImpl implements ApiCollectionQuery {

  @Resource
  private ApiCollectionRepo apiCollectionRepo;

  @Resource
  private ApiCollectionSearchRepo apiCollectionSearchRepo;

  @Resource
  private ApiSchemaQuery apiSchemaQuery;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @Resource
  private ApiComponentQuery apiComponentQuery;

  @Override
  public ApiCollection findAndCheck(Long id) {
    return new BizTemplate<ApiCollection>() {
      @Override
      protected ApiCollection process() {
        return apiCollectionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("接口集未找到", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<ApiCollection> find(GenericSpecification<ApiCollection> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<ApiCollection>>() {
      @Override
      protected Page<ApiCollection> process() {
        return fullTextSearch
            ? apiCollectionSearchRepo.find(spec.getCriteria(), pageable, ApiCollection.class, match)
            : apiCollectionRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Long countTotalCollections() {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return apiCollectionRepo.count();
      }
    }.execute();
  }

  @Override
  public String openapiDetail(Long id, ExportApiFormat format, Boolean includeDisabled) {
    OpenAPI openApi = new OpenAPI();

    // Merge apis and project component servers
    ApiSchema schemaDb = apiSchemaQuery.findByCollectionId(id);
    List<ApiEndpoint> apis = includeDisabled
        ? apiEndpointQuery.findByCollectionId(id)
        : apiEndpointQuery.findByCollectionIdAndEnabled(id, true);

    // Assemble OpenAPI common schema
    openApi.openapi(schemaDb.getOpenapi())
        .info(schemaDb.getInfo())
        .externalDocs(schemaDb.getExternalDocs())
        .servers(schemaDb.getServers())
        .security(schemaDb.getSecurity())
        // .tags(schemaDb.getTags())
        .extensions(schemaDb.getExtensions())
        .specVersion(schemaDb.getSpecVersion());

    // Assemble OpenAPI Paths schema
    if (isNotEmpty(apis)) {
      Paths paths = ApiEndpointConverter.toPaths(apis.stream()
          .collect(Collectors.groupingBy(ApiEndpoint::getPath)));
      openApi.paths(paths);
    }

    // Assemble OpenAPI tags
    openApi.setTags(schemaDb.getTags());

    // Assemble OpenAPI components schema
    List<ApiComponent> compsDb = apiComponentQuery.findByCollectionId(id);
    if (isNotEmpty(compsDb)) {
      Components components = ApiSchemaConverter.toOpenApiComp(
          compsDb.stream().collect(Collectors.groupingBy(ApiComponent::getType)));
      openApi.components(components);
    }

    // Format output
    return ExportApiFormat.json.equals(format)
        ? Json31.pretty(openApi) : Yaml31.pretty(openApi);
  }
}

