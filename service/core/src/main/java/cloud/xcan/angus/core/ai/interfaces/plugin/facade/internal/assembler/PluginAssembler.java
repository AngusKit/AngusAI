package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo.PluginStatsVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class PluginAssembler {

  public static Plugin toDomain(PluginCreateDto dto) {
    Plugin plugin = new Plugin()
        .setName(dto.getName())
        .setIcon(dto.getIcon())
        .setDescription(dto.getDescription())
        .setAuthor(dto.getAuthor())
        .setVersion(dto.getVersion())
        .setCategory(dto.getCategory())
        .setType(dto.getType())
        .setStatus(PluginStatus.INACTIVE)
        .setTags(dto.getTags())
        .setIsPublic(dto.getIsPublic())
        .setMinVersion(dto.getMinVersion())
        .setHomepageUrl(dto.getHomepageUrl())
        .setDocumentationUrl(dto.getDocumentationUrl())
        .setRepositoryUrl(dto.getRepositoryUrl())
        .setSupportUrl(dto.getSupportUrl())
        .setLicense(dto.getLicense())
        .setPrice(dto.getPrice())
        .setCurrency(dto.getCurrency())
        .setIsSystem(false)
        .setIsVerified(false);

    // 设置插件文件
    plugin.setFile(dto.getFile());

    // 初始化统计数据
    plugin.setInstallCount(0L);
    plugin.setUsageCount(0L);
    plugin.setRating(0.0);
    plugin.setReviewCount(0L);
    return plugin;
  }

  public static Plugin updateDomain(Long id, PluginUpdateDto dto) {
    Plugin plugin = new Plugin();
    plugin.setId(id)
        .setName(dto.getName())
        .setIcon(dto.getIcon())
        .setDescription(dto.getDescription())
        .setAuthor(dto.getAuthor())
        .setVersion(dto.getVersion())
        .setCategory(dto.getCategory())
        .setType(dto.getType())
        .setStatus(PluginStatus.INACTIVE)
        .setTags(dto.getTags())
        .setIsPublic(dto.getIsPublic())
        .setMinVersion(dto.getMinVersion())
        .setHomepageUrl(dto.getHomepageUrl())
        .setDocumentationUrl(dto.getDocumentationUrl())
        .setRepositoryUrl(dto.getRepositoryUrl())
        .setSupportUrl(dto.getSupportUrl())
        .setLicense(dto.getLicense())
        .setPrice(dto.getPrice())
        .setCurrency(dto.getCurrency());

    // 设置插件文件
    plugin.setFile(dto.getFile());
    return plugin;
  }

  public static PluginDetailVo toDetailVo(Plugin plugin) {
    PluginDetailVo vo = new PluginDetailVo();
    vo.setId(plugin.getId());
    vo.setName(plugin.getName());
    vo.setIcon(plugin.getIcon());
    vo.setDescription(plugin.getDescription());
    vo.setAuthor(plugin.getAuthor());
    vo.setVersion(plugin.getVersion());
    vo.setCategory(plugin.getCategory());
    vo.setStatus(plugin.getStatus());
    vo.setType(plugin.getType());
    vo.setTags(plugin.getTags());
    vo.setInstallCount(plugin.getInstallCount());
    vo.setUsageCount(plugin.getUsageCount());
    vo.setRating(plugin.getRating());
    vo.setReviewCount(plugin.getReviewCount());
    vo.setIsFavorite(plugin.getIsFavorite());
    vo.setIsSystem(plugin.getIsSystem());
    vo.setIsPublic(plugin.getIsPublic());
    vo.setIsVerified(plugin.getIsVerified());
    vo.setMinVersion(plugin.getMinVersion());
    vo.setHomepageUrl(plugin.getHomepageUrl());
    vo.setDocumentationUrl(plugin.getDocumentationUrl());
    vo.setRepositoryUrl(plugin.getRepositoryUrl());
    vo.setSupportUrl(plugin.getSupportUrl());
    vo.setLicense(plugin.getLicense());
    vo.setPrice(plugin.getPrice());
    vo.setCurrency(plugin.getCurrency());
    vo.setPublishedDate(plugin.getPublishedDate());

    // 设置审计信息
    vo.setTenantId(plugin.getTenantId());
    vo.setCreatedBy(plugin.getCreatedBy());
    vo.setCreatedDate(plugin.getCreatedDate());
    vo.setModifiedBy(plugin.getModifiedBy());
    vo.setModifiedDate(plugin.getModifiedDate());

    // 统计数据
    PluginStatsVo stats = new PluginStatsVo();
    stats.setTotalInstalls(plugin.getInstallCount());
    stats.setTotalUsages(plugin.getUsageCount());
    stats.setAverageRating(plugin.getRating());
    stats.setTotalReviews(plugin.getReviewCount());
    // TODO: 活跃用户数需要从其他地方获取
    stats.setActiveUsers(0L);
    vo.setStats(stats);
    return vo;
  }

  public static PluginListVo toListVo(Plugin plugin) {
    PluginListVo vo = new PluginListVo();
    vo.setId(plugin.getId());
    vo.setName(plugin.getName());
    vo.setIcon(plugin.getIcon());
    vo.setDescription(plugin.getDescription());
    vo.setAuthor(plugin.getAuthor());
    vo.setVersion(plugin.getVersion());
    vo.setCategory(plugin.getCategory());
    vo.setStatus(plugin.getStatus());
    vo.setType(plugin.getType());
    vo.setTags(plugin.getTags());
    vo.setInstallCount(plugin.getInstallCount());
    vo.setUsageCount(plugin.getUsageCount());
    vo.setRating(plugin.getRating());
    vo.setReviewCount(plugin.getReviewCount());
    vo.setIsFavorite(plugin.getIsFavorite());
    vo.setIsSystem(plugin.getIsSystem());
    vo.setIsPublic(plugin.getIsPublic());
    vo.setIsVerified(plugin.getIsVerified());
    vo.setPrice(plugin.getPrice());
    vo.setCurrency(plugin.getCurrency());
    vo.setPublishedDate(plugin.getPublishedDate());

    // 设置审计信息
    vo.setTenantId(plugin.getTenantId());
    vo.setCreatedBy(plugin.getCreatedBy());
    vo.setCreatedDate(plugin.getCreatedDate());
    vo.setModifiedBy(plugin.getModifiedBy());
    vo.setModifiedDate(plugin.getModifiedDate());
    return vo;
  }

  public static PluginStatisticsVo toStatisticsVo(PluginStatistics statistics) {
    PluginStatisticsVo vo = new PluginStatisticsVo();
    vo.setTotalPlugins(statistics.getTotalPlugins());
    vo.setTotalAvailablePlugins(statistics.getTotalAvailablePlugins());
    vo.setMyPlugins(statistics.getMyPlugins());
    vo.setInstalledPlugins(statistics.getInstalledPlugins());
    vo.setDownloadPlugins(statistics.getDownloadPlugins());
    vo.setVisitsPlugins(statistics.getVisitsPlugins());
    vo.setPublicPlugins(statistics.getPublicPlugins());
    vo.setTotalInstalls(statistics.getTotalInstalls());
    vo.setTotalUsages(statistics.getTotalUsages());
    vo.setTotalRatings(statistics.getTotalRatings());
    vo.setCategoryStats(statistics.getCategoryStats());
    vo.setLastMonthGrowthTrend(statistics.getLastMonthGrowthTrend());
    vo.setTrendingPlugins(statistics.getTrendingPlugins());
    return vo;
  }

  public static GenericSpecification<Plugin> getSpecification(PluginFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate")
        .orderByFields("id", "createdDate", "name", "category",
            "status", "type", "installCount", "usageCount", "reviewCount", "rating", "minRating")
        .matchSearchFields("name", "description")
        .inAndNotFields("category", "status", "type")
        .build();
    return new GenericSpecification<>(filters);
  }

}
