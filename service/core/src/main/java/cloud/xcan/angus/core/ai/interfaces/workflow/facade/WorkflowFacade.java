package cloud.xcan.angus.core.ai.interfaces.workflow.facade;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStatisticsVo;
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
   * 修改工作流可见性
   */
  WorkflowDetailVo modifyVisibility(Long id, Visibility visibility);

  /**
   * 启动工作流运行
   */
  WorkflowDetailVo start(Long id);

  /**
   * 停止工作流运行
   */
  WorkflowDetailVo stop(Long id);

  /**
   * 删除工作流
   */
  void delete(Long id);

  /**
   * 克隆工作流
   *
   * @param id 源工作流 ID
   * @return 克隆后的新工作流详情
   */
  WorkflowDetailVo clone(Long id);

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

}
