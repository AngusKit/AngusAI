package cloud.xcan.angus.core.ai.interfaces.workflow;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowStatisticsVo;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Workflow", description = "工作流管理 - 工作流的创建、编辑、执行、监控等功能")
@Validated
@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowRest {

  @Resource
  private WorkflowFacade workflowFacade;

  @Operation(operationId = "createWorkflow", summary = "创建工作流", description = "创建新工作流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "工作流创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<WorkflowDetailVo> create(
      @Valid @RequestBody WorkflowCreateDto dto) {
    WorkflowDetailVo result = workflowFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updateWorkflow", summary = "更新工作流", description = "更新工作流基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<WorkflowDetailVo> update(
      @Parameter(description = "工作流ID") @PathVariable Long id,
      @Valid @RequestBody WorkflowUpdateDto dto) {
    return ApiLocaleResult.success(workflowFacade.update(id, dto));
  }

  @Operation(operationId = "updateWorkflowConfig", summary = "更新工作流配置", description = "更新工作流的节点和配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "配置保存成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/config")
  public ApiLocaleResult<WorkflowDetailVo> updateConfig(
      @Parameter(description = "工作流ID") @PathVariable Long id,
      @Valid @RequestBody WorkflowConfigUpdateDto dto) {
    return ApiLocaleResult.success(workflowFacade.updateConfig(id, dto));
  }

  @Operation(operationId = "modifyWorkflowVisibility", summary = "修改工作流可见性", description = "修改工作流可见性")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "可见性修改成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/visibility")
  public ApiLocaleResult<WorkflowDetailVo> modifyVisibility(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "可见性") @RequestParam Visibility visibility) {
    return ApiLocaleResult.success(workflowFacade.modifyVisibility(id, visibility));
  }

  @Operation(operationId = "executeWorkflow", summary = "执行工作流", description = "手动执行或调试工作流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行成功"),
      @ApiResponse(responseCode = "202", description = "执行已启动")
  })
  @PostMapping("/{id}/execute")
  public ApiLocaleResult<WorkflowExecuteResultVo> execute(
      @Parameter(description = "工作流ID") @PathVariable Long id,
      @Valid @RequestBody WorkflowExecuteDto dto) {
    return ApiLocaleResult.success(workflowFacade.execute(id, dto));
  }

  @Operation(operationId = "startWorkflow", summary = "运行工作流", description = "运行工作流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "已停止")
  })
  @PostMapping("/{id}/start")
  public ApiLocaleResult<WorkflowDetailVo> start(
      @Parameter(description = "工作流ID") @PathVariable Long id) {
    return ApiLocaleResult.success(workflowFacade.start(id));
  }

  @Operation(operationId = "stopWorkflow", summary = "停止工作流运行", description = "停止工作流运行")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "已停止")
  })
  @PostMapping("/{id}/stop")
  public ApiLocaleResult<WorkflowDetailVo> stop(
      @Parameter(description = "工作流ID") @PathVariable Long id) {
    return ApiLocaleResult.success(workflowFacade.stop(id));
  }

  @Operation(operationId = "deleteWorkflow", summary = "删除工作流", description = "删除指定工作流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "工作流ID") @PathVariable Long id) {
    workflowFacade.delete(id);
  }

  @Operation(operationId = "getWorkflowDetail", summary = "获取工作流详情", description = "获取指定工作流的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "工作流详情获取成功"),
      @ApiResponse(responseCode = "404", description = "工作流不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<WorkflowDetailVo> getDetail(
      @Parameter(description = "工作流ID") @PathVariable Long id) {
    return ApiLocaleResult.success(workflowFacade.getDetail(id));
  }

  @Operation(operationId = "getWorkflowList", summary = "获取工作流列表", description = "获取当前用户的工作流列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "工作流列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<WorkflowListVo>> list(
      @Valid @ParameterObject WorkflowFindDto dto) {
    return ApiLocaleResult.success(workflowFacade.list(dto));
  }

  @Operation(operationId = "getWorkflowStatistics", summary = "获取工作流统计", description = "获取工作流模块的总体统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/statistics")
  public ApiLocaleResult<WorkflowStatisticsVo> getStatistics(
      @Parameter(description = "统计周期") @RequestParam(required = false) String period) {
    return ApiLocaleResult.success(workflowFacade.getStatistics(period));
  }

  @Operation(operationId = "getExecutionLogs", summary = "获取执行日志", description = "获取工作流执行日志")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行日志获取成功")
  })
  @GetMapping("/execution-logs")
  public ApiLocaleResult<PageResult<ExecutionLogVo>> getExecutionLogs(
      @Valid @ParameterObject WorkflowExecutionLogFindDto dto) {
    return ApiLocaleResult.success(workflowFacade.getExecutionLogs(dto));
  }

  @Operation(operationId = "getExecutionDetail", summary = "获取执行详情", description = "获取特定执行的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行详情获取成功")
  })
  @GetMapping("/executions/{executionId}")
  public ApiLocaleResult<ExecutionDetailVo> getExecutionDetail(
      @Parameter(description = "执行ID") @PathVariable String executionId) {
    return ApiLocaleResult.success(workflowFacade.getExecutionDetail(executionId));
  }

}
