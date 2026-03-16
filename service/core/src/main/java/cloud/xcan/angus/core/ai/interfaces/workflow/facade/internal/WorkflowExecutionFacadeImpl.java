package cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal;

import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.workflow.WorkflowCmd;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowExecutionQuery;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowExecution;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowExecutionFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler.WorkflowAssembler;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class WorkflowExecutionFacadeImpl implements WorkflowExecutionFacade {

  @Resource
  private WorkflowQuery workflowQuery;

  @Resource
  private WorkflowCmd workflowCmd;

  @Resource
  private WorkflowExecutionQuery workflowExecutionQuery;

  @Override
  public WorkflowExecuteResultVo execute(Long id, WorkflowExecuteDto dto) {
    // 这里应该调用工作流执行服务
    // 暂时返回模拟数据
    WorkflowExecuteResultVo result = new WorkflowExecuteResultVo();
    // TODO: 实现工作流执行逻辑
    return result;
  }

  @Override
  public PageResult<ExecutionLogVo> getExecutionLogs(WorkflowExecutionLogFindDto dto) {
    Page<WorkflowExecution> page = workflowExecutionQuery.findExecutionLogs(dto);
    return buildVoPageResult(page, WorkflowAssembler::toExecutionLogVo);
  }

  @Override
  public ExecutionDetailVo getExecutionDetail(String executionId) {
    return workflowExecutionQuery.findByExecutionId(executionId)
        .map(WorkflowAssembler::toExecutionDetailVo)
        .orElseThrow(() -> ResourceNotFound.of(
            "执行记录「{0}」不存在", new Object[]{executionId}));
  }
}
