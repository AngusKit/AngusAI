package cloud.xcan.angus.core.ai.interfaces.workflow;

import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowExecutionFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.WorkflowFacade;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowExecuteResultVo;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "WorkflowExecution", description = "工作流执行管理 - 运行、查看执行等功能")
@Validated
@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowExecutionRest {

  @Resource
  private WorkflowExecutionFacade workflowExecutionFacade;

  @Operation(operationId = "executeWorkflow", summary = "执行工作流", description = "手动执行或调试工作流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行成功"),
      @ApiResponse(responseCode = "202", description = "执行已启动")
  })
  @PostMapping("/{id}/execute")
  public ApiLocaleResult<WorkflowExecuteResultVo> execute(
      @Parameter(description = "工作流ID") @PathVariable Long id,
      @Valid @RequestBody WorkflowExecuteDto dto) {
    return ApiLocaleResult.success(workflowExecutionFacade.execute(id, dto));
  }

  @Operation(operationId = "getExecutionLogs", summary = "获取执行日志", description = "获取工作流执行日志")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行日志获取成功")
  })
  @GetMapping("/execution-logs")
  public ApiLocaleResult<PageResult<ExecutionLogVo>> getExecutionLogs(
      @Valid @ParameterObject WorkflowExecutionLogFindDto dto) {
    return ApiLocaleResult.success(workflowExecutionFacade.getExecutionLogs(dto));
  }

  @Operation(operationId = "getExecutionDetail", summary = "获取执行详情", description = "获取特定执行的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "执行详情获取成功")
  })
  @GetMapping("/executions/{executionId}")
  public ApiLocaleResult<ExecutionDetailVo> getExecutionDetail(
      @Parameter(description = "执行ID") @PathVariable String executionId) {
    return ApiLocaleResult.success(workflowExecutionFacade.getExecutionDetail(executionId));
  }

}
