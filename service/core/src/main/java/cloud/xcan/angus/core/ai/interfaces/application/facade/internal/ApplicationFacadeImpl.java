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
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
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
import java.util.List;
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
    return buildVoPageResult(page, app -> ApplicationAssembler.toListVo(app,
        applicationQuery.getAgentIds(app.getId()), applicationQuery.getDefaultAgentId(app.getId())));
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

  private ResourceInfoVo getDefaultAgentVo(Long applicationId) {
    Long defaultAgentId = applicationQuery.getDefaultAgentId(applicationId);
    if (defaultAgentId == null) {
      return null;
    }
    try {
      Agent agent = agentQuery.findAndCheck(defaultAgentId);
      return new ResourceInfoVo(agent.getId(), agent.getName());
    } catch (Exception e) {
      return new ResourceInfoVo(defaultAgentId, "未知");
    }
  }

  private List<ResourceInfoVo> getAgentsVo(Long applicationId) {
    List<Long> agentIds = applicationQuery.getAgentIds(applicationId);
    if (agentIds == null || agentIds.isEmpty()) {
      return List.of();
    }
    return agentIds.stream()
        .map(id -> {
          try {
            Agent agent = agentQuery.findAndCheck(id);
            return new ResourceInfoVo(agent.getId(), agent.getName());
          } catch (Exception e) {
            return new ResourceInfoVo(id, "未知");
          }
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
