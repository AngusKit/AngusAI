package cloud.xcan.angus.core.ai.application.cmd.workflow;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;

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
   * 修改工作流可见性
   */
  Workflow modifyVisibility(Long id, Visibility visibility);

  /**
   * 执行工作流
   */
  Workflow execute(Long id, WorkflowExecuteDto dto);

  /**
   * 启动工作流运行
   */
  Workflow start(Long id);

  /**
   * 停止工作流运行
   */
  Workflow stop(Long id);

  /**
   * 删除工作流
   */
  void delete(Long id);

  /**
   * 克隆工作流
   *
   * @param id 源工作流 ID
   * @return 克隆后的新工作流
   */
  Workflow clone(Long id);
}
