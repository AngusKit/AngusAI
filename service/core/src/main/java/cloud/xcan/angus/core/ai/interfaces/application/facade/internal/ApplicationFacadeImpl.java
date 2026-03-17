package cloud.xcan.angus.core.ai.interfaces.application.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.analytics.ChatAnalyticsQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.activity.ActivityActions;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.interfaces.application.facade.ApplicationFacade;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler.ApplicationAssembler;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.AgentInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationStatsVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ModelInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ApplicationFacadeImpl implements ApplicationFacade {

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private ApplicationCmd applicationCmd;

  @Resource
  private ActivityCmd activityCmd;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ChatAnalyticsQuery chatAnalyticsQuery;

  @NameJoin
  @Override
  public ApplicationDetailVo create(ApplicationCreateDto dto) {
    AIApplication application = ApplicationAssembler.toCreateDomain(dto);
    AIApplication saved = applicationCmd.create(application);
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_APPLICATION_CREATED, saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(
        List.of(saved.getId()));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto) {
    AIApplication saved = applicationCmd.duplicate(id, dto.getName());
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_APPLICATION_DUPLICATED, saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(
        List.of(saved.getId()));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo update(Long id, ApplicationUpdateDto dto) {
    AIApplication application = ApplicationAssembler.toUpdateDomain(id, dto);
    AIApplication saved = applicationCmd.update(application);
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_APPLICATION_UPDATED, saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(id));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo updateConfig(Long id, ApplicationConfig config) {
    AIApplication saved = applicationCmd.updateConfig(id, config);
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_APPLICATION_CONFIG_UPDATED, saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(id));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status) {
    AIApplication saved = applicationCmd.modifyStatus(id, status);
    String actionKey = status == ApplicationStatus.PUBLISHED
        ? ActivityActions.ACTIVITY_APPLICATION_PUBLISHED
        : ActivityActions.ACTIVITY_APPLICATION_UNPUBLISHED;
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(), actionKey,
        saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(id));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo share(Long id, ApplicationShareDto dto) {
    AIApplication application = ApplicationAssembler.shareDomain(id, dto);
    AIApplication saved = applicationCmd.share(application);
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_APPLICATION_SHARED, saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()), statsVoMap.get(id));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo star(Long id, Boolean isStarred) {
    AIApplication saved = applicationCmd.star(id, isStarred);
    String actionKey = Boolean.TRUE.equals(isStarred)
        ? ActivityActions.ACTIVITY_APPLICATION_STAR_ADDED
        : ActivityActions.ACTIVITY_APPLICATION_STAR_REMOVED;
    activityCmd.recordApplicationActivity(saved.getId(), saved.getName(), actionKey,
        saved.getName());
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(id), getDefaultAgentVo(id),
        statsVoMap.get(id));
  }

  @Override
  public void delete(Long id) {
    AIApplication app = applicationQuery.findById(id).orElse(null);
    String appName = app != null ? app.getName() : String.valueOf(id);
    applicationCmd.delete(id);
    activityCmd.recordApplicationActivity(id, appName,
      ActivityActions.ACTIVITY_APPLICATION_DELETED, appName);
  }

  @NameJoin
  @Override
  public ApplicationDetailVo getDetail(Long id) {
    AIApplication saved = applicationQuery.findAndCheck(id);
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(List.of(id));
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(id), getDefaultAgentVo(id),
        statsVoMap.get(id));
  }

  @NameJoin
  @Override
  public PageResult<ApplicationListVo> list(ApplicationFindDto dto) {
    GenericSpecification<AIApplication> spec = ApplicationAssembler.getSpecification(dto);
    Page<AIApplication> page = applicationQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    if (page.getContent().isEmpty()) {
      return buildVoPageResult(page, app
          -> ApplicationAssembler.toListVo(app, List.of(), null, null, false));
    }
    List<Long> appIds = page.getContent().stream().map(AIApplication::getId).toList();
    Map<Long, ApplicationStatsVo> statsVoMap = chatAnalyticsQuery.getApplicationStats(appIds);
    AgentsBatchResult batch = batchLoadAgentsAndDefaultAgents(appIds);
    Set<Long> starredAppIds = applicationQuery.findStarredApplicationIds(appIds);
    return buildVoPageResult(page, app -> {
      boolean isStarred = starredAppIds.contains(app.getId());
      return ApplicationAssembler.toListVo(app,
          batch.agentsMap.getOrDefault(app.getId(), List.of()),
          batch.defaultAgentMap.get(app.getId()), statsVoMap.get(app.getId()),
          isStarred);
    });
  }

  @Override
  public ApplicationCountVo getCounts() {
    return applicationQuery.getCurrentUserCounts();
  }

  @Override
  public ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate) {
    return applicationQuery.getStatistics(id, startDate, endDate);
  }

  /**
   * 批量加载应用的 agents、defaultAgent 及智能体默认模型，一次性查询避免 N+1
   */
  private AgentsBatchResult batchLoadAgentsAndDefaultAgents(List<Long> applicationIds) {
    if (applicationIds == null || applicationIds.isEmpty()) {
      return new AgentsBatchResult(Map.of(), Map.of());
    }
    List<ApplicationAgent> bindings = agentQuery.findAgentByApplicationIdIn(applicationIds);
    if (bindings.isEmpty()) {
      return new AgentsBatchResult(
          applicationIds.stream().collect(Collectors.toMap(id -> id, id -> List.of())), Map.of());
    }
    List<Long> agentIds = bindings.stream().map(ApplicationAgent::getAgentId).distinct().toList();
    List<Agent> agents = agentQuery.findByIds(agentIds);
    Map<Long, Agent> agentMap = agents.stream().collect(Collectors.toMap(Agent::getId, a -> a));

    // 一次性查询所有智能体默认模型
    List<Long> defaultModelIds = agents.stream()
        .map(Agent::getDefaultModelId)
        .filter(java.util.Objects::nonNull)
        .distinct()
        .toList();
    Map<Long, Model> modelMap = defaultModelIds.isEmpty() ? Map.of()
        : modelQuery.findByIds(defaultModelIds).stream()
            .collect(Collectors.toMap(Model::getId, m -> m));

    Map<Long, List<AgentInfoVo>> agentsMap = bindings.stream()
        .collect(Collectors.groupingBy(ApplicationAgent::getApplicationId))
        .entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> {
          List<ApplicationAgent> list = e.getValue().stream()
              .sorted(Comparator.comparingInt(ApplicationAgent::getSortOrder))
              .toList();
          return list.stream()
              .map(b -> {
                Agent agent = agentMap.get(b.getAgentId());
                ModelInfoVo defaultModel = agent != null && agent.getDefaultModelId() != null
                    ? ApplicationAssembler.toModelInfoVo(modelMap.get(agent.getDefaultModelId()))
                    : null;
                return toAgentInfoVo(agent, b.getAgentId(), defaultModel);
              })
              .toList();
        }));

    Map<Long, AgentInfoVo> defaultAgentMap = new java.util.HashMap<>();
    for (Map.Entry<Long, List<AgentInfoVo>> e : agentsMap.entrySet()) {
      Long appId = e.getKey();
      List<AgentInfoVo> agentsList = e.getValue();
      if (!agentsList.isEmpty()) {
        ApplicationAgent defaultBinding = bindings.stream()
            .filter(b -> appId.equals(b.getApplicationId()))
            .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
            .findFirst()
            .orElseGet(() -> bindings.stream()
                .filter(b -> appId.equals(b.getApplicationId()))
                .min(Comparator.comparingInt(ApplicationAgent::getSortOrder))
                .orElse(null));
        if (defaultBinding != null) {
          AgentInfoVo vo = agentsList.stream()
              .filter(a -> defaultBinding.getAgentId().equals(a.getId()))
              .findFirst()
              .orElse(agentsList.get(0));
          defaultAgentMap.put(appId, vo);
        }
      }
    }
    return new AgentsBatchResult(agentsMap, defaultAgentMap);
  }

  private static AgentInfoVo toAgentInfoVo(Agent agent, Long fallbackId, ModelInfoVo defaultModel) {
    AgentInfoVo vo = new AgentInfoVo();
    if (agent != null) {
      vo.setId(agent.getId());
      vo.setName(agent.getName());
      vo.setDescription(agent.getDescription());
      vo.setStatus(agent.getStatus());
      vo.setInteractionMode(agent.getInteractionMode());
      vo.setDefaultModel(defaultModel);
      vo.setWelcomeMessage(agent.getWelcomeMessage());
      vo.setSuggestedQuestions(agent.getSuggestedQuestions());
    } else {
      vo.setId(fallbackId);
      vo.setName("Agent");
    }
    return vo;
  }

  private static class AgentsBatchResult {

    final Map<Long, List<AgentInfoVo>> agentsMap;
    final Map<Long, AgentInfoVo> defaultAgentMap;

    AgentsBatchResult(Map<Long, List<AgentInfoVo>> agentsMap,
        Map<Long, AgentInfoVo> defaultAgentMap) {
      this.agentsMap = agentsMap;
      this.defaultAgentMap = defaultAgentMap;
    }
  }

  private AgentInfoVo getDefaultAgentVo(Long applicationId) {
    Long defaultAgentId = applicationQuery.getDefaultAgentId(applicationId);
    if (defaultAgentId == null) {
      return null;
    }
    try {
      Agent agent = agentQuery.findAndCheck(defaultAgentId);
      ModelInfoVo defaultModel = agent.getDefaultModelId() != null
          ? ApplicationAssembler.toModelInfoVo(
          modelQuery.findById(agent.getDefaultModelId()).orElse(null))
          : null;
      return toAgentInfoVo(agent, defaultAgentId, defaultModel);
    } catch (Exception e) {
      return toAgentInfoVo(null, defaultAgentId, null);
    }
  }

  private List<AgentInfoVo> getAgentsVo(Long applicationId) {
    List<Long> agentIds = applicationQuery.getAgentIds(applicationId);
    if (agentIds == null || agentIds.isEmpty()) {
      return List.of();
    }
    List<Agent> agents = agentQuery.findByIds(agentIds);
    Map<Long, Agent> agentMap = agents.stream().collect(Collectors.toMap(Agent::getId, a -> a));
    // 一次性查询所有智能体默认模型
    List<Long> defaultModelIds = agents.stream()
        .map(Agent::getDefaultModelId)
        .filter(java.util.Objects::nonNull)
        .distinct()
        .toList();
    Map<Long, Model> modelMap = defaultModelIds.isEmpty() ? Map.of()
        : modelQuery.findByIds(defaultModelIds).stream()
            .collect(Collectors.toMap(Model::getId, m -> m));
    return agentIds.stream()
        .map(id -> {
          Agent agent = agentMap.get(id);
          ModelInfoVo defaultModel = agent != null && agent.getDefaultModelId() != null
              ? ApplicationAssembler.toModelInfoVo(modelMap.get(agent.getDefaultModelId()))
              : null;
          return toAgentInfoVo(agent, id, defaultModel);
        })
        .collect(Collectors.toList());
  }

}
