package cloud.xcan.angus.core.ai.domain.workflow;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WorkflowType {

  SINGLE_TASK("单轮任务流", "处理单次任务的流程"),
  MULTI_TURN("多轮对话流", "支持多轮对话和记忆的流程"),
  BATCH_PROCESSING("批量处理流", "处理批量数据的流程"),
  REAL_TIME("实时处理流", "实时数据处理的流程"),
  SCHEDULED("定时任务流", "按计划执行的流程"),
  EVENT_DRIVEN("事件驱动流", "基于事件触发的流程"),
  CONDITIONAL("条件分支流", "包含条件判断的流程"),
  PARALLEL("并行处理流", "支持并行执行的流程"),
  SEQUENTIAL("顺序执行流", "按顺序执行的流程"),
  HYBRID("混合类型流", "包含多种执行模式的流程");

  private final String displayName;
  private final String description;
}
