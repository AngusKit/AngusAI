package com.agentx.core.workflow.validation;

import com.agentx.core.workflow.dsl.NodeDefinition;
import com.agentx.core.workflow.dsl.WorkflowDefinition;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;

/**
 * 工作流脚本验证器 — 在执行前对 WorkflowDefinition 进行全面校验。
 * <p>
 * 校验项包括：结构完整性、节点类型合法性、DAG 连通性与环检测、 节点配置必填字段、引用一致性等。
 * </p>
 */
@Slf4j
public class WorkflowValidator {

  /**
   * 所有合法节点类型
   */
  private static final Set<String> VALID_NODE_TYPES = Set.of(
      "START", "END", "LLM", "AGENT", "TOOL", "HTTP", "CODE",
      "CONDITION", "SWITCH", "LOOP", "WHILE", "PARALLEL",
      "WAIT", "SUB_WORKFLOW", "SET_VARIABLE", "KNOWLEDGE_RETRIEVAL"
  );

  /**
   * 需要 config 字段的节点类型和对应必填 key
   */
  private static final Map<String, List<String>> REQUIRED_CONFIG_KEYS = Map.ofEntries(
      Map.entry("LLM", List.of("prompt")),
      Map.entry("AGENT", List.of("agentId")),
      Map.entry("TOOL", List.of("toolId")),
      Map.entry("HTTP", List.of("url")),
      Map.entry("CODE", List.of("language", "script")),
      Map.entry("CONDITION", List.of("expression", "ifTrue", "ifFalse")),
      Map.entry("SWITCH", List.of("expression", "cases")),
      Map.entry("LOOP", List.of("items", "body")),
      Map.entry("WHILE", List.of("condition", "body")),
      Map.entry("PARALLEL", List.of("branches")),
      Map.entry("SUB_WORKFLOW", List.of("workflowId")),
      Map.entry("SET_VARIABLE", List.of("assignments")),
      Map.entry("KNOWLEDGE_RETRIEVAL", List.of("query"))
  );

  /**
   * 验证工作流定义
   */
  public ValidationResult validate(WorkflowDefinition workflow) {
    ValidationResult result = new ValidationResult();

    // 1. 基本字段校验
    validateBasicFields(workflow, result);

    if (workflow.getNodes() == null || workflow.getNodes().isEmpty()) {
      result.addError(null, "W001", "Workflow must have at least one node");
      return result;
    }

    // 2. 节点相关校验
    Map<String, NodeDefinition> nodeMap = new LinkedHashMap<>();
    Set<String> duplicateIds = new HashSet<>();
    for (NodeDefinition node : workflow.getNodes()) {
      if (node.getId() == null || node.getId().isBlank()) {
        result.addError(null, "N001", "Node is missing required field: id");
        continue;
      }
      if (nodeMap.containsKey(node.getId())) {
        duplicateIds.add(node.getId());
      }
      nodeMap.put(node.getId(), node);
    }

    for (String dupId : duplicateIds) {
      result.addError(dupId, "N002", "Duplicate node id: " + dupId);
    }

    // 3. START / END 节点校验
    validateStartEnd(workflow.getNodes(), result);

    // 4. 逐节点校验
    for (NodeDefinition node : workflow.getNodes()) {
      if (node.getId() == null) {
        continue;
      }
      validateNode(node, nodeMap, result);
    }

    // 5. DAG 连通性和环检测
    validateGraph(workflow.getNodes(), nodeMap, result);

    log.info("Workflow validation complete: {} errors, {} warnings",
        result.getErrors().size(), result.getWarnings().size());
    return result;
  }

  private void validateBasicFields(WorkflowDefinition workflow, ValidationResult result) {
    if (workflow.getId() == null || workflow.getId().isBlank()) {
      result.addError(null, "W002", "Workflow is missing required field: id");
    }
    if (workflow.getName() == null || workflow.getName().isBlank()) {
      result.addWarning(null, "W003", "Workflow is missing recommended field: name");
    }
  }

  private void validateStartEnd(List<NodeDefinition> nodes, ValidationResult result) {
    long startCount = nodes.stream().filter(n -> "START".equals(n.getType())).count();
    long endCount = nodes.stream().filter(n -> "END".equals(n.getType())).count();

    if (startCount == 0) {
      result.addError(null, "W004", "Workflow must have exactly one START node");
    } else if (startCount > 1) {
      result.addError(null, "W005", "Workflow has multiple START nodes (expected exactly 1)");
    }

    if (endCount == 0) {
      result.addWarning(null, "W006",
          "Workflow has no END node — execution may not terminate cleanly");
    }
  }

