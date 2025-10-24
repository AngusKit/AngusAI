package cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationConfigVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationShareVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationStatsVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ResourcesConfigVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.biz.JoinSupplier;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.core.spring.SpringContextHolder;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;
import org.springframework.util.StringUtils;

public class ApplicationAssembler {

  public static Application toDomain(ApplicationCreateDto dto) {
    return new Application()
        .setName(dto.getName())
        .setIcon(dto.getIcon())
        .setDescription(dto.getDescription())
        .setCategory(dto.getCategory())
        .setStatus(ApplicationStatus.DRAFT)
        .setLanguage(dto.getLanguage())
        .setApiCalls(0L)
        .setTotalTokens(0L)
        .setAvgResponseTime(0.0)
        .setSuccessRate(0.0)
        .setPublicAccess(false)
        .setEmbedEnabled(false)
        .setApiEnabled(false);
  }

  public static Application updateDomain(Long id, ApplicationUpdateDto dto) {
    Application application = new Application();
    application.setId(id);
    if (StringUtils.hasText(dto.getName())) {
      application.setName(dto.getName());
    }
    if (StringUtils.hasText(dto.getIcon())) {
      application.setIcon(dto.getIcon());
    }
    if (StringUtils.hasText(dto.getDescription())) {
      application.setDescription(dto.getDescription());
    }
    if (dto.getCategory() != null) {
      application.setCategory(dto.getCategory());
    }
    if (StringUtils.hasText(dto.getLanguage())) {
      application.setLanguage(dto.getLanguage());
    }
    return application;
  }

  public static Application shareDomain(Long id, ApplicationShareDto dto) {
    Application application = new Application();
    application.setId(id);
    application.setSharePublicAccess(dto.isPublicAccess());
    application.setShareAnonymousAccess(dto.isAnonymousAccess());
    application.setShareAuthorizationRequired(dto.isAuthorizationRequired());

    LocalDateTime expiresAt = dto.getExpiresIn() > 0 ?
        LocalDateTime.now().plusHours(dto.getExpiresIn()) : null;
    application.setShareExpiresAt(expiresAt);
    return application;
  }

  public static ApplicationDetailVo toDetailVo(Application application) {
    ApplicationDetailVo vo = new ApplicationDetailVo();
    vo.setId(application.getId());
    vo.setName(application.getName());
    vo.setIcon(application.getIcon());
    vo.setDescription(application.getDescription());
    vo.setCategory(application.getCategory());
    vo.setStatus(application.getStatus());
    vo.setLanguage(application.getLanguage());
    vo.setTenantId(application.getTenantId());
    vo.setCreatedBy(application.getCreatedBy());
    vo.setCreatedDate(application.getCreatedDate());
    vo.setLastModifiedBy(application.getLastModifiedBy());
    vo.setLastModifiedDate(application.getLastModifiedDate());
    vo.setPublishedDate(application.getPublishedDate());
    ApplicationConfigVo configVo = new ApplicationConfigVo();
    CoreUtils.copyProperties(application.getConfig(), configVo);
    Objects.requireNonNull(SpringContextHolder.getBean(JoinSupplier.class))
        .execute(() -> joinResourceName(configVo));
    vo.setConfig(configVo);
    vo.setShare(CoreUtils.copyProperties(application.getShare(), new ApplicationShareVo()));
    ApplicationStatsVo statsVo = new ApplicationStatsVo();
    statsVo.setTotalApiCalls(application.getApiCalls());
    statsVo.setTotalTokens(application.getTotalTokens());
    statsVo.setAvgResponseTime(application.getAvgResponseTime());
    statsVo.setSuccessRate(application.getSuccessRate());
    vo.setStats(statsVo);
    return vo;
  }

  @NameJoin
  public static ResourcesConfigVo joinResourceName(ApplicationConfigVo configVo) {
    return configVo.getResources();
  }

  public static ApplicationListVo toListVo(Application application) {
    ApplicationListVo vo = new ApplicationListVo();
    vo.setId(application.getId());
    vo.setName(application.getName());
    vo.setIcon(application.getIcon());
    vo.setDescription(application.getDescription());
    vo.setCategory(application.getCategory());
    vo.setStatus(application.getStatus());
    vo.setApiCalls(application.getApiCalls());
    vo.setPublicAccess(application.getPublicAccess());
    vo.setEmbedEnabled(application.getEmbedEnabled());
    vo.setApiEnabled(application.getApiEnabled());
    vo.setTenantId(application.getTenantId());
    vo.setCreatedBy(application.getCreatedBy());
    vo.setCreatedDate(application.getCreatedDate());
    vo.setLastModifiedBy(application.getLastModifiedBy());
    vo.setLastModifiedDate(application.getLastModifiedDate());
    vo.setPublishedDate(application.getPublishedDate());
    return vo;
  }

  public static GenericSpecification<Application> getSpecification(ApplicationFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "lastModifiedDate")
        .orderByFields("id", "createdDate", "lastModifiedDate", "apiCalls", "name")
        .matchSearchFields("name", "description")
        .inAndNotFields("category", "status", "createdBy")
        .build();
    return new GenericSpecification<>(filters);
  }
}
