package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class ApiEndpointAssembler {

  public static ApiEndpoint toCreateDomain(Long collectionId, ApiEndpointCreateDto dto) {
    ApiEndpoint endpoint = new ApiEndpoint();
    endpoint.setCollectionId(collectionId);
    endpoint.setName(dto.getName());
    endpoint.setMethod(dto.getMethod());
    endpoint.setPath(dto.getPath());
    endpoint.setDescription(dto.getDescription());
    endpoint.setOperationId(dto.getOperationId());
    endpoint.setTags(dto.getTags());
    endpoint.setEnabled(true);
    endpoint.setDeprecated(false);
    endpoint.setParameters(dto.getParameters());
    endpoint.setRequestBody(dto.getRequestBody());
    endpoint.setResponses(dto.getResponses());
    return endpoint;
  }

  public static ApiEndpoint toUpdateDomain(Long id, ApiEndpointUpdateDto dto) {
    ApiEndpoint endpoint = new ApiEndpoint();
    endpoint.setId(id);
    endpoint.setName(dto.getName());
    endpoint.setDescription(dto.getDescription());
    endpoint.setTags(dto.getTags());
    endpoint.setParameters(dto.getParameters());
    endpoint.setRequestBody(dto.getRequestBody());
    endpoint.setResponses(dto.getResponses());
    return endpoint;
  }

  public static ApiEndpointDetailVo toDetailVo(ApiEndpoint endpoint) {
    ApiEndpointDetailVo vo = new ApiEndpointDetailVo();
    vo.setId(endpoint.getId());
    vo.setCollectionId(endpoint.getCollectionId());
    vo.setName(endpoint.getName());
    vo.setMethod(endpoint.getMethod());
    vo.setPath(endpoint.getPath());
    vo.setOperationId(endpoint.getOperationId());
    vo.setDescription(endpoint.getDescription());
    vo.setEnabled(endpoint.getEnabled());
    vo.setDeprecated(endpoint.getDeprecated());
    vo.setTags(endpoint.getTags());

    // 设置端点参数、请求体和响应
    vo.setParameters(endpoint.getParameters());
    vo.setRequestBody(endpoint.getRequestBody());
    vo.setResponses(endpoint.getResponses());

    // 设置审计信息
    vo.setTenantId(endpoint.getTenantId());
    vo.setCreatedBy(endpoint.getCreatedBy());
    vo.setCreatedDate(endpoint.getCreatedDate());
    vo.setModifiedBy(endpoint.getModifiedBy());
    vo.setModifiedDate(endpoint.getModifiedDate());
    return vo;
  }

  public static ApiEndpointVo toVo(ApiEndpoint endpoint) {
    ApiEndpointVo vo = new ApiEndpointVo();
    vo.setId(endpoint.getId());
    vo.setCollectionId(endpoint.getCollectionId());
    vo.setName(endpoint.getName());
    vo.setMethod(endpoint.getMethod());
    vo.setPath(endpoint.getPath());
    vo.setOperationId(endpoint.getOperationId());
    vo.setDescription(endpoint.getDescription());
    vo.setEnabled(endpoint.getEnabled());
    vo.setDeprecated(endpoint.getDeprecated());
    vo.setTags(endpoint.getTags());

    // 设置审计信息
    vo.setTenantId(endpoint.getTenantId());
    vo.setCreatedBy(endpoint.getCreatedBy());
    vo.setCreatedDate(endpoint.getCreatedDate());
    vo.setModifiedBy(endpoint.getModifiedBy());
    vo.setModifiedDate(endpoint.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<ApiEndpoint> getSpecification(
      ApiEndpointFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "lastUsedAt")
        .matchSearchFields("name", "path", "description", "operationId")
        .inAndNotFields("method", "category", "enabled")
        .orderByFields("id", "name", "method", "createdDate")
        .build();
    return new GenericSpecification<>(filters);
  }
}

