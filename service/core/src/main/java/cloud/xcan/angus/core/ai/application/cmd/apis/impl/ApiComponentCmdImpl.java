package cloud.xcan.angus.core.ai.application.cmd.apis.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiComponentCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiSchemaConverter;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentType;
import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import jakarta.annotation.Resource;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ApiComponentCmdImpl extends CommCmd<ApiComponent, Long> implements ApiComponentCmd {

  @Resource
  private ApiComponentRepo apiComponentRepo;

  @Override
  public void replaceByOpenApi(Long collectionId, Components components,
      ConflictStrategy conflictStrategy) {
    // Convert OpenAPI components to service components
    Map<String, ApiComponent> openApiCompsMap = ApiSchemaConverter.toCollectionComp(
        collectionId, components);

    // Get existing components from database
    Map<String, ApiComponent> compsDbMap = apiComponentRepo.findByCollectionId(collectionId)
        .stream().collect(Collectors.toMap(ApiComponent::getRef, x -> x));

    // Process new components
    if (isNotEmpty(openApiCompsMap)) {
      // Find and insert new components
      Collection<ApiComponent> newComps = openApiCompsMap.keySet().stream()
          .filter(x -> !compsDbMap.containsKey(x))
          .collect(Collectors.toMap(x -> x, openApiCompsMap::get)).values();
      if (isNotEmpty(newComps)) {
        batchInsert0(newComps);
      }

      // Handle component updates based on strategy
      if (ConflictStrategy.OVERWRITE.equals(conflictStrategy)) {
        Map<String, ApiComponent> updatedCompsDbMap = compsDbMap.keySet().stream()
            .filter(x -> openApiCompsMap.containsKey(x)
                && compsDbMap.get(x).getSchemaHash() != openApiCompsMap.get(x).getSchemaHash())
            .collect(Collectors.toMap(x -> x, compsDbMap::get));
        if (isNotEmpty(updatedCompsDbMap)) {
          for (String uniqueKey : updatedCompsDbMap.keySet()) {
            ApiSchemaConverter.openApiToUpdateComp(updatedCompsDbMap.get(uniqueKey),
                openApiCompsMap.get(uniqueKey));
          }
          batchUpdate0(updatedCompsDbMap.values());
        }
      }

      // Handle component deletion if requested
      if (conflictStrategy.isOverwrite()) {
        Collection<ApiComponent> deletedCompsInDb = compsDbMap.keySet().stream()
            .filter(x -> !openApiCompsMap.containsKey(x))
            .collect(Collectors.toMap(x -> x, compsDbMap::get)).values();
        if (isNotEmpty(deletedCompsInDb)) {
          deleteByCollectionIdAndRefIn(collectionId,
              deletedCompsInDb.stream().map(ApiComponent::getRef).collect(Collectors.toSet()));
        }
      }
    } else {
      // If no components in OpenAPI spec, optionally delete all existing components
      if (conflictStrategy.isOverwrite()) {
        deleteByCollectionIdAndRefIn(collectionId, null);
      }
    }
  }

  @Override
  public void replaceSecuritiesComponent(Long collectionId, Map<String, SecurityScheme> securities) {
    apiComponentRepo.deleteByCollectionIdAndType(collectionId, ApiComponentType.securitySchemes);
    // Convert OpenAPI components to service components
    List<ApiComponent> openApiComps = ApiSchemaConverter.toCollectionSecurityComp(
        collectionId, securities);
    batchInsert0(openApiComps);
  }

  @Override
  public void deleteByCollectionIdAndRefIn(Long collectionId, Collection<String> refs) {
    if (isNotEmpty(refs)) {
      apiComponentRepo.deleteByCollectionIdAndRefIn(collectionId, refs);
    } else {
      apiComponentRepo.deleteByCollectionId(collectionId);
    }
  }

  @Override
  protected BaseRepository<ApiComponent, Long> getRepository() {
    return apiComponentRepo;
  }
}
