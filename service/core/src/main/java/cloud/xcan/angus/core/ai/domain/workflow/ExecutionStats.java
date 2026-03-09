package cloud.xcan.angus.core.ai.domain.workflow;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ExecutionStats {

  private Long totalExecutions = 0L;

  private Long successfulExecutions = 0L;

  private Long failedExecutions = 0L;

  private Integer avgExecutionTime = 0;

  private LocalDateTime lastExecutionTime;

  private String lastExecutionStatus;

}