  private void validateNode(NodeDefinition node, Map<String, NodeDefinition> nodeMap,
      ValidationResult result) {
    // 类型校验
    if (node.getType() == null || node.getType().isBlank()) {
      result.addError(node.getId(), "N003", "Node is missing required field: type");
      return;
    }
    if (!VALID_NODE_TYPES.contains(node.getType())) {
      result.addError(node.getId(), "N004",
          "Unknown node type: " + node.getType() + ". Valid types: " + VALID_NODE_TYPES);
    }

    // next 引用校验
    if (node.getNext() != null && !nodeMap.containsKey(node.getNext())) {
      result.addError(node.getId(), "N005",
          "Node references non-existent next node: " + node.getNext());
    }

    // config 必填字段校验
    List<String> requiredKeys = REQUIRED_CONFIG_KEYS.get(node.getType());
    if (requiredKeys != null) {
      Map<String, Object> config = node.getConfig();
      if (config == null || config.isEmpty()) {
        result.addError(node.getId(), "N006",
            "Node of type " + node.getType() + " requires config with keys: " + requiredKeys);
      } else {
        for (String key : requiredKeys) {
          if (!config.containsKey(key)) {
            result.addError(node.getId(), "N007",
                "Node config missing required key '" + key + "' for type " + node.getType());
          }
        }
      }
    }

    // CONDITION / SWITCH 分支引用校验
    if ("CONDITION".equals(node.getType()) && node.getConfig() != null) {
      validateBranchRef(node, "ifTrue", nodeMap, result);
      validateBranchRef(node, "ifFalse", nodeMap, result);
    }
    if ("SWITCH".equals(node.getType()) && node.getConfig() != null) {
      Object cases = node.getConfig().get("cases");
      if (cases instanceof Map<?, ?> caseMap) {
        for (Object target : caseMap.values()) {
          if (target instanceof String s && !nodeMap.containsKey(s)) {
            result.addError(node.getId(), "N008",
                "SWITCH case references non-existent node: " + s);
          }
        }
      }
    }

    // PARALLEL 分支引用校验
    if ("PARALLEL".equals(node.getType()) && node.getConfig() != null) {
      Object branches = node.getConfig().get("branches");
      if (branches instanceof List<?> list) {
        for (Object b : list) {
          if (b instanceof String s && !nodeMap.containsKey(s)) {
            result.addError(node.getId(), "N009",
                "PARALLEL branch references non-existent node: " + s);
          }
        }
      }
    }

    // Timeout 校验
    if (node.getTimeout() != null && node.getTimeout() <= 0) {
      result.addWarning(node.getId(), "N010",
          "Node timeout should be positive, got: " + node.getTimeout());
    }
  }

  private void validateBranchRef(NodeDefinition node, String key,
      Map<String, NodeDefinition> nodeMap, ValidationResult result) {
    Object ref = node.getConfig().get(key);
    if (ref instanceof String s && !nodeMap.containsKey(s)) {
      result.addError(node.getId(), "N008",
          "CONDITION " + key + " references non-existent node: " + s);
    }
  }

  /**
   * 环检测 — DFS 着色法
   */
  private void validateGraph(List<NodeDefinition> nodes, Map<String, NodeDefinition> nodeMap,
      ValidationResult result) {
    // Build adjacency
    Map<String, List<String>> adj = new HashMap<>();
    for (NodeDefinition node : nodes) {
      if (node.getId() == null) {
        continue;
      }
      List<String> neighbors = new ArrayList<>();
      if (node.getNext() != null) {
        neighbors.add(node.getNext());
      }
      if (node.getConfig() != null) {
        addRefIfString(neighbors, node.getConfig().get("ifTrue"));
        addRefIfString(neighbors, node.getConfig().get("ifFalse"));
        Object branches = node.getConfig().get("branches");
        if (branches instanceof List<?> list) {
          for (Object b : list) {
            addRefIfString(neighbors, b);
          }
        }
      }
      adj.put(node.getId(), neighbors);
    }

    // DFS cycle detection
    Map<String, Integer> color = new HashMap<>(); // 0=white, 1=gray, 2=black
    for (String id : adj.keySet()) {
      color.put(id, 0);
    }

    for (String id : adj.keySet()) {
      if (color.get(id) == 0) {
        if (hasCycle(id, adj, color)) {
          result.addError(null, "W007",
              "Workflow graph contains a cycle (detected from node: " + id + ")");
          break;
        }
      }
    }

    // 可达性：检查从 START 能否到达 END（先取节点再取 id，避免 getId() 为 null 时 Optional.of 抛 NPE）
    String startId = nodes.stream()
        .filter(n -> "START".equals(n.getType()))
        .findFirst()
        .map(NodeDefinition::getId)
        .orElse(null);
    if (startId != null) {
      Set<String> reachable = new HashSet<>();
      Queue<String> queue = new LinkedList<>();
      queue.add(startId);
      while (!queue.isEmpty()) {
        String cur = queue.poll();
        if (!reachable.add(cur)) {
          continue;
        }
        List<String> neighbors = adj.getOrDefault(cur, List.of());
        queue.addAll(neighbors);
      }

      // 检查孤立节点
      for (NodeDefinition node : nodes) {
        if (node.getId() != null && !reachable.contains(node.getId())) {
          result.addWarning(node.getId(), "N011",
              "Node is unreachable from START");
        }
      }
    }
  }

  private boolean hasCycle(String id, Map<String, List<String>> adj, Map<String, Integer> color) {
    color.put(id, 1);
    for (String neighbor : adj.getOrDefault(id, List.of())) {
      Integer c = color.get(neighbor);
      if (c == null) {
        continue;
      }
      if (c == 1) {
        return true;
      }
      if (c == 0 && hasCycle(neighbor, adj, color)) {
        return true;
      }
    }
    color.put(id, 2);
    return false;
  }

  private void addRefIfString(List<String> list, Object ref) {
    if (ref instanceof String s && !s.isBlank()) {
      list.add(s);
    }
  }
}
