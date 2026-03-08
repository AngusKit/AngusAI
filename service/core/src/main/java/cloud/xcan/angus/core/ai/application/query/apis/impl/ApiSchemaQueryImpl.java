package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiComponentQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiSchemaQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentType;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchemaRepo;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import io.swagger.v3.oas.models.security.SecurityScheme;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

@Service
public class ApiSchemaQueryImpl implements ApiSchemaQuery {

  @Resource
  private ApiSchemaRepo apiSchemaRepo;

  @Resource
  private ApiComponentQuery apiComponentQuery;

  @Override
  public ApiSchema findByCollectionId(Long collectionId) {
    return apiSchemaRepo.findByCollectionId(collectionId).orElse(null);
  }

  @Override
  public ApiSchema findAndCheckByCollectionId(Long collectionId) {
    return apiSchemaRepo.findByCollectionId(collectionId).orElseThrow(
        () -> ResourceNotFound.of("API Schema not found for collectionId:「{0}」",
            new Object[]{collectionId}));
  }

  @Override
  public @NotNull Map<String, SecurityScheme> getSecuritySchemeMap(Long collectionId) {
    List<ApiComponent> components = apiComponentQuery.findByCollectionIdAndType(
        collectionId, ApiComponentType.securitySchemes);
    Map<String, SecurityScheme> securities = new HashMap<>();
    for (ApiComponent component : components) {
      SecurityScheme securityScheme = component.toComponent(SecurityScheme.class);
      securities.put(component.getKey(), securityScheme);
    }
    return securities;
  }


}
