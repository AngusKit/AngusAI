package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class ApiCollectionAssembler {

  public static ApiCollection toCreateDomain(ApiCollectionCreateDto dto) {
    ApiCollection collection = new ApiCollection();
    collection.setName(dto.getName());
    collection.setDescription(dto.getDescription());
    collection.setSource(ApiCollectionSource.MANUAL);
    collection.setVisibility(nullSafe(dto.getVisibility(), Visibility.PRIVATE));
    collection.setServer(dto.getServer());
    collection.setSecurity(dto.getSecurity());
    return collection;
  }

  public static ApiCollection toUpdateDomain(Long id, ApiCollectionUpdateDto dto) {
    ApiCollection collection = new ApiCollection();
    collection.setId(id);
    collection.setName(dto.getName());
    collection.setDescription(dto.getDescription());
    collection.setVisibility(dto.getVisibility());
    collection.setServer(dto.getServer());
    collection.setSecurity(dto.getSecurity());
    return collection;
  }

  public static ApiCollectionDetailVo toVo(ApiCollection collection) {
    ApiCollectionDetailVo vo = new ApiCollectionDetailVo();
    vo.setId(collection.getId());
    vo.setName(collection.getName());
    vo.setDescription(collection.getDescription());
    vo.setSource(collection.getSource());
    vo.setVisibility(collection.getVisibility());

    // 设置服务器配置
    vo.setHasServerConfig(
        collection.getServer() != null && isNotEmpty(collection.getServer().getUrl()));
    vo.setServer(collection.getServer());

    // 设置安全配置
    vo.setHasSecurityConfig(collection.getSecurity() != null);
    vo.setSecurity(collection.getSecurity());

    // 设置统计信息
    vo.setEndpointsCount(collection.getEndpointsCount());
    vo.setEnabledEndpointsCount(collection.getEnabledEndpointsCount());

    // 设置审计信息
    vo.setTenantId(collection.getTenantId());
    vo.setCreatedBy(collection.getCreatedBy());
    vo.setCreatedDate(collection.getCreatedDate());
    vo.setModifiedBy(collection.getModifiedBy());
    vo.setModifiedDate(collection.getModifiedDate());
    return vo;
  }

  public static ApiCollectionListVo toListVo(ApiCollection collection) {
    ApiCollectionListVo vo = new ApiCollectionListVo();
    vo.setId(collection.getId());
    vo.setName(collection.getName());
    vo.setDescription(collection.getDescription());
    vo.setSource(collection.getSource());
    vo.setVisibility(collection.getVisibility());
    vo.setHasServerConfig(
        collection.getServer() != null && isNotEmpty(collection.getServer().getUrl()));
    vo.setHasSecurityConfig(collection.getSecurity() != null);

    // 设置统计信息
    vo.setEndpointsCount(collection.getEndpointsCount());
    vo.setEnabledEndpointsCount(collection.getEnabledEndpointsCount());

    // 设置审计信息
    vo.setTenantId(collection.getTenantId());
    vo.setCreatedBy(collection.getCreatedBy());
    vo.setCreatedDate(collection.getCreatedDate());
    vo.setModifiedBy(collection.getModifiedBy());
    vo.setModifiedDate(collection.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<ApiCollection> getSpecification(ApiCollectionFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .matchSearchFields("name", "description")
        .inAndNotFields("source", "visibility")
        .orderByFields("id", "name", "createdDate", "source", "visibility")
        .build();
    return new GenericSpecification<>(filters);
  }

}

