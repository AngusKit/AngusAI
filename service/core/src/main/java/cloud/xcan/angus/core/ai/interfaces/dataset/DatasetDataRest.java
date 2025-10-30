package cloud.xcan.angus.core.ai.interfaces.dataset;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetDataFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceTableDataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncDataVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dataset", description = "数据集管理 - 数据集的创建、管理、数据导入、数据源连接等功能")
@Validated
@RestController
@RequestMapping("/api/v1/datasets")
public class DatasetDataRest {

  @Resource
  private DatasetDataFacade datasetDataFacade;

  @Operation(operationId = "syncDatasetData", summary = "同步数据集数据", description = "手动触发同步文件数据到数据库或同步表信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "同步已启动")
  })
  @PostMapping("/{id}/data/sync")
  public ApiLocaleResult<List<SyncDataVo>> syncDatasetData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "同步文件或表名") @RequestParam(required = false) List<String> names) {
    return ApiLocaleResult.success(datasetDataFacade.syncDatasetData(id, names));
  }

  @Operation(operationId = "batchDeleteData", summary = "批量删除数据", description = "批量删除文件或表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "批量删除成功")
  })
  @DeleteMapping("/{id}/data/batch-delete")
  public void batchDeleteData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DatasetDataBatchDeleteDto dto) {
    datasetDataFacade.batchDeleteData(id, dto);
  }

  @Operation(operationId = "getDatasetDataList", summary = "获取数据集数据列表", description = "获取数据集数据列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据集数据列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}/data")
  public ApiLocaleResult<PageResult<DatasetDataListVo>> listData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @ParameterObject DatasetDataFindDto dto) {
    return ApiLocaleResult.success(datasetDataFacade.listData(id, dto));
  }

  @Operation(operationId = "previewDatasourceData", summary = "数据源数据预览", description = "预览数据集数据源数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据预览成功")
  })
  @GetMapping("/{id}/datasource/preview")
  public ApiLocaleResult<DatasourceTableDataPreviewVo> previewDatasourceData(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "预览表名称") @RequestParam String tableName,
      @Parameter(description = "页码") @RequestParam(required = false, defaultValue = "1") Integer pageNo,
      @Parameter(description = "每页数量") @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
    return ApiLocaleResult.success(
        datasetDataFacade.previewDatasourceData(id, tableName, pageNo, pageSize));
  }

}
