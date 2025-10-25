package cloud.xcan.angus.core.ai.domain.workflow;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WorkflowStatus {

  DRAFT("草稿", "工作流处于草稿状态"),
  ACTIVE("活跃", "工作流已发布并可用"),
  RUNNING("运行中", "工作流正在执行"),
  PAUSED("暂停", "工作流已暂停"),
  STOPPED("已停止", "工作流已停止"),
  COMPLETED("已完成", "工作流执行完成"),
  FAILED("失败", "工作流执行失败"),
  ARCHIVED("已归档", "工作流已归档"),
  DEPRECATED("已废弃", "工作流已废弃"),
  MAINTENANCE("维护中", "工作流正在维护");

  private final String displayName;
  private final String description;
}
