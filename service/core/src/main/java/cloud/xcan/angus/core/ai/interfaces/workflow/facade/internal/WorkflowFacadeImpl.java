package cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.workflow.WorkflowCmd;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler.WorkflowAssembler;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class WorkflowFacadeImpl implements WorkflowFacade {

  @Resource
  private WorkflowQuery workflowQuery;

  @Resource
  private WorkflowCmd workflowCmd;

  @Override
  public WorkflowDetailVo create(WorkflowCreateDto dto) {
    Workflow workflow = WorkflowAssembler.toDomain(dto);
    Workflow saved = workflowCmd.create(workflow);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public WorkflowDetailVo update(Long id, WorkflowUpdateDto dto) {
    Workflow workflow = WorkflowAssembler.updateDomain(id, dto);
    Workflow saved = workflowCmd.update(workflow);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public WorkflowDetailVo updateConfig(Long id, WorkflowConfigUpdateDto dto) {
    WorkflowConfig config = WorkflowAssembler.toConfig(dto);
    Workflow saved = workflowCmd.updateConfig(id, config);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public WorkflowDetailVo modifyVisibility(Long id, Visibility visibility) {
    Workflow saved = workflowCmd.modifyVisibility(id, visibility);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public WorkflowExecuteResultVo execute(Long id, WorkflowExecuteDto dto) {
    // 这里应该调用工作流执行服务
    // 暂时返回模拟数据
    WorkflowExecuteResultVo result = new WorkflowExecuteResultVo();
    // TODO: 实现工作流执行逻辑
    return result;
  }

  @Override
  public WorkflowDetailVo start(Long id) {
    Workflow saved = workflowCmd.start(id);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public WorkflowDetailVo stop(Long id) {
    Workflow saved = workflowCmd.stop(id);
    return WorkflowAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    workflowCmd.delete(id);
  }

  @NameJoin
  @Override
  public WorkflowDetailVo getDetail(Long id) {
    Workflow workflow = workflowQuery.findAndCheck(id);
    return WorkflowAssembler.toDetailVo(workflow);
  }

  @NameJoin
  @Override
  public PageResult<WorkflowListVo> list(WorkflowFindDto dto) {
    GenericSpecification<Workflow> spec = WorkflowAssembler.getSpecification(dto);
    Page<Workflow> page = workflowQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, WorkflowAssembler::toListVo);
  }

  @Override
  public WorkflowStatisticsVo getStatistics(String period) {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    WorkflowStatisticsVo statistics = new WorkflowStatisticsVo();
    // TODO: 实现统计逻辑
    return statistics;
  }

  @Override
  public PageResult<ExecutionLogVo> getExecutionLogs(WorkflowExecutionLogFindDto dto) {
    // 这里应该调用执行日志查询服务
    // 暂时返回模拟数据
    PageResult<ExecutionLogVo> result = new PageResult<>();
    // TODO: 实现执行日志查询逻辑
    return result;
  }

  @Override
  public ExecutionDetailVo getExecutionDetail(String executionId) {
    // 这里应该调用执行详情查询服务
    // 暂时返回模拟数据
    ExecutionDetailVo result = new ExecutionDetailVo();
    // TODO: 实现执行详情查询逻辑
    return result;
  }
}
