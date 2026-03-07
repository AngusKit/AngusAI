package cloud.xcan.agentx.api.controller;

import cloud.xcan.agentx.api.dto.ApiResponse;
import cloud.xcan.agentx.core.tool.ToolDescriptor;
import cloud.xcan.agentx.core.tool.ToolRegistry;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tool 管理接口
 */
@RestController
@RequestMapping("/api/v1/tools")
public class ToolController {

  private final ToolRegistry toolRegistry;

  public ToolController(ToolRegistry toolRegistry) {
    this.toolRegistry = toolRegistry;
  }

  @GetMapping
  public ApiResponse<List<ToolDescriptor>> listTools(
      @RequestParam(required = false) String tenantId) {
    if (tenantId != null) {
      return ApiResponse.ok(toolRegistry.listByTenant(tenantId));
    }
    return ApiResponse.ok(toolRegistry.listAll());
  }

  @PostMapping("/{toolId}/execute")
  public ApiResponse<String> executeTool(@PathVariable String toolId,
      @RequestBody java.util.Map<String, Object> params) {
    String result = toolRegistry.executeTool(toolId, params);
    return ApiResponse.ok(result);
  }
}
