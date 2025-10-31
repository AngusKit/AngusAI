package cloud.xcan.angus.core.ai.interfaces.dataset;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasourceConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConfigVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConnectionTestVo;
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

  @Operation(operationId = "modifyDataSource", summary = "修改数据源", description = "修改数据源配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "数据源添加成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/datasource")
  public ApiLocaleResult<DatasourceConfigVo> modifyDataSource(
      @Parameter(description = "数据集ID") @PathVariable Long id,
      @Valid @RequestBody DataSourceUpdateDto dto) {
    return ApiLocaleResult.success(datasetFacade.modifyDataSource(id, dto));
  }

  @Operation(operationId = "testDataSourceConnection", summary = "测试数据源连接", description = "测试数据源连接是否可用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "连接测试完成")
  })
  @PostMapping("/datasource/test")
  public ApiLocaleResult<DatasourceConnectionTestVo> testDatasourceConnection(
      @Valid @RequestBody DatasourceConnectionTestDto dto) {
    return ApiLocaleResult.success(datasetFacade.testDatasourceConnection(dto));
  }

  @Operation(operationId = "deleteDataSource", summary = "删除数据源", description = "删除数据源配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}/datasource")
  public void deleteDataSource(
      @Parameter(description = "数据集ID") @PathVariable Long id) {
    datasetFacade.deleteDataSource(id);
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

  @Operation(operationId = "getDatasetList", summary = "获取数据集列表", description = "获取当前用户的数据集列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据集列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<DatasetListVo>> list(
      @Valid @ParameterObject DatasetFindDto dto) {
    return ApiLocaleResult.success(datasetFacade.list(dto));
  }

  @Operation(operationId = "getDatasetStatistics", summary = "获取数据集统计", description = "获取数据集模块的统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/statistics")
  public ApiLocaleResult<DatasetStatisticsVo> getStatistics(
      @Parameter(description = "数据集ID") @RequestParam(required = false) Long id) {
    return ApiLocaleResult.success(datasetFacade.getStatistics(id));
  }

}
