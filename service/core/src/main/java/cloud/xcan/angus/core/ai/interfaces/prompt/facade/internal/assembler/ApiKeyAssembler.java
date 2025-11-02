package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyListVo;
import cloud.xcan.angus.spec.annotations.Nullable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * API密钥转换器
 */
public class ApiKeyAssembler {

  public static ApiKey toDomain(ApiKeyCreateDto dto) {
    ApiKey apiKey = new ApiKey();
    apiKey.setName(dto.getName());
    apiKey.setPermissions(dto.getPermissions());
    apiKey.setAuthorizedResources(dto.getAuthorizedResources());
    apiKey.setIpWhitelist(dto.getIpWhitelist() != null
        ? String.join(",", dto.getIpWhitelist()) : null);
    apiKey.setRateLimit(dto.getRateLimit());
    apiKey.setDailyLimit(dto.getDailyLimit());

    // 设置过期时间
    apiKey.setExpiresAt(dto.getNeverExpires() ? null
        : LocalDateTime.now().plusDays(dto.getExpiresIn() != null ? dto.getExpiresIn() : 0));

    // 设置默认值
    apiKey.setUsageCount(0L);
    return apiKey;
  }

  public static ApiKeyDetailVo toDetailVo(ApiKey apiKey, List<ApiKeyResource> resources) {
    ApiKeyDetailVo vo = new ApiKeyDetailVo();
    vo.setId(apiKey.getId());
    vo.setName(apiKey.getName());
    vo.setKeyPrefix(apiKey.getKeyPrefix());
    vo.setStatus(apiKey.getStatus());
    vo.setPermissions(apiKey.getPermissions());
    vo.setRateLimit(apiKey.getRateLimit());
    vo.setDailyLimit(apiKey.getDailyLimit());

    // IP白名单
    if (apiKey.getIpWhitelist() != null && !apiKey.getIpWhitelist().isEmpty()) {
      vo.setIpWhitelist(Arrays.asList(apiKey.getIpWhitelist().split(",")));
    } else {
      vo.setIpWhitelist(new ArrayList<>());
    }

    // 授权资源
    if (resources != null) {
      Map<ResourceType, List<ApiKeyResource>> groupedResources = resources.stream()
          .collect(Collectors.groupingBy(ApiKeyResource::getResourceType));

      List<ApiKeyDetailVo.AuthorizedResourceVo> resourceVos = groupedResources.entrySet().stream()
          .map(entry -> {
            ApiKeyDetailVo.AuthorizedResourceVo resourceVo = new ApiKeyDetailVo.AuthorizedResourceVo();
            resourceVo.setType(entry.getKey());

            List<Long> ids = entry.getValue().stream()
                .map(ApiKeyResource::getResourceId)
                .filter(id -> id != 0L)
                .collect(Collectors.toList());

            resourceVo.setIds(ids.isEmpty() ? new ArrayList<>() : ids);
            return resourceVo;
          })
          .collect(Collectors.toList());
      vo.setAuthorizedResources(resourceVos);
    } else {
      vo.setAuthorizedResources(new ArrayList<>());
    }

    // 使用统计
    ApiKeyDetailVo.UsageStatsVo usageStats = new ApiKeyDetailVo.UsageStatsVo();
    // TODO 计算并设置统计值
    vo.setUsageStats(usageStats);

    // 时间信息
    vo.setLastUsedAt(apiKey.getLastUsedAt());
    vo.setExpiresAt(apiKey.getExpiresAt());
    vo.setRevokedAt(apiKey.getRevokedAt());

    // 设置审计信息
    vo.setTenantId(apiKey.getTenantId());
    vo.setCreatedBy(apiKey.getCreatedBy());
    vo.setCreatedDate(apiKey.getCreatedDate());
    vo.setModifiedBy(apiKey.getModifiedBy());
    vo.setModifiedDate(apiKey.getModifiedDate());
    return vo;
  }

  public static ApiKeyListVo toListVo(ApiKey apiKey, @Nullable List<ApiKeyResource> resources) {
    ApiKeyListVo vo = new ApiKeyListVo();
    vo.setId(apiKey.getId());
    vo.setName(apiKey.getName());
    vo.setKeyPrefix(apiKey.getKeyPrefix());
    vo.setStatus(apiKey.getStatus());
    vo.setPermissions(apiKey.getPermissions());
    vo.setRateLimit(apiKey.getRateLimit());
    vo.setDailyLimit(apiKey.getDailyLimit());
    vo.setUsageCount(apiKey.getUsageCount() != null ? apiKey.getUsageCount() : 0L);

    // 授权资源
    if (resources != null) {
      Map<ResourceType, List<ApiKeyResource>> groupedResources = resources.stream()
          .collect(Collectors.groupingBy(ApiKeyResource::getResourceType));

      List<ApiKeyDetailVo.AuthorizedResourceVo> resourceVos = groupedResources.entrySet().stream()
          .map(entry -> {
            ApiKeyDetailVo.AuthorizedResourceVo resourceVo = new ApiKeyDetailVo.AuthorizedResourceVo();
            resourceVo.setType(entry.getKey());

            List<Long> ids = entry.getValue().stream()
                .map(ApiKeyResource::getResourceId)
                .filter(id -> id != 0L)
                .collect(Collectors.toList());

            resourceVo.setIds(ids.isEmpty() ? new ArrayList<>() : ids);
            return resourceVo;
          })
          .collect(Collectors.toList());

      vo.setAuthorizedResources(resourceVos);
    } else {
      vo.setAuthorizedResources(new ArrayList<>());
    }

    // 时间信息
    vo.setLastUsedAt(apiKey.getLastUsedAt());
    vo.setExpiresAt(apiKey.getExpiresAt());
    vo.setRevokedAt(apiKey.getRevokedAt());

    // 设置审计信息
    vo.setTenantId(apiKey.getTenantId());
    vo.setCreatedBy(apiKey.getCreatedBy());
    vo.setCreatedDate(apiKey.getCreatedDate());
    vo.setModifiedBy(apiKey.getModifiedBy());
    vo.setModifiedDate(apiKey.getModifiedDate());
    return vo;
  }

}
