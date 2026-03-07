package cloud.xcan.agentx.core.workflow.engine;

import cloud.xcan.agentx.core.workflow.enums.FailurePolicy;
import cloud.xcan.agentx.core.workflow.enums.NodeType;
import cloud.xcan.agentx.core.workflow.expression.ExpressionEngine;
import cloud.xcan.agentx.core.workflow.dsl.NodeDefinition;
import cloud.xcan.agentx.core.workflow.dsl.WorkflowDefinition;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工作流 DAG 执行引擎 — 拓扑排序 + 顺序执行
 */
@Slf4j
@RequiredArgsConstructor
public class WorkflowEngine {

  private final ExpressionEngine expressionEngine;
  private final Map<String, NodeExecutor> executors;

  /**
   * 通过 Spring 注入所有 NodeExecutor，按 nodeType 索引
   */
  public WorkflowEngine(ExpressionEngine expressionEngine, List<NodeExecutor> executorList) {
    this.expressionEngine = expressionEngine;
    this.executors = executorList.stream()
        .collect(Collectors.toMap(NodeExecutor::getNodeType, e -> e));
  }

  /**
   * 执行工作流
   */
  public WorkflowExecutionResult execute(WorkflowDefinition workflow,
      Map<String, Object> inputVariables) {
    String executionId = UUID.randomUUID().toString();
    Instant startedAt = Instant.now();
    log.info("Workflow execution started: {} ({})", workflow.getName(), executionId);

    // 合并变量
    Map<String, Object> variables = new HashMap<>();
    if (workflow.getVariables() != null) {
      variables.putAll(workflow.getVariables());
    }
    if (inputVariables != null) {
      variables.putAll(inputVariables);
    }

    // 按 ID 索引节点
    Map<String, NodeDefinition> nodeMap = new LinkedHashMap<>();
    for (NodeDefinition node : workflow.getNodes()) {
      nodeMap.put(node.getId(), node);
    }

    // 拓扑排序执行
    List<String> executionOrder = topologicalSort(workflow.getNodes());
    Map<String, Map<String, Object>> nodeOutputs = new ConcurrentHashMap<>();
    List<WorkflowExecutionResult.NodeExecutionRecord> records = new ArrayList<>();

    Map<String, Object> finalOutput = Map.of();

    for (String nodeId : executionOrder) {
      NodeDefinition node = nodeMap.get(nodeId);
      if (node == null) {
        continue;
      }

      Instant nodeStart = Instant.now();
      log.debug("Executing node: {} ({})", nodeId, node.getType());

      try {
        String nodeTypeStr = node.getType() != null ? node.getType().name() : null;
        NodeExecutor executor = nodeTypeStr != null ? executors.get(nodeTypeStr) : null;
        if (executor == null) {
          log.warn("No executor for node type: {}", nodeTypeStr);
          continue;
        }

        NodeExecutionContext ctx = NodeExecutionContext.builder()
            .nodeDefinition(node)
            .variables(variables)
            .nodeOutputs(nodeOutputs)
            .secrets(Map.of())
            .runtimeContext(Map.of())
            .executionId(executionId)
            .build();

        Map<String, Object> outputs = executor.execute(ctx);
        nodeOutputs.put(nodeId, outputs != null ? outputs : Map.of());

        // END 节点的输出就是工作流的最终输出
        if (node.getType() == NodeType.END) {
          finalOutput = outputs != null ? outputs : Map.of();
        }

        Instant nodeEnd = Instant.now();
        records.add(WorkflowExecutionResult.NodeExecutionRecord.builder()
            .nodeId(nodeId)
            .nodeType(node.getType() != null ? node.getType().name() : null)
            .status(NodeExecutionStatus.SUCCESS)
            .outputs(outputs)
            .startedAt(nodeStart)
            .completedAt(nodeEnd)
            .durationMs(nodeEnd.toEpochMilli() - nodeStart.toEpochMilli())
            .build());

      } catch (Exception e) {
        Instant nodeEnd = Instant.now();
        log.error("Node execution failed: {} — {}", nodeId, e.getMessage(), e);

        records.add(WorkflowExecutionResult.NodeExecutionRecord.builder()
            .nodeId(nodeId)
            .nodeType(node.getType() != null ? node.getType().name() : null)
            .status(NodeExecutionStatus.FAILED)
            .error(e.getMessage())
            .startedAt(nodeStart)
            .completedAt(nodeEnd)
            .durationMs(nodeEnd.toEpochMilli() - nodeStart.toEpochMilli())
            .build());

        // 检查全局失败策略
        FailurePolicy failurePolicy = Optional.ofNullable(workflow.getSettings())
            .map(WorkflowDefinition.WorkflowSettings::getOnFailure)
            .orElse(FailurePolicy.STOP);

        if (FailurePolicy.STOP == failurePolicy) {
          Instant endedAt = Instant.now();
          return WorkflowExecutionResult.builder()
              .executionId(executionId)
              .workflowId(workflow.getId())
              .status(WorkflowExecutionStatus.FAILED)
              .output(Map.of("error", e.getMessage()))
              .startedAt(startedAt)
              .completedAt(endedAt)
              .durationMs(endedAt.toEpochMilli() - startedAt.toEpochMilli())
              .nodeRecords(records)
              .build();
        }
        // CONTINUE: 继续执行后续节点
      }
    }

    Instant completedAt = Instant.now();
    log.info("Workflow execution completed: {} in {}ms", executionId,
        completedAt.toEpochMilli() - startedAt.toEpochMilli());

    return WorkflowExecutionResult.builder()
        .executionId(executionId)
        .workflowId(workflow.getId())
        .status(WorkflowExecutionStatus.COMPLETED)
        .output(finalOutput)
        .startedAt(startedAt)
        .completedAt(completedAt)
        .durationMs(completedAt.toEpochMilli() - startedAt.toEpochMilli())
        .nodeRecords(records)
        .build();
  }

