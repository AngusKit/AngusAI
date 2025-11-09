package cloud.xcan.angus.core.ai.interfaces.dataset;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetDataFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFileUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceTableDataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncDataVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "数据集数据", description = "数据集管理 - 数据上传，同步，删除等功能")
@Validated
@RestController
@RequestMapping("/api/v1/datasets")
public class DatasetDataRest {

  @Resource
  private DatasetDataFacade datasetDataFacade;

  @Operation(operationId = "uploadDatasetFile", summary = "上传数据集文件", description = "上传数据文件到指定数据集，支持格式：CSV、Excel、JSON")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "文档上传成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping(value = "/{datasetId}/data/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiLocaleResult<DatasetDataListVo> uploadDatasetFile(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "文件", content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE), schema = @Schema(type = "object"))
      DatasetFileUploadDto dto) {
    return ApiLocaleResult.success(datasetDataFacade.uploadDatasetFile(datasetId, dto));
  }

  @Operation(operationId = "syncDatasetData", summary = "同步数据集数据", description = "手动触发同步文件数据到数据库或同步表信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "同步已启动")
  })
  @PostMapping("/{datasetId}/data/sync")
  public ApiLocaleResult<List<SyncDataVo>> syncDatasetData(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "文件或表IDs") @RequestParam(required = false) List<Long> dataIds) {
    return ApiLocaleResult.success(datasetDataFacade.syncDatasetData(datasetId, dataIds));
  }

  @Operation(operationId = "batchDeleteData", summary = "批量删除数据", description = "批量删除文件或表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "批量删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{datasetId}/data/batch-delete")
  public void batchDeleteData(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "文件或表IDs") @RequestParam(required = false) List<Long> dataIds) {
    datasetDataFacade.batchDeleteData(datasetId, dataIds);
  }

  @Operation(operationId = "getDatasetDataList", summary = "获取数据集数据列表", description = "获取数据集数据列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据集数据列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{datasetId}/data")
  public ApiLocaleResult<PageResult<DatasetDataListVo>> listData(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Valid @ParameterObject DatasetDataFindDto dto) {
    return ApiLocaleResult.success(datasetDataFacade.listData(datasetId, dto));
  }

  @Operation(operationId = "previewDatasourceData", summary = "数据源数据预览", description = "预览数据集数据源数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据预览成功")
  })
  @GetMapping("/{datasetId}/datasource/preview")
  public ApiLocaleResult<DatasourceTableDataPreviewVo> previewDatasourceData(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "预览表名称") @RequestParam String tableName,
      @Parameter(description = "页码") @RequestParam(required = false, defaultValue = "1") Integer pageNo,
      @Parameter(description = "每页数量") @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
    return ApiLocaleResult.success(
        datasetDataFacade.previewDatasourceData(datasetId, tableName, pageNo, pageSize));
  }

}
