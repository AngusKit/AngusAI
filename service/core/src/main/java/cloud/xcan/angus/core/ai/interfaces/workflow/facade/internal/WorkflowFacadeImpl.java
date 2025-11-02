package cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal;

import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.workflow.WorkflowCmd;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowStopDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowToggleDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler.WorkflowAssembler;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowRestoreResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStopResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowToggleResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowVersionVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
  public WorkflowToggleResultVo toggle(Long id, WorkflowToggleDto dto) {
    // 这里应该调用工作流状态切换服务
    // 暂时返回模拟数据
    WorkflowToggleResultVo result = new WorkflowToggleResultVo();
    // TODO: 实现工作流状态切换逻辑
    return result;
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
  public WorkflowStopResultVo stop(Long id, WorkflowStopDto dto) {
    // 这里应该调用工作流停止服务
    // 暂时返回模拟数据
    WorkflowStopResultVo result = new WorkflowStopResultVo();
    // TODO: 实现工作流停止逻辑
    return result;
  }

  @Override
  public WorkflowRestoreResultVo restoreVersion(Long id, Long versionId) {
    // 这里应该调用版本恢复服务
    // 暂时返回模拟数据
    WorkflowRestoreResultVo result = new WorkflowRestoreResultVo();
    // TODO: 实现版本恢复逻辑
    return result;
  }

  @Override
  public void delete(Long id) {
    workflowCmd.delete(id);
  }

  @Override
  public WorkflowDetailVo duplicate(Long id, WorkflowDuplicateDto dto) {
    Workflow saved = workflowCmd.duplicate(id, dto.getName());
    return WorkflowAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public WorkflowDetailVo getDetail(Long id) {
    Workflow workflow = workflowQuery.findById(id);
    return WorkflowAssembler.toDetailVo(workflow);
  }

  @NameJoin
  @Override
  public PageResult<WorkflowListVo> list(WorkflowFindDto dto) {
    GenericSpecification<Workflow> spec = WorkflowAssembler.getSpecification(dto);
    // 使用默认分页参数，因为WorkflowFindDto继承的是SearchCriteria而不是PageQuery
    Page<Workflow> page = workflowQuery.find(spec,
        PageRequest.of(0, 20),
        false,
        null);
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

  @Override
  public PageResult<WorkflowVersionVo> getVersions(Long id, Integer pageNo, Integer pageSize) {
    // 这里应该调用版本查询服务
    // 暂时返回模拟数据
    PageResult<WorkflowVersionVo> result = new PageResult<>();
    // TODO: 实现版本查询逻辑
    return result;
  }

  @Override
  public WorkflowVersionVo getVersion(Long id, Long versionId) {
    // 这里应该调用版本详情查询服务
    // 暂时返回模拟数据
    WorkflowVersionVo result = new WorkflowVersionVo();
    // TODO: 实现版本详情查询逻辑
    return result;
  }
}
