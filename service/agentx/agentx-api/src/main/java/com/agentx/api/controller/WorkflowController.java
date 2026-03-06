package com.agentx.api.controller;

import com.agentx.api.dto.ApiResponse;
import com.agentx.api.dto.WorkflowRunRequest;
import com.agentx.core.workflow.WorkflowDefinitionProvider;
import com.agentx.core.workflow.dsl.WorkflowDefinition;
import com.agentx.core.workflow.dsl.WorkflowDslParser;
import com.agentx.core.workflow.engine.WorkflowEngine;
import com.agentx.core.workflow.engine.WorkflowExecutionResult;
import com.agentx.core.workflow.validation.NodeTypeSpec;
import com.agentx.core.workflow.validation.ValidationResult;
import com.agentx.core.workflow.validation.WorkflowSpecRegistry;
import com.agentx.core.workflow.validation.WorkflowValidator;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workflow 管理、验证与执行接口
 */
@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowController {

  private final WorkflowEngine workflowEngine;
  private final WorkflowValidator workflowValidator;
  private final WorkflowSpecRegistry workflowSpecRegistry;
  private final WorkflowDefinitionProvider workflowDefinitionProvider;

  public WorkflowController(WorkflowEngine workflowEngine,
      WorkflowValidator workflowValidator,
      WorkflowSpecRegistry workflowSpecRegistry,
      WorkflowDefinitionProvider workflowDefinitionProvider) {
    this.workflowEngine = workflowEngine;
    this.workflowValidator = workflowValidator;
    this.workflowSpecRegistry = workflowSpecRegistry;
    this.workflowDefinitionProvider = workflowDefinitionProvider;
  }

  /**
   * 导入 Workflow（JSON/YAML 字符串）— 自动触发验证
   */
  @PostMapping("/import")
  public ApiResponse<String> importWorkflow(@RequestBody String definitionText) {
    try {
      WorkflowDslParser parser = new WorkflowDslParser();
      WorkflowDefinition definition = parser.parseJson(definitionText);

      ValidationResult validation = workflowValidator.validate(definition);
      if (!validation.isValid()) {
        return ApiResponse.error(400,
            "Workflow validation failed: " + validation.getErrors());
      }

      workflowDefinitionProvider.register(definition);
      return ApiResponse.ok(definition.getId());
    } catch (java.io.IOException e) {
      return ApiResponse.error(400, "Invalid workflow definition: " + e.getMessage());
    }
  }

  /**
   * 验证 Workflow 脚本（不导入，仅检查）
   */
  @PostMapping("/validate")
  public ApiResponse<ValidationResult> validateWorkflow(@RequestBody String definitionText) {
    try {
      WorkflowDslParser parser = new WorkflowDslParser();
      WorkflowDefinition definition = parser.parseJson(definitionText);
      ValidationResult result = workflowValidator.validate(definition);
      return ApiResponse.ok(result);
    } catch (java.io.IOException e) {
      return ApiResponse.error(400, "Parse error: " + e.getMessage());
    }
  }

  /**
   * 获取工作流 DSL 规范 — 列出所有节点类型及其参数说明
   */
  @GetMapping("/spec")
  public ApiResponse<List<NodeTypeSpec>> getWorkflowSpec() {
    return ApiResponse.ok(workflowSpecRegistry.getAllSpecs());
  }

  /**
   * 获取指定节点类型的规范
   */
  @GetMapping("/spec/{nodeType}")
  public ApiResponse<NodeTypeSpec> getNodeTypeSpec(@PathVariable String nodeType) {
    return workflowSpecRegistry.getSpec(nodeType)
        .map(ApiResponse::ok)
        .orElse(ApiResponse.error(404, "Unknown node type: " + nodeType));
  }

  /**
   * 执行 Workflow
   */
  @PostMapping("/run")
  public ApiResponse<WorkflowExecutionResult> runWorkflow(
      @Valid @RequestBody WorkflowRunRequest request) {
    WorkflowDefinition definition = workflowDefinitionProvider.loadById(request.getWorkflowId())
        .orElse(null);
    if (definition == null) {
      return ApiResponse.error(404, "Workflow not found: " + request.getWorkflowId());
    }
    Map<String, Object> variables =
        request.getVariables() != null ? request.getVariables() : Map.of();
    WorkflowExecutionResult result = workflowEngine.execute(definition, variables);
    return ApiResponse.ok(result);
  }

  /**
   * 列出已注册的 Workflow
   */
  @GetMapping
  public ApiResponse<Set<String>> listWorkflows() {
    Set<String> ids = workflowDefinitionProvider.loadAll().stream()
        .map(WorkflowDefinition::getId)
        .collect(Collectors.toSet());
    return ApiResponse.ok(ids);
  }
}
