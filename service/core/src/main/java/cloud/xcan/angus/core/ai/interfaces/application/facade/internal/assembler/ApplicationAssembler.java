package cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.AgentInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ModelInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationConfigVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationShareVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationStatsVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler.ModelAssembler;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class ApplicationAssembler {

  public static AIApplication toCreateDomain(ApplicationCreateDto dto) {
    AIApplication application = new AIApplication()
        .setName(dto.getName())
        .setIcon(dto.getIcon())
        .setDescription(dto.getDescription())
        .setTags(dto.getTags());

    // 智能体绑定由 ApplicationCmdImpl.create 在保存应用后写入 ai_application_agent
    Long defaultId = dto.getDefaultAgentId() != null
        && dto.getAgentIds().contains(dto.getDefaultAgentId())
        ? dto.getDefaultAgentId() : dto.getAgentIds().get(0);

    // 设置默认配置
    ApplicationConfig config = new ApplicationConfig();
    config.setAgentIds(dto.getAgentIds());
    config.setDefaultAgentId(defaultId);
    application.setConfig(config);

    // 设置默认值
    application.setStatus(ApplicationStatus.DRAFT)
        .setApiCalls(0L)
        .setTotalTokens(0L)
        .setAvgResponseTime(0.0)
        .setSuccessRate(0.0)
        .setPublicAccess(false)
        .setEmbedEnabled(false)
        .setApiEnabled(false);
    return application;
  }

  public static AIApplication toUpdateDomain(Long id, ApplicationUpdateDto dto) {
    AIApplication application = new AIApplication();
    application.setId(id);
    application.setName(dto.getName());
    application.setIcon(dto.getIcon());
    application.setDescription(dto.getDescription());
    application.setTags(dto.getTags());
    // agentIds 由 updateAssociatedIds 根据 config 在 applicationDb 对应的 ai_application_agent 表更新
    if (dto.getAgentIds() != null && !dto.getAgentIds().isEmpty()) {
      ApplicationConfig config = new ApplicationConfig();
      config.setAgentIds(dto.getAgentIds());
      config.setDefaultAgentId(dto.getDefaultAgentId());
      application.setConfig(config);
    }
    return application;
  }

  /**
   * 将 Model 转为 ModelInfoVo（apiKey 已脱敏）
   */
  public static ModelInfoVo toModelInfoVo(Model model) {
    if (model == null) {
      return null;
    }
    ModelInfoVo vo = new ModelInfoVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setProvider(model.getProvider());
    vo.setStatus(model.getStatus());
    vo.setConfig(ModelAssembler.maskApiKey(model.getConfig()));
    return vo;
  }

  public static AIApplication shareDomain(Long id, ApplicationShareDto dto) {
    AIApplication application = new AIApplication();
    application.setId(id);
    application.setSharePublicAccess(dto.isPublicAccess());
    application.setShareAnonymousAccess(dto.isAnonymousAccess());
    application.setShareAuthorizationRequired(dto.isAuthorizationRequired());

    LocalDateTime expiresAt = dto.getExpiresIn() > 0 ?
        LocalDateTime.now().plusHours(dto.getExpiresIn()) : null;
    application.setShareExpiresAt(expiresAt);
    return application;
  }

  public static ApplicationDetailVo toDetailVo(AIApplication application,
      List<AgentInfoVo> agents, AgentInfoVo defaultAgent) {
    ApplicationDetailVo vo = new ApplicationDetailVo();
    vo.setId(application.getId());
    vo.setName(application.getName());
    vo.setIcon(application.getIcon());
    vo.setDescription(application.getDescription());
    vo.setTags(application.getTags());
    vo.setStatus(application.getStatus());
    vo.setPublishedDate(application.getPublishedDate());

    // 设置审计信息
    vo.setTenantId(application.getTenantId());
    vo.setCreatedBy(application.getCreatedBy());
    vo.setCreatedDate(application.getCreatedDate());
    vo.setModifiedBy(application.getModifiedBy());
    vo.setModifiedDate(application.getModifiedDate());

    // 设置配置信息（agents、defaultAgent、features、security、publish）
    ApplicationConfigVo configVo = new ApplicationConfigVo();
    if (application.getConfig() != null) {
      configVo.setAgents(agents != null ? agents : java.util.List.of());
      configVo.setDefaultAgent(defaultAgent);
      CoreUtils.copyProperties(application.getConfig(), configVo);
    }
    vo.setConfig(configVo);

    // 设置分享信息
    vo.setShare(CoreUtils.copyProperties(application.getShare(), new ApplicationShareVo()));

    // 设置统计信息
    ApplicationStatsVo statsVo = new ApplicationStatsVo();
    statsVo.setTotalApiCalls(application.getApiCalls());
    statsVo.setTotalTokens(application.getTotalTokens());
    statsVo.setAvgResponseTime(application.getAvgResponseTime());
    statsVo.setSuccessRate(application.getSuccessRate());
    vo.setStats(statsVo);
    vo.setAgents(agents != null ? agents : java.util.List.of());
    vo.setDefaultAgent(defaultAgent);
    return vo;
  }

  public static ApplicationListVo toListVo(AIApplication application,
      List<AgentInfoVo> agents, AgentInfoVo defaultAgent,
      boolean isStarred) {
    ApplicationListVo vo = new ApplicationListVo();
    vo.setId(application.getId());
    vo.setName(application.getName());
    vo.setIcon(application.getIcon());
    vo.setDescription(application.getDescription());
    vo.setTags(application.getTags());
    vo.setStatus(application.getStatus());
    vo.setAgents(agents != null ? agents : List.of());
    vo.setDefaultAgent(defaultAgent);
    vo.setApiCalls(application.getApiCalls());
    vo.setPublicAccess(application.getPublicAccess());
    vo.setEmbedEnabled(application.getEmbedEnabled());
    vo.setApiEnabled(application.getApiEnabled());
    vo.setPublishedDate(application.getPublishedDate());
    vo.setIsStarred(isStarred);

    // 设置审计信息
    vo.setTenantId(application.getTenantId());
    vo.setCreatedBy(application.getCreatedBy());
    vo.setCreatedDate(application.getCreatedDate());
    vo.setModifiedBy(application.getModifiedBy());
    vo.setModifiedDate(application.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<AIApplication> getSpecification(ApplicationFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "createdDate", "modifiedDate", "apiCalls", "status", "name")
        .matchSearchFields("name", "description", "tags")
        .inAndNotFields("status", "createdBy")
        .build();
    return new GenericSpecification<>(filters);
  }
}
