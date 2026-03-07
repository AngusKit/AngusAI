package cloud.xcan.agentx.api.controller;

import cloud.xcan.agentx.api.dto.ApiResponse;
import cloud.xcan.core.agent.AgentRegistry;
import cloud.xcan.core.agent.definition.AgentDefinition;
import cloud.xcan.core.agent.definition.AgentDefinitionParser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Agent CRUD 管理接口
 */
@Tag(name = "Agent", description = "Agent 管理 - 创建、导入、列表、删除")
@RestController
@RequestMapping("/api/v1/agents")
@RequiredArgsConstructor
public class AgentManagementController {

  private final AgentRegistry agentRegistry;

  @Operation(operationId = "createAgent", summary = "创建 Agent", description = "通过 AgentDefinition JSON 创建并注册 Agent")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功，返回 Agent ID"),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "请求体无效", content = @Content(schema = @Schema(hidden = true)))
  })
  @PostMapping
  public ApiResponse<String> createAgent(@Valid @RequestBody AgentDefinition definition) {
    agentRegistry.register(definition);
    return ApiResponse.ok(definition.getId());
  }

  @Operation(operationId = "importAgent", summary = "导入 Agent", description = "通过 YAML/JSON 字符串创建并注册 Agent")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "导入成功，返回 Agent ID"),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "定义格式无效", content = @Content(schema = @Schema(hidden = true)))
  })
  @PostMapping("/import")
  public ApiResponse<String> importAgent(@RequestBody String definitionText) {
    try {
      AgentDefinitionParser parser = new AgentDefinitionParser();
      AgentDefinition definition = parser.parseJson(definitionText);
      agentRegistry.register(definition);
      return ApiResponse.ok(definition.getId());
    } catch (java.io.IOException e) {
      return ApiResponse.error(400, "Invalid agent definition: " + e.getMessage());
    }
  }

  @Operation(operationId = "listAgents", summary = "获取 Agent 列表", description = "获取已注册的 Agent ID 列表")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "列表获取成功")
  })
  @GetMapping
  public ApiResponse<List<String>> listAgents() {
    return ApiResponse.ok(new ArrayList<>(agentRegistry.listAll().keySet()));
  }

  @Operation(operationId = "deleteAgent", summary = "删除 Agent", description = "注销并删除指定 Agent")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
  })
  @DeleteMapping("/{agentId}")
  public ApiResponse<Void> deleteAgent(
      @Parameter(description = "Agent 唯一标识") @PathVariable String agentId) {
    agentRegistry.unregister(agentId);
    return ApiResponse.ok(null);
  }
}