  /**
   * 拓扑排序 — 按 next 字段确定执行顺序
   */
  private List<String> topologicalSort(List<NodeDefinition> nodes) {
    // 简单实现：找到 START 节点，沿 next 链遍历
    Map<String, NodeDefinition> nodeMap = new LinkedHashMap<>();
    for (NodeDefinition n : nodes) {
      nodeMap.put(n.getId(), n);
    }

    // 找 START 节点
    String startId = nodes.stream()
        .filter(n -> n.getType() == NodeType.START)
        .map(NodeDefinition::getId)
        .findFirst()
        .orElse(nodes.get(0).getId());

    List<String> order = new ArrayList<>();
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    queue.add(startId);

    while (!queue.isEmpty()) {
      String current = queue.poll();
      if (visited.contains(current)) {
        continue;
      }
      visited.add(current);
      order.add(current);

      NodeDefinition node = nodeMap.get(current);
      if (node == null) {
        continue;
      }

      // 跟踪 next
      if (node.getNext() != null && !visited.contains(node.getNext())) {
        queue.add(node.getNext());
      }

      // 跟踪 CONDITION ifTrue/ifFalse
      if (node.getConfig() != null) {
        Object ifTrue = node.getConfig().get("ifTrue");
        Object ifFalse = node.getConfig().get("ifFalse");
        if (ifTrue instanceof String s && !visited.contains(s)) {
          queue.add(s);
        }
        if (ifFalse instanceof String s && !visited.contains(s)) {
          queue.add(s);
        }

        // PARALLEL branches
        Object branches = node.getConfig().get("branches");
        if (branches instanceof List<?> list) {
          for (Object b : list) {
            if (b instanceof String s && !visited.contains(s)) {
              queue.add(s);
            }
          }
        }
      }
    }

    // 添加未被 next 链覆盖的孤立节点
    for (NodeDefinition n : nodes) {
      if (!visited.contains(n.getId())) {
        order.add(n.getId());
      }
    }

    return order;
  }
}
