package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo.PluginStatsVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.search.SearchCriteria;
import org.springframework.util.StringUtils;

public class PluginAssembler {

  public static Plugin toDomain(PluginCreateDto dto) {
    return new Plugin()
        .setName(dto.getName())
        .setNameEn(dto.getNameEn())
        .setIcon(dto.getIcon())
        .setDescription(dto.getDescription())
        .setAuthor(dto.getAuthor())
        .setVersion(dto.getVersion())
        .setCategory(dto.getCategory())
        .setType(dto.getType())
        .setStatus(PluginStatus.INACTIVE)
        .setConfig(dto.getConfig())
        .setPermissions(dto.getPermissions())
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
        .setInstallCount(0L)
        .setUsageCount(0L)
        .setRating(0.0)
        .setReviewCount(0L)
        .setIsFavorite(false)
        .setIsSystem(false)
        .setIsVerified(false);
  }

  public static Plugin updateDomain(Long id, PluginUpdateDto dto) {
    Plugin plugin = new Plugin();
    plugin.setId(id);
    
    if (StringUtils.hasText(dto.getName())) {
      plugin.setName(dto.getName());
    }
    if (StringUtils.hasText(dto.getNameEn())) {
      plugin.setNameEn(dto.getNameEn());
    }
    if (StringUtils.hasText(dto.getIcon())) {
      plugin.setIcon(dto.getIcon());
    }
    if (StringUtils.hasText(dto.getDescription())) {
      plugin.setDescription(dto.getDescription());
    }
    if (StringUtils.hasText(dto.getAuthor())) {
      plugin.setAuthor(dto.getAuthor());
    }
    if (StringUtils.hasText(dto.getVersion())) {
      plugin.setVersion(dto.getVersion());
    }
    if (dto.getCategory() != null) {
      plugin.setCategory(dto.getCategory());
    }
    if (dto.getStatus() != null) {
      plugin.setStatus(dto.getStatus());
    }
    if (dto.getType() != null) {
      plugin.setType(dto.getType());
    }
    if (dto.getConfig() != null) {
      plugin.setConfig(dto.getConfig());
    }
    if (dto.getPermissions() != null) {
      plugin.setPermissions(dto.getPermissions());
    }
    if (dto.getTags() != null) {
      plugin.setTags(dto.getTags());
    }
    if (dto.getIsPublic() != null) {
      plugin.setIsPublic(dto.getIsPublic());
    }
    if (StringUtils.hasText(dto.getMinVersion())) {
      plugin.setMinVersion(dto.getMinVersion());
    }
    if (StringUtils.hasText(dto.getHomepageUrl())) {
      plugin.setHomepageUrl(dto.getHomepageUrl());
    }
    if (StringUtils.hasText(dto.getDocumentationUrl())) {
      plugin.setDocumentationUrl(dto.getDocumentationUrl());
    }
    if (StringUtils.hasText(dto.getRepositoryUrl())) {
      plugin.setRepositoryUrl(dto.getRepositoryUrl());
    }
    if (StringUtils.hasText(dto.getSupportUrl())) {
      plugin.setSupportUrl(dto.getSupportUrl());
    }
    if (StringUtils.hasText(dto.getLicense())) {
      plugin.setLicense(dto.getLicense());
    }
    if (dto.getPrice() != null) {
      plugin.setPrice(dto.getPrice());
    }
    if (StringUtils.hasText(dto.getCurrency())) {
      plugin.setCurrency(dto.getCurrency());
    }
    
    return plugin;
  }

  public static PluginDetailVo toDetailVo(Plugin plugin) {
    PluginDetailVo vo = new PluginDetailVo();
    vo.setId(plugin.getId());
    vo.setName(plugin.getName());
    vo.setNameEn(plugin.getNameEn());
    vo.setIcon(plugin.getIcon());
    vo.setDescription(plugin.getDescription());
    vo.setAuthor(plugin.getAuthor());
    vo.setVersion(plugin.getVersion());
    vo.setCategory(plugin.getCategory());
    vo.setStatus(plugin.getStatus());
    vo.setType(plugin.getType());
    vo.setConfig(plugin.getConfig());
    vo.setPermissions(plugin.getPermissions());
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
    vo.setTenantId(plugin.getTenantId());
    vo.setCreatedBy(plugin.getCreatedBy());
    vo.setCreatedDate(plugin.getCreatedDate());
    vo.setLastModifiedBy(plugin.getLastModifiedBy());
    vo.setLastModifiedDate(plugin.getLastModifiedDate());
    vo.setPublishedDate(plugin.getPublishedDate());

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
    vo.setNameEn(plugin.getNameEn());
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
    vo.setTenantId(plugin.getTenantId());
    vo.setCreatedBy(plugin.getCreatedBy());
    vo.setCreatedDate(plugin.getCreatedDate());
    vo.setLastModifiedBy(plugin.getLastModifiedBy());
    vo.setLastModifiedDate(plugin.getLastModifiedDate());
    vo.setPublishedDate(plugin.getPublishedDate());
    return vo;
  }

  public static GenericSpecification<Plugin> getSpecification(PluginFindDto dto) {
    SearchCriteriaBuilder<Plugin> builder = new SearchCriteriaBuilder<>();

    if (StringUtils.hasText(dto.getKeyword())) {
      builder.addOr(SearchCriteria.like("name", dto.getKeyword()));
      builder.addOr(SearchCriteria.like("description", dto.getKeyword()));
    }

    if (dto.getCategory() != null) {
      builder.add(SearchCriteria.equal("category", dto.getCategory()));
    }

    if (dto.getStatus() != null) {
      builder.add(SearchCriteria.equal("status", dto.getStatus()));
    }

    if (dto.getType() != null) {
      builder.add(SearchCriteria.equal("type", dto.getType()));
    }

    if (dto.getIsPublic() != null) {
      builder.add(SearchCriteria.equal("isPublic", dto.getIsPublic()));
    }

    if (dto.getIsSystem() != null) {
      builder.add(SearchCriteria.equal("isSystem", dto.getIsSystem()));
    }

    if (dto.getIsVerified() != null) {
      builder.add(SearchCriteria.equal("isVerified", dto.getIsVerified()));
    }

    if (dto.getIsFavorite() != null) {
      builder.add(SearchCriteria.equal("isFavorite", dto.getIsFavorite()));
    }

    if (dto.getMinRating() != null) {
      builder.add(SearchCriteria.greaterThanOrEqual("rating", dto.getMinRating()));
    }

    if (dto.getCreatedBy() != null) {
      builder.add(SearchCriteria.equal("createdBy", dto.getCreatedBy()));
    }

    if (dto.getCreatedDateStart() != null) {
      builder.add(SearchCriteria.greaterThanOrEqual("createdDate", dto.getCreatedDateStart()));
    }

    if (dto.getCreatedDateEnd() != null) {
      builder.add(SearchCriteria.lessThanOrEqual("createdDate", dto.getCreatedDateEnd()));
    }

    if (dto.getLastModifiedBy() != null) {
      builder.add(SearchCriteria.equal("lastModifiedBy", dto.getLastModifiedBy()));
    }

    if (dto.getLastModifiedDate() != null) {
      builder.add(SearchCriteria.equal("lastModifiedDate", dto.getLastModifiedDate()));
    }

    // TODO: 标签搜索需要特殊处理JSON字段

    return builder.build();
  }
}
