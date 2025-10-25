package cloud.xcan.angus.core.ai.interfaces.model;

import cloud.xcan.angus.core.ai.domain.model.ModelConfig;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.interfaces.model.facade.ModelFacade;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelMetricsVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
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

@Tag(name = "Model", description = "模型管理 - 模型的添加、配置、启动、停止、监控等功能")
@Validated
@RestController
@RequestMapping("/api/v1/models")
public class ModelRest {

  @Resource
  private ModelFacade modelFacade;

  @Operation(operationId = "createModel", summary = "添加模型", description = "添加新模型")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "模型添加成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<ModelDetailVo> create(
      @Valid @RequestBody ModelCreateDto dto) {
    ModelDetailVo result = modelFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updateModel", summary = "更新模型", description = "更新模型配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<ModelDetailVo> update(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Valid @RequestBody ModelUpdateDto dto) {
    return ApiLocaleResult.success(modelFacade.update(id, dto));
  }

  @Operation(operationId = "updateModelConfig", summary = "更新模型配置", description = "更新模型的详细配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "配置更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/config")
  public ApiLocaleResult<ModelDetailVo> updateConfig(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Valid @RequestBody ModelConfig dto) {
    return ApiLocaleResult.success(modelFacade.updateConfig(id, dto));
  }

  @Operation(operationId = "startModel", summary = "启动模型", description = "启动模型")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "启动成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/start")
  public ApiLocaleResult<ModelDetailVo> start(
      @Parameter(description = "模型ID") @PathVariable Long id) {
    return ApiLocaleResult.success(modelFacade.start(id));
  }

  @Operation(operationId = "stopModel", summary = "停止模型", description = "停止模型")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "停止成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/stop")
  public ApiLocaleResult<ModelDetailVo> stop(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Parameter(description = "优雅停止") @RequestParam(required = false, defaultValue = "true") Boolean graceful) {
    return ApiLocaleResult.success(modelFacade.stop(id, graceful));
  }

  @Operation(operationId = "restartModel", summary = "重启模型", description = "重启模型（先停止再启动）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "重启中")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/restart")
  public ApiLocaleResult<ModelDetailVo> restart(
      @Parameter(description = "模型ID") @PathVariable Long id) {
    return ApiLocaleResult.success(modelFacade.restart(id));
  }

  @Operation(operationId = "testModel", summary = "测试模型连接", description = "测试模型连接和配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "测试成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/test")
  public ApiLocaleResult<ModelDetailVo> test(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Valid @RequestBody ModelTestDto dto) {
    return ApiLocaleResult.success(modelFacade.test(id, dto));
  }

  @Operation(operationId = "deleteModel", summary = "删除模型", description = "删除指定模型")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "模型ID") @PathVariable Long id) {
    modelFacade.delete(id);
  }

  @Operation(operationId = "getModelDetail", summary = "获取模型详情", description = "获取指定模型的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "模型详情获取成功"),
      @ApiResponse(responseCode = "404", description = "模型不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<ModelDetailVo> getDetail(
      @Parameter(description = "模型ID") @PathVariable Long id) {
    return ApiLocaleResult.success(modelFacade.getDetail(id));
  }

  @Operation(operationId = "getModelList", summary = "获取模型列表", description = "获取当前用户的模型列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "模型列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<ModelListVo>> list(
      @Valid @ParameterObject ModelFindDto dto) {
    return ApiLocaleResult.success(modelFacade.list(dto));
  }

  @Operation(operationId = "getModelMetrics", summary = "获取模型性能监控", description = "获取模型性能监控数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "监控数据获取成功"),
      @ApiResponse(responseCode = "404", description = "模型不存在")
  })
  @GetMapping("/{id}/metrics")
  public ApiLocaleResult<ModelMetricsVo> getMetrics(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Parameter(description = "统计周期") @RequestParam(required = false) String period,
      @Parameter(description = "开始时间") @RequestParam(required = false) Long startTime,
      @Parameter(description = "结束时间") @RequestParam(required = false) Long endTime,
      @Parameter(description = "指定指标") @RequestParam(required = false) String[] metrics) {
    return ApiLocaleResult.success(modelFacade.getMetrics(id, period, startTime, endTime, metrics));
  }

  @Operation(operationId = "getModelStatistics", summary = "获取模型调用统计", description = "获取模型调用统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功"),
      @ApiResponse(responseCode = "404", description = "模型不存在")
  })
  @GetMapping("/{id}/statistics")
  public ApiLocaleResult<ModelStatisticsVo> getStatistics(
      @Parameter(description = "模型ID") @PathVariable Long id,
      @Parameter(description = "统计周期") @RequestParam(required = false) String period,
      @Parameter(description = "分组方式") @RequestParam(required = false) String groupBy) {
    return ApiLocaleResult.success(modelFacade.getStatistics(id, period, groupBy));
  }

  @Operation(operationId = "getModelListStatistics", summary = "获取模型列表统计", description = "获取模型管理模块的统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/statistics")
  public ApiLocaleResult<ModelStatisticsVo> getListStatistics() {
    return ApiLocaleResult.success(modelFacade.getListStatistics());
  }

  @Operation(operationId = "getModelProviders", summary = "获取可用模型提供商", description = "获取支持的模型提供商列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "提供商列表获取成功")
  })
  @GetMapping("/providers")
  public ApiLocaleResult<ModelStatisticsVo> getProviders() {
    return ApiLocaleResult.success(modelFacade.getProviders());
  }

  @Operation(operationId = "batchOperationModels", summary = "批量操作模型", description = "批量启动/停止模型")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "批量操作成功")
  })
  @PostMapping("/batch")
  public ApiLocaleResult<ModelStatisticsVo> batchOperation(
      @Valid @RequestBody ModelStatisticsVo dto) {
    return ApiLocaleResult.success(modelFacade.batchOperation(dto));
  }

  @Operation(operationId = "exportModelConfig", summary = "导出模型配置", description = "导出模型配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "导出成功")
  })
  @GetMapping("/{id}/export")
  public ApiLocaleResult<ModelDetailVo> export(
      @Parameter(description = "模型ID") @PathVariable Long id) {
    return ApiLocaleResult.success(modelFacade.export(id));
  }

  @Operation(operationId = "importModelConfig", summary = "导入模型配置", description = "导入模型配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "导入成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/import")
  public ApiLocaleResult<ModelStatisticsVo> importConfig(
      @Valid @RequestBody ModelStatisticsVo dto) {
    return ApiLocaleResult.success(modelFacade.importConfig(dto));
  }

}
