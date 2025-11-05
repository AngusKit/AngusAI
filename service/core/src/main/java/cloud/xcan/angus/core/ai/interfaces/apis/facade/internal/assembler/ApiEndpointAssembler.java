package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;

public class ApiEndpointAssembler {

  public static ApiEndpoint toCreateDomain(Long collectionId, ApiEndpointCreateDto dto) {
    ApiEndpoint endpoint = new ApiEndpoint();
    endpoint.setCollectionId(collectionId);
    endpoint.setName(dto.getName());
    endpoint.setMethod(dto.getMethod());
    endpoint.setPath(dto.getPath());
    endpoint.setDescription(dto.getDescription());
    endpoint.setCategory(dto.getCategory());
    endpoint.setTags(dto.getTags());
    endpoint.setEnabled(dto.getEnabled() != null ? dto.getEnabled() : true);
    endpoint.setRequestConfig(dto.getRequestConfig());
    endpoint.setResponseConfig(dto.getResponseConfig());
    return endpoint;
  }

  public static ApiEndpoint toUpdateDomain(Long id, ApiEndpointUpdateDto dto) {
    ApiEndpoint endpoint = new ApiEndpoint();
    endpoint.setId(id);
    endpoint.setName(dto.getName());
    endpoint.setMethod(dto.getMethod());
    endpoint.setPath(dto.getPath());
    endpoint.setDescription(dto.getDescription());
    endpoint.setCategory(dto.getCategory());
    endpoint.setTags(dto.getTags());
    endpoint.setEnabled(dto.getEnabled());
    endpoint.setRequestConfig(dto.getRequestConfig());
    endpoint.setResponseConfig(dto.getResponseConfig());
    return endpoint;
  }

  public static ApiEndpointVo toVo(ApiEndpoint endpoint) {
    return ApiCollectionAssembler.toEndpointVo(endpoint);
  }
}

