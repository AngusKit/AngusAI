package cloud.xcan.angus.core.ai.interfaces.agent;

import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentCountVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Agent", description = "智能体管理 - 创建、配置、发布、删除智能体")
@Validated
@RestController
@RequestMapping("/api/v1/agents")
public class AgentRest {

  @Resource
  private AgentFacade agentFacade;

  @Operation(operationId = "createAgent", summary = "创建智能体")
  @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "创建成功")})
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<AgentDetailVo> create(@Valid @RequestBody AgentCreateDto dto) {
    return ApiLocaleResult.success(agentFacade.create(dto));
  }

  @Operation(operationId = "updateAgent", summary = "更新智能体", description = "全量字段更新智能体")
  @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "更新成功")})
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ApiLocaleResult<AgentDetailVo> update(
      @Parameter(description = "智能体ID") @PathVariable Long id,
      @Valid @RequestBody AgentUpdateDto dto) {
    return ApiLocaleResult.success(agentFacade.update(id, dto));
  }

  @Operation(operationId = "updateAgentStatus", summary = "发布/下线智能体")
  @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "操作成功")})
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/status")
  public ApiLocaleResult<AgentDetailVo> updateStatus(
      @Parameter(description = "智能体ID") @PathVariable Long id,
      @Parameter(description = "状态：ACTIVE=发布，INACTIVE=下线") @RequestParam AgentStatus status) {
    return ApiLocaleResult.success(agentFacade.updateStatus(id, status));
  }

  @Operation(operationId = "deleteAgent", summary = "删除智能体")
  @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "删除成功")})
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "智能体ID") @PathVariable Long id) {
    agentFacade.delete(id);
  }

  @Operation(operationId = "getAgentDetail", summary = "获取智能体详情")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功"),
      @ApiResponse(responseCode = "404", description = "智能体不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<AgentDetailVo> getDetail(
      @Parameter(description = "智能体ID") @PathVariable Long id) {
    return ApiLocaleResult.success(agentFacade.getDetail(id));
  }

  @Operation(operationId = "listAgents", summary = "智能体列表", description = "分页查询，支持关键词、状态、交互模式筛选")
  @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "获取成功")})
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<AgentListVo>> list(
      @Valid @ParameterObject AgentFindDto dto) {
    return ApiLocaleResult.success(agentFacade.list(dto));
  }

  @Operation(operationId = "getAgentCounts", summary = "获取智能体数量统计数据")
  @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "获取成功")})
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/counts")
  public ApiLocaleResult<AgentCountVo> getCounts() {
    return ApiLocaleResult.success(agentFacade.getCounts());
  }
}
