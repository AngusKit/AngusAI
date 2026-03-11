package cloud.xcan.angus.core.ai.interfaces.application.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.ApplicationFacade;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler.ApplicationAssembler;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ResourceInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.search.SearchCriteria;
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
  private AgentQuery agentQuery;

  @NameJoin
  @Override
  public ApplicationDetailVo create(ApplicationCreateDto dto) {
    AIApplication application = ApplicationAssembler.toCreateDomain(dto);
    AIApplication saved = applicationCmd.create(application);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto) {
    AIApplication saved = applicationCmd.duplicate(id, dto.getName());
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo update(Long id, ApplicationUpdateDto dto) {
    AIApplication application = ApplicationAssembler.toUpdateDomain(id, dto);
    AIApplication saved = applicationCmd.update(application);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo updateConfig(Long id, ApplicationConfig config) {
    AIApplication saved = applicationCmd.updateConfig(id, config);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status) {
    AIApplication saved = applicationCmd.modifyStatus(id, status);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo share(Long id, ApplicationShareDto dto) {
    AIApplication application = ApplicationAssembler.shareDomain(id, dto);
    AIApplication saved = applicationCmd.share(application);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(saved.getId()),
        getDefaultAgentVo(saved.getId()));
  }

  @NameJoin
  @Override
  public ApplicationDetailVo star(Long id, Boolean isStarred) {
    AIApplication saved = applicationCmd.star(id, isStarred);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(id), getDefaultAgentVo(id));
  }

  @Override
  public void delete(Long id) {
    applicationCmd.delete(id);
  }

  @NameJoin
  @Override
  public ApplicationDetailVo getDetail(Long id) {
    AIApplication saved = applicationQuery.findAndCheck(id);
    return ApplicationAssembler.toDetailVo(saved, getAgentsVo(id), getDefaultAgentVo(id));
  }

  @NameJoin
  @Override
  public PageResult<ApplicationListVo> list(ApplicationFindDto dto) {
    GenericSpecification<AIApplication> spec = ApplicationAssembler.getSpecification(dto);
    Page<AIApplication> page = applicationQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    if (page.getContent().isEmpty()) {
      return buildVoPageResult(page, app
          -> ApplicationAssembler.toListVo(app, List.of(), null, false));
    }
    List<Long> appIds = page.getContent().stream().map(AIApplication::getId).toList();
    AgentsBatchResult batch = batchLoadAgentsAndDefaultAgents(appIds);
    Set<Long> starredAppIds = applicationQuery.findStarredApplicationIds(appIds);
    return buildVoPageResult(page, app -> {
      boolean isStarred = starredAppIds.contains(app.getId());
      return ApplicationAssembler.toListVo(app,
          batch.agentsMap.getOrDefault(app.getId(), List.of()),
          batch.defaultAgentMap.get(app.getId()),
          isStarred);
    });
  }

  @Override
  public ApplicationCountVo getCounts() {
    return applicationQuery.getCurrentUserCounts();
  }

  @Override
  public ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate,
      String period) {
    return applicationQuery.getStatistics(id, startDate, endDate, period);
  }

  /**
   * 批量加载应用的 agents 和 defaultAgent，仅 2 次数据库查询，避免 N+1
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

    Map<Long, List<ResourceInfoVo>> agentsMap = bindings.stream()
        .collect(Collectors.groupingBy(ApplicationAgent::getApplicationId))
        .entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> {
          List<ApplicationAgent> list = e.getValue().stream()
              .sorted(Comparator.comparingInt(ApplicationAgent::getSortOrder))
              .toList();
          return list.stream()
              .map(b -> {
                Agent agent = agentMap.get(b.getAgentId());
                return agent != null ? new ResourceInfoVo(agent.getId(), agent.getName())
                    : new ResourceInfoVo(b.getAgentId(), "Agent");
              })
              .toList();
        }));

    Map<Long, ResourceInfoVo> defaultAgentMap = new java.util.HashMap<>();
    for (Map.Entry<Long, List<ResourceInfoVo>> e : agentsMap.entrySet()) {
      Long appId = e.getKey();
      List<ResourceInfoVo> agentsList = e.getValue();
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
          ResourceInfoVo vo = agentsList.stream()
              .filter(a -> defaultBinding.getAgentId().equals(a.getId()))
              .findFirst()
              .orElse(agentsList.get(0));
          defaultAgentMap.put(appId, vo);
        }
      }
    }
    return new AgentsBatchResult(agentsMap, defaultAgentMap);
  }

  private static class AgentsBatchResult {

    final Map<Long, List<ResourceInfoVo>> agentsMap;
    final Map<Long, ResourceInfoVo> defaultAgentMap;

    AgentsBatchResult(Map<Long, List<ResourceInfoVo>> agentsMap,
        Map<Long, ResourceInfoVo> defaultAgentMap) {
      this.agentsMap = agentsMap;
      this.defaultAgentMap = defaultAgentMap;
    }
  }

  private ResourceInfoVo getDefaultAgentVo(Long applicationId) {
    Long defaultAgentId = applicationQuery.getDefaultAgentId(applicationId);
    if (defaultAgentId == null) {
      return null;
    }
    try {
      Agent agent = agentQuery.findAndCheck(defaultAgentId);
      return new ResourceInfoVo(agent.getId(), agent.getName());
    } catch (Exception e) {
      return new ResourceInfoVo(defaultAgentId, "Agent");
    }
  }

  private List<ResourceInfoVo> getAgentsVo(Long applicationId) {
    List<Long> agentIds = applicationQuery.getAgentIds(applicationId);
    if (agentIds == null || agentIds.isEmpty()) {
      return List.of();
    }
    List<Agent> agents = agentQuery.findByIds(agentIds);
    Map<Long, Agent> agentMap = agents.stream().collect(Collectors.toMap(Agent::getId, a -> a));
    return agentIds.stream()
        .map(id -> {
          Agent agent = agentMap.get(id);
          return agent != null ? new ResourceInfoVo(agent.getId(), agent.getName())
              : new ResourceInfoVo(id, "Agent");
        })
        .collect(Collectors.toList());
  }

}
