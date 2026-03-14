package cloud.xcan.angus.core.ai.interfaces.workflow.facade;

import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.remote.PageResult;

public interface WorkflowExecutionFacade {

  /**
   * 执行工作流
   */
  WorkflowExecuteResultVo execute(Long id, WorkflowExecuteDto dto);

  /**
   * 获取执行日志
   */
  PageResult<ExecutionLogVo> getExecutionLogs(WorkflowExecutionLogFindDto dto);

  /**
   * 获取执行详情
   */
  ExecutionDetailVo getExecutionDetail(String executionId);

}
