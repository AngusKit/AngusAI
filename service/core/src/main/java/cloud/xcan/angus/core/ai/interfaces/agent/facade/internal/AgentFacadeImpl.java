package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;


import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;
import static java.util.Collections.emptyMap;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isEmpty;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentAssembler;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentCountVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo.AgentResourcesVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo.ResourceInfoVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AgentFacadeImpl implements AgentFacade {

  @Resource
  private AgentCmd agentCmd;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private WorkflowQuery workflowQuery;

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Resource
  private ModelQuery modelQuery;

  @NameJoin
  @Override
  public AgentDetailVo create(AgentCreateDto dto) {
    Agent agent = AgentAssembler.toDomain(dto);
    Agent saved = agentCmd.create(agent);
    return AgentAssembler.toDetailVo(saved, getAgentResourcesVo(saved), getDefaultModelVo(saved));
  }

  @NameJoin
  @Override
  public AgentDetailVo update(Long id, AgentUpdateDto dto) {
    Agent existing = agentQuery.findAndCheck(id);
    AgentAssembler.mergeUpdate(existing, dto);
    Agent saved = agentCmd.update(existing);
    return AgentAssembler.toDetailVo(saved, getAgentResourcesVo(saved), getDefaultModelVo(saved));
  }

  @NameJoin
  @Override
  public AgentDetailVo updateStatus(Long id, AgentStatus status) {
    Agent updated = agentCmd.updateStatus(id, status);
    return AgentAssembler.toDetailVo(updated, getAgentResourcesVo(updated),
        getDefaultModelVo(updated));
  }

  @Override
  public void delete(Long id) {
    agentCmd.delete(id);
  }

  @NameJoin
  @Override
  public AgentDetailVo getDetail(Long id) {
    Agent agent = agentQuery.findAndCheck(id);
    return AgentAssembler.toDetailVo(agent, getAgentResourcesVo(agent), getDefaultModelVo(agent));
  }

  @NameJoin
  @Override
  public PageResult<AgentListVo> list(AgentFindDto dto) {
    GenericSpecification<Agent> spec = AgentAssembler.getSpecification(dto);
    Page<Agent> page = agentQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    Map<Long, ResourceInfoVo> defaultModelVos = getDefaultModelVos(page.getContent());
    return buildVoPageResult(page,
        x -> AgentAssembler.toListVo(x, defaultModelVos.get(x.getDefaultModelId())));
  }

  @Override
  public AgentCountVo getCounts() {
    return agentQuery.getCurrentUserCounts();
  }

  private ResourceInfoVo getDefaultModelVo(Agent agent) {
    if (agent.getDefaultModelId() == null) {
      return null;
    }
    return modelQuery.findById(agent.getDefaultModelId())
        .map(m -> new ResourceInfoVo(m.getId(), m.getName()))
        .orElse(null);
  }

  private Map<Long, ResourceInfoVo> getDefaultModelVos(List<Agent> agents) {
    if (isEmpty(agents)) {
      return emptyMap();
    }
    Set<Long> defaultModelIds = agents.stream().map(Agent::getDefaultModelId)
        .filter(Objects::nonNull).collect(Collectors.toSet());
    if (isEmpty(defaultModelIds)) {
      return emptyMap();
    }
    return modelQuery.findByIds(defaultModelIds).stream()
        .collect(Collectors.toMap(Model::getId, m -> new ResourceInfoVo(m.getId(), m.getName())));
  }

  private AgentResourcesVo getAgentResourcesVo(Agent agent) {
    AgentResourcesVo vo = new AgentResourcesVo();
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
