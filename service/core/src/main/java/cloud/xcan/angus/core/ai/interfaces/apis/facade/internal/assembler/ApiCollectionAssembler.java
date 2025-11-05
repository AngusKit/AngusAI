package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ApiCollectionAssembler {

  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

  /**
   * 获取来源标签和图标
   */
  private static Map<String, String> getSourceInfo(ApiCollectionSource source) {
    Map<String, String> info = new HashMap<>();
    if (source == null) {
      info.put("label", "");
      info.put("icon", "");
      return info;
    }
    
    switch (source) {
      case OPENAPI:
        info.put("label", "OpenAPI 3.0");
        info.put("icon", "📄");
        break;
      case SWAGGER:
        info.put("label", "Swagger 2.0");
        info.put("icon", "🔷");
        break;
      case POSTMAN:
        info.put("label", "Postman Collection");
        info.put("icon", "📮");
        break;
      case MANUAL:
        info.put("label", "手动创建");
        info.put("icon", "✏️");
        break;
      default:
        info.put("label", source.getDisplayName());
        info.put("icon", "📋");
    }
    return info;
  }

  /**
   * 获取可见性标签
   */
  private static String getVisibilityLabel(Visibility visibility) {
    if (visibility == null) {
      return "";
    }
    switch (visibility) {
      case PRIVATE:
        return "私有";
      case TEAM:
        return "团队";
      case PUBLIC:
        return "公开";
      default:
        return visibility.name();
    }
  }

  /**
   * 格式化日期
   */
  private static String formatDate(Long timestamp) {
    if (timestamp == null) {
      return null;
    }
    LocalDateTime dateTime = LocalDateTime.ofEpochSecond(timestamp / 1000, 0,
        ZoneId.systemDefault().getRules().getOffset(LocalDateTime.now()));
    return dateTime.format(DATE_FORMATTER);
  }

  public static ApiCollection toCreateDomain(ApiCollectionCreateDto dto) {
    ApiCollection collection = new ApiCollection();
    collection.setName(dto.getName());
    collection.setDescription(dto.getDescription());
    collection.setVisibility(dto.getVisibility() != null ? dto.getVisibility() : Visibility.PRIVATE);
    
    // 设置服务器配置
    if (dto.getServerConfig() != null) {
      Map<String, Object> serverConfig = new HashMap<>();
      serverConfig.put("url", dto.getServerConfig().getUrl());
      serverConfig.put("description", dto.getServerConfig().getDescription());
      collection.setServerConfig(serverConfig);
    }
    
    // 设置安全配置
    if (dto.getSecurityConfig() != null) {
      collection.setSecurityConfig(dto.getSecurityConfig());
    }
    
    return collection;
  }

  public static ApiCollection toUpdateDomain(Long id, ApiCollectionUpdateDto dto) {
    ApiCollection collection = new ApiCollection();
    collection.setId(id);
    collection.setName(dto.getName());
    collection.setDescription(dto.getDescription());
    collection.setVisibility(dto.getVisibility());
    
    // 设置服务器配置
    if (dto.getServerConfig() != null) {
      Map<String, Object> serverConfig = new HashMap<>();
      serverConfig.put("url", dto.getServerConfig().getUrl());
      serverConfig.put("description", dto.getServerConfig().getDescription());
      collection.setServerConfig(serverConfig);
    }
    
    // 设置安全配置
    if (dto.getSecurityConfig() != null) {
      collection.setSecurityConfig(dto.getSecurityConfig());
    }
    
    return collection;
  }

  public static ApiCollectionVo toVo(ApiCollection collection) {
    if (collection == null) {
      return null;
    }
    ApiCollectionVo vo = new ApiCollectionVo();
    vo.setId(collection.getId());
    vo.setName(collection.getName());
    vo.setDescription(collection.getDescription());
    vo.setSource(collection.getSource());
    
    Map<String, String> sourceInfo = getSourceInfo(collection.getSource());
    vo.setSourceLabel(sourceInfo.get("label"));
    vo.setSourceIcon(sourceInfo.get("icon"));
    
    vo.setVisibility(collection.getVisibility());
    vo.setVisibilityLabel(getVisibilityLabel(collection.getVisibility()));
    
    vo.setEndpointsCount(collection.getEndpointsCount());
    vo.setEnabledCount(collection.getEnabledCount());
    vo.setServerConfig(collection.getServerConfig());
    vo.setSecurityConfig(collection.getSecurityConfig());
    vo.setHasServerConfig(collection.getServerConfig() != null && !collection.getServerConfig().isEmpty());
    vo.setHasSecurityConfig(collection.getSecurityConfig() != null && !collection.getSecurityConfig().isEmpty());
    
    if (collection.getCreatedDate() != null) {
      Long timestamp = collection.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setCreatedAt(timestamp);
      vo.setCreatedDate(formatDate(timestamp));
    }
    
    if (collection.getModifiedDate() != null) {
      Long timestamp = collection.getModifiedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setUpdatedAt(timestamp);
      vo.setUpdatedDate(formatDate(timestamp));
    }
    
    if (collection.getLastUsedAt() != null) {
      vo.setLastUsedAt(collection.getLastUsedAt());
    }
    
    vo.setOwnerId(collection.getCreatedBy());
    
    return vo;
  }

  public static ApiCollectionListVo toListVo(ApiCollection collection) {
    if (collection == null) {
      return null;
    }
    ApiCollectionListVo vo = new ApiCollectionListVo();
    vo.setId(collection.getId());
    vo.setName(collection.getName());
    vo.setDescription(collection.getDescription());
    vo.setSource(collection.getSource());
    
    Map<String, String> sourceInfo = getSourceInfo(collection.getSource());
    vo.setSourceLabel(sourceInfo.get("label"));
    vo.setSourceIcon(sourceInfo.get("icon"));
    
    vo.setEndpointsCount(collection.getEndpointsCount());
    vo.setEnabledCount(collection.getEnabledCount());
    vo.setVisibility(collection.getVisibility());
    vo.setVisibilityLabel(getVisibilityLabel(collection.getVisibility()));
    
    if (collection.getCreatedDate() != null) {
      Long timestamp = collection.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setCreatedAt(timestamp);
      vo.setCreatedDate(formatDate(timestamp));
    }
    
    if (collection.getModifiedDate() != null) {
      Long timestamp = collection.getModifiedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setUpdatedAt(timestamp);
      vo.setUpdatedDate(formatDate(timestamp));
    }
    
    if (collection.getLastUsedAt() != null) {
      vo.setLastUsedAt(collection.getLastUsedAt());
    }
    
    vo.setHasServerConfig(collection.getServerConfig() != null && !collection.getServerConfig().isEmpty());
    vo.setHasSecurityConfig(collection.getSecurityConfig() != null && !collection.getSecurityConfig().isEmpty());
    vo.setOwnerId(collection.getCreatedBy());
    
    return vo;
  }

  public static ApiEndpointVo toEndpointVo(ApiEndpoint endpoint) {
    if (endpoint == null) {
      return null;
    }
    ApiEndpointVo vo = new ApiEndpointVo();
    vo.setId(endpoint.getId());
    vo.setCollectionId(endpoint.getCollectionId());
    vo.setName(endpoint.getName());
    vo.setMethod(endpoint.getMethod());
    vo.setPath(endpoint.getPath());
    vo.setDescription(endpoint.getDescription());
    vo.setCategory(endpoint.getCategory());
    vo.setTags(endpoint.getTags());
    vo.setEnabled(endpoint.getEnabled());
    vo.setRequestConfig(endpoint.getRequestConfig());
    vo.setResponseConfig(endpoint.getResponseConfig());
    vo.setLastUsedAt(endpoint.getLastUsedAt());
    vo.setUsageCount(endpoint.getUsageCount());
    
    if (endpoint.getLastUsedAt() != null) {
      vo.setLastUsedDate(formatDate(endpoint.getLastUsedAt()));
    }
    
    return vo;
  }

  public static List<ApiEndpointVo> toEndpointVoList(List<ApiEndpoint> endpoints) {
    if (endpoints == null) {
      return null;
    }
    return endpoints.stream()
        .map(ApiCollectionAssembler::toEndpointVo)
        .collect(Collectors.toList());
  }

  public static GenericSpecification<ApiCollection> getSpecification(ApiCollectionFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .matchSearchFields("name", "description")
        .inAndNotFields("source", "visibility")
        .orderByFields("id", "name", "createdDate", "modifiedDate")
        .build();
    return new GenericSpecification<>(filters);
  }

  public static GenericSpecification<ApiEndpoint> getEndpointSpecification(
      cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "lastUsedAt")
        .matchSearchFields("name", "path")
        .inAndNotFields("method", "category", "enabled")
        .orderByFields("id", "name", "method", "lastUsedAt")
        .build();
    return new GenericSpecification<>(filters);
  }
}

