package cloud.xcan.angus.core.ai.interfaces.application.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.application.Application;
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

  @Override
  public ApplicationDetailVo create(ApplicationCreateDto dto) {
    Application application = ApplicationAssembler.toCreateDomain(dto);
    Application saved = applicationCmd.create(application);
    return ApplicationAssembler.toDetailVo(saved, null);
  }

  @Override
  public ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto) {
    Application saved = applicationCmd.duplicate(id, dto.getName());
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @Override
  public ApplicationDetailVo update(Long id, ApplicationUpdateDto dto) {
    Application application = ApplicationAssembler.toUpdateDomain(id, dto);
    Application saved = applicationCmd.update(application);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @Override
  public ApplicationDetailVo updateConfig(Long id, ApplicationConfig config) {
    Application saved = applicationCmd.updateConfig(id, config);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @Override
  public ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status) {
    Application saved = applicationCmd.modifyStatus(id, status);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @Override
  public ApplicationDetailVo share(Long id, ApplicationShareDto dto) {
    Application application = ApplicationAssembler.shareDomain(id, dto);
    Application saved = applicationCmd.share(application);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @Override
  public void delete(Long id) {
    applicationCmd.delete(id);
  }

  @NameJoin
  @Override
  public ApplicationDetailVo getDetail(Long id) {
    Application saved = applicationQuery.findAndCheck(id);
    return ApplicationAssembler.toDetailVo(saved, getResourcesConfigVo(saved));
  }

  @NameJoin
  @Override
  public PageResult<ApplicationListVo> list(ApplicationFindDto dto) {
    GenericSpecification<Application> spec = ApplicationAssembler.getSpecification(dto);
    Page<Application> page = applicationQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ApplicationAssembler::toListVo);
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

  private ResourcesConfigVo getResourcesConfigVo(Application saved) {
    ResourcesConfigVo vo = new ResourcesConfigVo();
    if (isNotEmpty(saved.getWorkflowId())) {
      Workflow workflow = workflowQuery.findById(saved.getWorkflowId());
      if (nonNull(workflow)) {
        vo.setWorkflow(new ResourceInfoVo(workflow.getId(), workflow.getName()));
      }
    }
    if (isNotEmpty(saved.getDatasetIds())) {
      List<Dataset> datasets = datasetQuery.findById(saved.getDatasetIds());
      vo.setDatasets(datasets.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
          .collect(Collectors.toList()));
    }
    if (isNotEmpty(saved.getKnowledgeBaseIds())) {
      List<KnowledgeBase> knowledgeBases = knowledgeBaseQuery.findById(saved.getKnowledgeBaseIds());
      vo.setKnowledgeBases(
          knowledgeBases.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
              .collect(Collectors.toList()));
    }
    if (isNotEmpty(saved.getApiCollectionIds())) {
      List<ApiCollection> apiCollections = apiCollectionQuery.findById(saved.getApiCollectionIds());
      vo.setApiCollections(
          apiCollections.stream().map(x -> new ResourceInfoVo(x.getId(), x.getName()))
              .collect(Collectors.toList()));
    }
    return vo;
  }
}
