package cloud.xcan.angus.core.ai.interfaces.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.BatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.UploadResultVo;
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

@Tag(name = "Dataset", description = "数据集管理 - 数据集的创建、管理、数据导入、数据源连接等功能")
@Validated
@RestController
@RequestMapping("/api/v1/datasets")
public class DatasetRest {

  @Resource
 private DatasetFacade datasetFacade;

  @Operation(operationId = "createDataset", summary = "创建数据集", description = "创建新数据集")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "数据集创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<DatasetDetailVo> create(
      @Valid @RequestBody DatasetCreateDto dto) {
    DatasetDetailVo result = datasetFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updateDataset", summary = "更新数据集", description = "更新数据集基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<DatasetDetailVo> update(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DatasetUpdateDto dto) {
    return ApiLocaleResult.success(datasetFacade.update(id, dto));
  }

  @Operation(operationId = "updateDatasetConfig", summary = "更新数据集配置", description = "更新数据集的详细配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "配置更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/config")
  public ApiLocaleResult<DatasetDetailVo> updateConfig(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DatasetConfig dto) {
    return ApiLocaleResult.success(datasetFacade.updateConfig(id, dto));
  }

  @Operation(operationId = "uploadData", summary = "上传数据", description = "上传数据到数据集")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "上传成功，开始处理")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{id}/upload")
  public ApiLocaleResult<UploadResultVo> uploadData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DataUploadDto dto) {
    return ApiLocaleResult.success(datasetFacade.uploadData(id, dto));
  }

  @Operation(operationId = "deleteDataset", summary = "删除数据集", description = "删除指定数据集")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "数据集ID") @PathVariable Long id) {
    datasetFacade.delete(id);
  }

  @Operation(operationId = "batchDeleteData", summary = "批量删除数据", description = "批量删除数据记录")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "批量删除成功")
  })
  @PostMapping("/{id}/batch-delete")
  public ApiLocaleResult<DatasetStatisticsVo> batchDeleteData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody BatchDeleteDto dto) {
    return ApiLocaleResult.success(datasetFacade.batchDeleteData(id, dto));
  }

  @Operation(operationId = "getDatasetDetail", summary = "获取数据集详情", description = "获取指定数据集的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据集详情获取成功"),
      @ApiResponse(responseCode = "404", description = "数据集不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<DatasetDetailVo> getDetail(
      @Parameter(description = "数据集ID") @PathVariable Long id) {
    return ApiLocaleResult.success(datasetFacade.getDetail(id));
  }

  @Operation(operationId = "getDatasetList", summary = "获取数据集列表", description = "获取当前用户的数据集列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据集列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<DatasetListVo>> list(
      @Valid @ParameterObject DatasetFindDto dto) {
    return ApiLocaleResult.success(datasetFacade.list(dto));
  }

  @Operation(operationId = "previewData", summary = "数据预览", description = "预览数据集数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据预览成功")
  })
  @GetMapping("/{id}/preview")
  public ApiLocaleResult<DataPreviewVo> previewData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "页码") @RequestParam(required = false, defaultValue = "1") Integer pageNo,
      @Parameter(description = "每页数量") @RequestParam(required = false, defaultValue = "20") Integer pageSize,
      @Parameter(description = "数据源ID") @RequestParam(required = false) Long sourceId) {
    return ApiLocaleResult.success(datasetFacade.previewData(id, pageNo, pageSize, sourceId));
  }

  @Operation(operationId = "exportData", summary = "数据导出", description = "导出数据集数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "导出成功")
  })
  @GetMapping("/{id}/export")
  public ApiLocaleResult<String> exportData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "导出格式") @RequestParam(required = false, defaultValue = "csv") String format,
      @Parameter(description = "数据源ID") @RequestParam(required = false) Long sourceId) {
    return ApiLocaleResult.success(datasetFacade.exportData(id, format, sourceId));
  }

  @Operation(operationId = "getDatasetStatistics", summary = "获取数据集统计", description = "获取数据集模块的统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/statistics")
  public ApiLocaleResult<DatasetStatisticsVo> getStatistics() {
    return ApiLocaleResult.success(datasetFacade.getStatistics());
  }

}