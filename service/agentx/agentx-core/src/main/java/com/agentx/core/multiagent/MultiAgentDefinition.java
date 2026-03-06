package com.agentx.core.multiagent;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 多 Agent 协作定义
 */
@Data
@Builder
public class MultiAgentDefinition {

  private CollaborationPattern pattern;
  private SupervisorConfig supervisor;
  private List<WorkerConfig> workers;
  private SummarizationConfig summarization;

  @Data
  @Builder
  public static class SupervisorConfig {

    private String agentId;
    @Builder.Default
    private int maxRounds = 5;
  }

  @Data
  @Builder
  public static class WorkerConfig {

    private String agentId;
    private String role;
  }

  @Data
  @Builder
  public static class SummarizationConfig {

    /**
     * LLM_MERGE | CONCAT | LAST_ONLY
     */
    @Builder.Default
    private String strategy = "LLM_MERGE";
  }
}
