package cloud.xcan.angus.core.ai.domain.workflow;

public enum WorkflowType {

  SINGLE_TASK, // 处理单次任务的流程
  MULTI_TURN, // 支持多轮对话和记忆的流程
  SCHEDULED, // 按定时计划执行的流程
  EVENT_DRIVEN; // 基于事件触发的流程

}
