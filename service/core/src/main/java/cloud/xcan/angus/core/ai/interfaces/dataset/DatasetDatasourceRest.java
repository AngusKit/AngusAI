package cloud.xcan.angus.core.ai.interfaces.dataset;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetDatasourceFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataSourceListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncResultVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
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

@Tag(name = "Dataset Datasource", description = "数据集数据源管理 - 数据源的添加、同步、删除和连接测试等功能")
@Validated
@RestController
@RequestMapping("/api/v1/datasets")
public class DatasetDatasourceRest {

  @Resource
  private DatasetDatasourceFacade datasetDatasourceFacade;

  @Operation(operationId = "addDataSource", summary = "添加数据源", description = "添加数据源连接")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "数据源添加成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{id}/datasources")
  public ApiLocaleResult<DatasetDetailVo> addDataSource(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DataSourceCreateDto dto) {
    return ApiLocaleResult.success(datasetDatasourceFacade.addDataSource(id, dto));
  }

  @Operation(operationId = "syncDataSource", summary = "同步数据源", description = "手动触发数据源同步")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "同步已启动")
  })
  @PostMapping("/{datasetId}/datasources/{sourceId}/sync")
  public ApiLocaleResult<SyncResultVo> syncDataSource(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    return ApiLocaleResult.success(datasetDatasourceFacade.syncDataSource(datasetId, sourceId));
  }

  @Operation(operationId = "deleteDataSource", summary = "删除数据源", description = "删除数据源")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{datasetId}/datasources/{sourceId}")
  public void deleteDataSource(
      @Parameter(description = "数据集ID") @PathVariable Long datasetId,
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    datasetDatasourceFacade.deleteDataSource(datasetId, sourceId);
  }

  @Operation(operationId = "getDataSourceList", summary = "获取数据源列表", description = "获取数据集的数据源列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据源列表获取成功")
  })
  @GetMapping("/{id}/datasources")
  public ApiLocaleResult<PageResult<DataSourceListVo>> getDataSources(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Parameter(description = "页码") @RequestParam(required = false, defaultValue = "1") Integer pageNo,
      @Parameter(description = "每页数量") @RequestParam(required = false, defaultValue = "20") Integer pageSize,
      @Parameter(description = "数据源类型筛选") @RequestParam(required = false) String sourceType,
      @Parameter(description = "状态筛选") @RequestParam(required = false) String status) {
    return ApiLocaleResult.success(datasetDatasourceFacade.getDataSources(id, pageNo, pageSize, sourceType, status));
  }

  @Operation(operationId = "testConnection", summary = "测试数据源连接", description = "测试数据源连接是否可用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "连接测试完成")
  })
  @PostMapping("/test-connection")
  public ApiLocaleResult<ConnectionTestVo> testConnection(
      @Valid @RequestBody ConnectionTestDto dto) {
    return ApiLocaleResult.success(datasetDatasourceFacade.testConnection(dto));
  }

}