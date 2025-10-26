package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyListVo;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * API密钥转换器
 */
public class ApiKeyConverter {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  /**
   * 转换为详情VO
   */
  public static ApiKeyDetailVo toDetailVo(ApiKey entity, List<ApiKeyResource> resources) {
    ApiKeyDetailVo vo = new ApiKeyDetailVo();
    vo.setId(entity.getId());
    vo.setName(entity.getName());
    vo.setDescription(entity.getDescription());
    vo.setKeyPrefix(entity.getKeyPrefix());
    vo.setStatus(entity.getStatus().name());
    vo.setPermissions(entity.getPermissions());
    vo.setRateLimit(entity.getRateLimit());
    vo.setDailyLimit(entity.getDailyLimit());

    // IP白名单
    if (entity.getIpWhitelist() != null && !entity.getIpWhitelist().isEmpty()) {
      vo.setIpWhitelist(Arrays.asList(entity.getIpWhitelist().split(",")));
    } else {
      vo.setIpWhitelist(new ArrayList<>());
    }

    // 授权资源
    if (resources != null) {
      Map<String, List<ApiKeyResource>> groupedResources = resources.stream()
          .collect(Collectors.groupingBy(r -> r.getResourceType().name()));

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
    usageStats.setUsageCount(entity.getUsageCount() != null ? entity.getUsageCount() : 0L);
    usageStats.setLastUsedAt(entity.getLastUsedAt() != null ? entity.getLastUsedAt().format(FORMATTER) : null);
    vo.setUsageStats(usageStats);

    // 时间信息
    vo.setCreatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().format(FORMATTER) : null);
    vo.setUpdatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().format(FORMATTER) : null);
    vo.setExpiresAt(entity.getExpiresAt() != null ? entity.getExpiresAt().format(FORMATTER) : null);
    vo.setRevokedAt(entity.getRevokedAt() != null ? entity.getRevokedAt().format(FORMATTER) : null);
    vo.setRefreshedAt(entity.getRefreshedAt() != null ? entity.getRefreshedAt().format(FORMATTER) : null);

    return vo;
  }

  /**
   * 转换为列表VO
   */
  public static ApiKeyListVo toListVo(ApiKey entity, List<ApiKeyResource> resources) {
    ApiKeyListVo vo = new ApiKeyListVo();
    vo.setId(entity.getId());
    vo.setName(entity.getName());
    vo.setDescription(entity.getDescription());
    vo.setKeyPrefix(entity.getKeyPrefix());
    vo.setStatus(entity.getStatus().name());
    vo.setPermissions(entity.getPermissions());
    vo.setRateLimit(entity.getRateLimit());
    vo.setDailyLimit(entity.getDailyLimit());
    vo.setUsageCount(entity.getUsageCount() != null ? entity.getUsageCount() : 0L);

    // 授权资源
    if (resources != null) {
      Map<String, List<ApiKeyResource>> groupedResources = resources.stream()
          .collect(Collectors.groupingBy(r -> r.getResourceType().name()));

      List<ApiKeyListVo.AuthorizedResourceVo> resourceVos = groupedResources.entrySet().stream()
          .map(entry -> {
            ApiKeyListVo.AuthorizedResourceVo resourceVo = new ApiKeyListVo.AuthorizedResourceVo();
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

    vo.setLastUsedAt(entity.getLastUsedAt() != null ? entity.getLastUsedAt().format(FORMATTER) : null);
    vo.setCreatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().format(FORMATTER) : null);
    vo.setExpiresAt(entity.getExpiresAt() != null ? entity.getExpiresAt().format(FORMATTER) : null);

    return vo;
  }
}
