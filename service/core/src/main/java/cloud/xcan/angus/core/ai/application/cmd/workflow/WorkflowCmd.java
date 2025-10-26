package cloud.xcan.angus.core.ai.application.cmd.workflow;

import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowStopDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowToggleDto;

public interface WorkflowCmd {

  /**
   * 创建工作流
   */
  Workflow create(Workflow workflow);

  /**
   * 更新工作流基本信息
   */
  Workflow update(Workflow workflow);

  /**
   * 更新工作流配置
   */
  Workflow updateConfig(Long id, WorkflowConfig config);

  /**
   * 启用/禁用工作流
   */
  Workflow toggle(Long id, WorkflowToggleDto dto);

  /**
   * 执行工作流
   */
  Workflow execute(Long id, WorkflowExecuteDto dto);

  /**
   * 停止工作流执行
   */
  Workflow stop(Long id, WorkflowStopDto dto);

  /**
   * 恢复到特定版本
   */
  Workflow restoreVersion(Long id, Long versionId);

  /**
   * 恢复工作流
   */
  Workflow restoreWorkflow(Long id, String backupId);

  /**
   * 暂停工作流执行
   */
  Workflow pauseExecution(Long id, String executionId);

  /**
   * 恢复工作流执行
   */
  Workflow resumeExecution(Long id, String executionId);

  /**
   * 取消工作流执行
   */
  Workflow cancelExecution(Long id, String executionId);

  /**
   * 归档工作流
   */
  Workflow archiveWorkflow(Long id);

  /**
   * 取消归档工作流
   */
  Workflow unarchiveWorkflow(Long id);

  /**
   * 更新工作流状态
   */
  Workflow updateStatus(Long id, String status);

  /**
   * 删除工作流
   */
  void delete(Long id);

  /**
   * 复制工作流
   */
  Workflow duplicate(Long id, String name);

  /**
   * 创建工作流版本
   */
  Workflow createVersion(Long id, String description);

  /**
   * 备份工作流
   */
  Workflow backupWorkflow(Long id);

  /**
   * 获取工作流执行状态
   */
  String getExecutionStatus(Long id, String executionId);

  /**
   * 记录工作流执行
   */
  void recordExecution(Long id, String executionId, String status, Long executionTime);

  /**
   * 更新工作流统计
   */
  void updateStatistics(Long id, Long totalExecutions, Long successfulExecutions, 
      Long failedExecutions, Double avgExecutionTime);

  /**
   * 验证工作流配置
   */
  boolean validateConfig(WorkflowConfig config);

  /**
   * 检查工作流依赖
   */
  boolean checkDependencies(Long id);

  /**
   * 验证节点连接
   */
  boolean validateNodeConnections(WorkflowConfig config);

  /**
   * 检查循环依赖
   */
  boolean checkCircularDependencies(WorkflowConfig config);

  /**
   * 检查必需节点
   */
  boolean checkRequiredNodes(WorkflowConfig config);

  /**
   * 生成工作流版本号
   */
  String generateVersionNumber(Long id);

  /**
   * 清理工作流资源
   */
  void cleanupResources(Long id);

  /**
   * 清理过期版本
   */
  void cleanupExpiredVersions(Long id);

  /**
   * 清理过期执行日志
   */
  void cleanupExpiredExecutions(Long id);

  /**
   * 批量操作工作流
   */
  void batchOperation(Long[] ids, String operation);

}