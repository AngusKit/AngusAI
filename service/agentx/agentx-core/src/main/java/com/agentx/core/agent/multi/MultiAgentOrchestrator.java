package com.agentx.core.agent.multi;

import com.agentx.core.agent.AgentRegistry;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 多 Agent 编排器 — 实现四种协作模式
 */
@Slf4j
@RequiredArgsConstructor
public class MultiAgentOrchestrator {

  private final AgentRegistry agentRegistry;

  /**
   * 执行多 Agent 协作
   */
  public String execute(MultiAgentDefinition definition, String sessionId, String input) {
    return switch (definition.getPattern()) {
      case ROUTER -> executeRouter(definition, sessionId, input);
      case SUPERVISOR -> executeSupervisor(definition, sessionId, input);
      case SWARM -> executeSwarm(definition, sessionId, input);
      case SEQUENTIAL -> executeSequential(definition, sessionId, input);
    };
  }

  /**
   * Router 模式 — 路由 Agent 决定分发给哪个专家
   */
  private String executeRouter(MultiAgentDefinition def, String sessionId, String input) {
    log.info("Router pattern: routing input to best matching worker");

    // 使用 supervisor/router agent 进行意图分类
    String routerAgentId = def.getSupervisor().getAgentId();
    String workerList = def.getWorkers().stream()
        .map(w -> w.getAgentId() + ": " + w.getRole())
        .collect(Collectors.joining("\n"));

    String routingPrompt = "Based on the user input, select the most suitable agent:\n" +
        workerList + "\nUser input: " + input + "\nRespond with just the agentId.";

    String selectedAgentId = agentRegistry.chat(routerAgentId, sessionId, routingPrompt).trim();

    // 如果返回的不是有效 agentId，使用第一个 worker
    boolean found = def.getWorkers().stream().anyMatch(w -> w.getAgentId().equals(selectedAgentId));
    String targetId = found ? selectedAgentId : def.getWorkers().get(0).getAgentId();

    return agentRegistry.chat(targetId, sessionId, input);
  }

  /**
   * Supervisor 模式 — 主管 Agent 分解任务分配给 Worker
   */
  private String executeSupervisor(MultiAgentDefinition def, String sessionId, String input) {
    log.info("Supervisor pattern: delegating tasks to workers");

    String supervisorId = def.getSupervisor().getAgentId();
    int maxRounds = def.getSupervisor().getMaxRounds();

    List<String> workerResults = new ArrayList<>();

    for (int round = 0; round < maxRounds; round++) {
      // Supervisor 分析任务并分配
      String assignmentPrompt = "Task: " + input + "\nRound: " + (round + 1) +
          "\nPrevious results:\n" + String.join("\n", workerResults) +
          "\nAvailable workers:\n" + def.getWorkers().stream()
          .map(w -> w.getAgentId() + " (" + w.getRole() + ")")
          .collect(Collectors.joining(", ")) +
          "\nAssign next task or say DONE if complete.";

      String assignment = agentRegistry.chat(supervisorId, sessionId, assignmentPrompt);

      if (assignment.toUpperCase().contains("DONE")) {
        break;
      }

      // 分配给所有 worker 并收集结果
      for (var worker : def.getWorkers()) {
        String result = agentRegistry.chat(worker.getAgentId(), sessionId, assignment);
        workerResults.add(worker.getAgentId() + ": " + result);
      }
    }

    // 汇总
    return summarize(def, supervisorId, sessionId, workerResults);
  }

  /**
   * Swarm 模式 — Agent 之间动态交接
   */
  private String executeSwarm(MultiAgentDefinition def, String sessionId, String input) {
    log.info("Swarm pattern: agents handoff control dynamically");

    String current = input;
    String currentAgentId = def.getWorkers().get(0).getAgentId();

    for (int i = 0; i < def.getWorkers().size(); i++) {
      current = agentRegistry.chat(currentAgentId, sessionId, current);

      // 检查是否需要交接给下一个 agent
      if (i < def.getWorkers().size() - 1) {
        currentAgentId = def.getWorkers().get(i + 1).getAgentId();
      }
    }

    return current;
  }

  /**
   * Sequential 模式 — 链式传递
   */
  private String executeSequential(MultiAgentDefinition def, String sessionId, String input) {
    log.info("Sequential pattern: chaining agents");

    String current = input;
    for (var worker : def.getWorkers()) {
      current = agentRegistry.chat(worker.getAgentId(), sessionId, current);
    }
    return current;
  }

  private String summarize(MultiAgentDefinition def, String supervisorId,
      String sessionId, List<String> results) {
    String strategy = def.getSummarization() != null ?
        def.getSummarization().getStrategy() : "CONCAT";

    return switch (strategy) {
      case "LLM_MERGE" -> agentRegistry.chat(supervisorId, sessionId,
          "Summarize the following results:\n" + String.join("\n", results));
      case "LAST_ONLY" -> results.isEmpty() ? "" : results.get(results.size() - 1);
      default -> String.join("\n\n", results); // CONCAT
    };
  }
}
