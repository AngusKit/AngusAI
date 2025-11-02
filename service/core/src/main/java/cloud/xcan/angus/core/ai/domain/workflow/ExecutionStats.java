package cloud.xcan.angus.core.ai.domain.workflow;

import lombok.Data;

@Data
public class ExecutionStats {

  private Long totalExecutions = 0L;

  private Long successfulExecutions = 0L;

  private Long failedExecutions = 0L;

  private Double avgExecutionTime = 0.0;

  private Long lastExecutionTime;

  private String lastExecutionStatus;

}
