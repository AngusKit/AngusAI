package cloud.xcan.core.agent.multi;

import cloud.xcan.core.agent.enums.CollaborationPattern;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * 多 Agent 协作定义
 */
@Schema(description = "多 Agent 协作定义")
@Data
@Builder
public class MultiAgentDefinition {

  @Schema(description = "协作模式：ROUTER/SUPERVISOR/SWARM/SEQUENTIAL")
  private CollaborationPattern pattern;
  @Schema(description = "监督者配置")
  private SupervisorConfig supervisor;
  @Schema(description = "工作者 Agent 列表")
  private List<WorkerConfig> workers;
  @Schema(description = "结果汇总配置")
  private SummarizationConfig summarization;

  @Schema(description = "监督者配置")
  @Data
  @Builder
  public static class SupervisorConfig {

    @Schema(description = "监督者 Agent ID")
    private String agentId;
    @Schema(description = "最大轮次")
    @Builder.Default
    private int maxRounds = 5;
  }

  @Schema(description = "工作者配置")
  @Data
  @Builder
  public static class WorkerConfig {

    @Schema(description = "工作者 Agent ID")
    private String agentId;
    @Schema(description = "角色描述")
    private String role;
  }

  @Schema(description = "结果汇总配置")
  @Data
  @Builder
  public static class SummarizationConfig {

    @Schema(description = "汇总策略：LLM_MERGE/CONCAT/LAST_ONLY")
    @Builder.Default
    private String strategy = "LLM_MERGE";
  }
}
