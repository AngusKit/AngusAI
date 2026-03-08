package cloud.xcan.angus.core.ai.interfaces.application.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.interfaces.application.facade.ApplicationFacade;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler.ApplicationAssembler;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ResourceInfoVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ResourcesConfigVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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
  private WorkflowQuery workflowQuery;

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Resource
  private AgentQuery agentQuery;

  @Override
  public ApplicationDetailVo create(ApplicationCreateDto dto) {
    AIApplication application = ApplicationAssembler.toCreateDomain(dto);
    AIApplication saved = applicationCmd.create(application);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto) {
    AIApplication saved = applicationCmd.duplicate(id, dto.getName());
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public ApplicationDetailVo update(Long id, ApplicationUpdateDto dto) {
    AIApplication application = ApplicationAssembler.toUpdateDomain(id, dto);
    AIApplication saved = applicationCmd.update(application);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public ApplicationDetailVo updateConfig(Long id, ApplicationConfig config) {
    AIApplication saved = applicationCmd.updateConfig(id, config);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status) {
    AIApplication saved = applicationCmd.modifyStatus(id, status);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public ApplicationDetailVo share(Long id, ApplicationShareDto dto) {
    AIApplication application = ApplicationAssembler.shareDomain(id, dto);
    AIApplication saved = applicationCmd.share(application);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved.getId()),
        getAgentsVo(saved.getId()), getDefaultAgentVo(saved.getId()));
  }

  @Override
  public void delete(Long id) {
    applicationCmd.delete(id);
  }

  @NameJoin
  @Override
  public ApplicationDetailVo getDetail(Long id) {
    AIApplication saved = applicationQuery.findAndCheck(id);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(id),
        getAgentsVo(id), getDefaultAgentVo(id));
  }

  @NameJoin
  @Override
  public PageResult<ApplicationListVo> list(ApplicationFindDto dto) {
    GenericSpecification<AIApplication> spec = ApplicationAssembler.getSpecification(dto);
    Page<AIApplication> page = applicationQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    List<AIApplication> content = page.getContent();
    if (content.isEmpty()) {
      return buildVoPageResult(page, app -> ApplicationAssembler.toListVo(app, List.of(), null));
    }
    // 批量加载 agents 和 defaultAgent，避免 N+1 查询
    List<Long> appIds = content.stream().map(AIApplication::getId).toList();
    AgentsBatchResult batch = batchLoadAgentsAndDefaultAgents(appIds);
    return buildVoPageResult(page, app -> ApplicationAssembler.toListVo(app,
        batch.agentsMap.getOrDefault(app.getId(), List.of()),
        batch.defaultAgentMap.get(app.getId())));
  }

  @Override
  public ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate,
      String period) {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    ApplicationStatisticsVo statistics = new ApplicationStatisticsVo();
    // TODO: 实现统计逻辑
    return statistics;
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

  private ResourcesConfigVo getResourcesConfigVo(Long applicationId) {
    ResourcesConfigVo vo = new ResourcesConfigVo();
    Long defaultAgentId = applicationQuery.getDefaultAgentId(applicationId);
    if (defaultAgentId == null) {
      return vo;
    }
    Agent agent = agentQuery.findAndCheck(defaultAgentId);
    if (nonNull(agent.getWorkflowId())) {
      Workflow workflow = workflowQuery.findById(agent.getWorkflowId());
      if (nonNull(workflow)) {
        vo.setWorkflow(new ResourceInfoVo(workflow.getId(), workflow.getName()));
      }
    }
    if (isNotEmpty(agent.getDatasetIds())) {
      List<Dataset> datasets = datasetQuery.findById(agent.getDatasetIds());
      vo.setDatasets(datasets.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
          .collect(Collectors.toList()));
    }
    if (isNotEmpty(agent.getKnowledgeBaseIds())) {
      List<KnowledgeBase> knowledgeBases = knowledgeBaseQuery.findById(agent.getKnowledgeBaseIds());
      vo.setKnowledgeBases(
          knowledgeBases.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
              .collect(Collectors.toList()));
    }
    if (isNotEmpty(agent.getApiCollectionIds())) {
      List<ApiCollection> apiCollections = apiCollectionQuery.findById(agent.getApiCollectionIds());
      vo.setApiCollections(
          apiCollections.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
              .collect(Collectors.toList()));
    }
    return vo;
  }
}
