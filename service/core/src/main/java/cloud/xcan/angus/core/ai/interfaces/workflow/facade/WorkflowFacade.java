package cloud.xcan.angus.core.ai.interfaces.workflow.facade;

import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowStopDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowToggleDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowVersionVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStopResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowToggleResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowRestoreResultVo;
import cloud.xcan.angus.remote.PageResult;

public interface WorkflowFacade {

  /**
   * 创建工作流
   */
  WorkflowDetailVo create(WorkflowCreateDto dto);

  /**
   * 更新工作流基本信息
   */
  WorkflowDetailVo update(Long id, WorkflowUpdateDto dto);

  /**
   * 更新工作流配置
   */
  WorkflowDetailVo updateConfig(Long id, WorkflowConfigUpdateDto dto);

  /**
   * 删除工作流
   */
  void delete(Long id);

  /**
   * 复制工作流
   */
  WorkflowDetailVo duplicate(Long id, WorkflowDuplicateDto dto);

  /**
   * 获取工作流详情
   */
  WorkflowDetailVo getDetail(Long id);

  /**
   * 获取工作流列表
   */
  PageResult<WorkflowListVo> list(WorkflowFindDto dto);

  /**
   * 获取工作流统计
   */
  WorkflowStatisticsVo getStatistics(String period);

  /**
   * 执行工作流
   */
  WorkflowExecuteResultVo execute(Long id, WorkflowExecuteDto dto);

  /**
   * 停止工作流执行
   */
  WorkflowStopResultVo stop(Long id, WorkflowStopDto dto);

  /**
   * 获取执行日志
   */
  PageResult<ExecutionLogVo> getExecutionLogs(WorkflowExecutionLogFindDto dto);

  /**
   * 获取执行详情
   */
  ExecutionDetailVo getExecutionDetail(String executionId);

  /**
   * 获取工作流版本列表
   */
  PageResult<WorkflowVersionVo> getVersions(Long id, Integer pageNo, Integer pageSize);

  /**
   * 获取特定版本
   */
  WorkflowVersionVo getVersion(Long id, Long versionId);

  /**
   * 恢复到特定版本
   */
  WorkflowRestoreResultVo restoreVersion(Long id, Long versionId);

  /**
   * 启用/禁用工作流
   */
  WorkflowToggleResultVo toggle(Long id, WorkflowToggleDto dto);

}
