package com.agentx.api.controller;

import com.agentx.api.dto.ApiResponse;
import com.agentx.core.agent.AgentRegistry;
import com.agentx.core.agent.definition.AgentDefinition;
import com.agentx.core.agent.definition.AgentDefinitionParser;
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
@RestController
@RequestMapping("/api/v1/agents")
@RequiredArgsConstructor
public class AgentManagementController {

  private final AgentRegistry agentRegistry;

  /**
   * 创建 Agent（JSON Body 为 AgentDefinition）
   */
  @PostMapping
  public ApiResponse<String> createAgent(@Valid @RequestBody AgentDefinition definition) {
    agentRegistry.register(definition);
    return ApiResponse.ok(definition.getId());
  }

  /**
   * 通过 YAML/JSON 字符串创建 Agent
   */
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

  /**
   * 获取已注册 Agent 列表
   */
  @GetMapping
  public ApiResponse<List<String>> listAgents() {
    return ApiResponse.ok(new ArrayList<>(agentRegistry.listAll().keySet()));
  }

  /**
   * 删除 Agent
   */
  @DeleteMapping("/{agentId}")
  public ApiResponse<Void> deleteAgent(@PathVariable String agentId) {
    agentRegistry.unregister(agentId);
    return ApiResponse.ok(null);
  }
}
