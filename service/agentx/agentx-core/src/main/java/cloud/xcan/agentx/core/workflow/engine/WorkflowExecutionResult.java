package cloud.xcan.agentx.core.workflow.engine;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 工作流执行结果
 */
@Data
@Builder
public class WorkflowExecutionResult {

  private String executionId;
  private String workflowId;
  private WorkflowExecutionStatus status;
  private Map<String, Object> output;
  private Instant startedAt;
  private Instant completedAt;
  private long durationMs;
  @Builder.Default
  private List<NodeExecutionRecord> nodeRecords = new ArrayList<>();

  @Data
  @Builder
  public static class NodeExecutionRecord {

    private String nodeId;
    private String nodeType;
    private NodeExecutionStatus status;
    private Map<String, Object> outputs;
    private Instant startedAt;
    private Instant completedAt;
    private long durationMs;
    private String error;
  }
}
