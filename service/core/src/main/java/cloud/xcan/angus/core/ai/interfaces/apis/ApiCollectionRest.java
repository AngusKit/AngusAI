package cloud.xcan.angus.core.ai.interfaces.apis;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiCollectionFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionStatisticsDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionStatisticsVo;
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
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "接口集", description = "接口集管理")
@Validated
@RestController
@RequestMapping("/api/v1/api-collections")
public class ApiCollectionRest {

  @Resource
  private ApiCollectionFacade apiCollectionFacade;

  @Operation(operationId = "apiCollectionCreate", summary = "创建接口集", description = "手动创建一个空的API接口集")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "创建成功"),
      @ApiResponse(responseCode = "409", description = "接口集名称已存在")
  })
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ApiLocaleResult<ApiCollectionDetailVo> create(
      @Valid @RequestBody ApiCollectionCreateDto dto) {
    return ApiLocaleResult.success(apiCollectionFacade.create(dto));
  }

  @Operation(operationId = "apiCollectionUpdate", summary = "更新接口集", description = "更新接口集信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "更新成功"),
      @ApiResponse(responseCode = "409", description = "接口集名称已存在")
  })
  @PatchMapping("/{id}")
  public ApiLocaleResult<ApiCollectionDetailVo> update(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long id,
      @Valid @RequestBody ApiCollectionUpdateDto dto) {
    return ApiLocaleResult.success(apiCollectionFacade.update(id, dto));
  }

  @Operation(operationId = "apiCollectionDelete", summary = "删除接口集", description = "删除指定的接口集，如果被引用需要force=true才能删除")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "删除成功"),
      @ApiResponse(responseCode = "400", description = "接口集被引用，无法删除")
  })
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long id,
      @Parameter(description = "强制删除（即使被引用）") @RequestParam(required = false) Boolean force) {
    apiCollectionFacade.delete(id, force);
  }

  @Operation(operationId = "apiCollectionGetDetail", summary = "获取接口集详情", description = "根据ID获取接口集的详细信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "查询成功"),
      @ApiResponse(responseCode = "404", description = "接口集不存在")
  })
  @GetMapping("/{id}")
  public ApiLocaleResult<ApiCollectionDetailVo> getDetail(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long id) {
    return ApiLocaleResult.success(apiCollectionFacade.getDetail(id));
  }

  @Operation(operationId = "apiCollectionList", summary = "获取接口集列表", description = "分页查询接口集列表，支持关键词搜索、来源筛选、可见性筛选等")
  @GetMapping
  public ApiLocaleResult<PageResult<ApiCollectionListVo>> list(
      @Valid @ParameterObject ApiCollectionFindDto dto) {
    return ApiLocaleResult.success(apiCollectionFacade.list(dto));
  }

  @Operation(operationId = "apiCollectionGetStatistics", summary = "获取统计信息", description = "获取接口集的统计数据，包括总体统计、使用率排行、性能趋势等")
  @GetMapping("/statistics")
  public ApiLocaleResult<ApiCollectionStatisticsVo> getStatistics(
      @ParameterObject ApiCollectionStatisticsDto dto) {
    return ApiLocaleResult.success(apiCollectionFacade.getStatistics(dto));
  }

  @Operation(operationId = "apiCollectionImport", summary = "导入接口集", description = "从OpenAPI/Swagger/Postman文件导入接口集")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "导入成功"),
      @ApiResponse(responseCode = "400", description = "文件格式错误或文件过大")
  })
  @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @ResponseStatus(HttpStatus.CREATED)
  public ApiLocaleResult<ApiCollectionImportVo> importCollection(
      @Parameter(content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE), schema = @Schema(type = "object")) @Valid ApiCollectionImportDto dto) {
    return ApiLocaleResult.success(apiCollectionFacade.importCollection(dto));
  }

  @Operation(operationId = "apiCollectionExportOpenApi", summary = "导出OpenAPI规范", description = "导出接口集为OpenAPI 3.1规范")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "APIs exported successfully")})
  @PostMapping(value = "/{id}/export")
  public ResponseEntity<org.springframework.core.io.Resource> exportOpenApi(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long id,
      @Parameter(description = "导出格式") @RequestParam(required = false, defaultValue = "json") String format,
      @Parameter(description = "是否包含禁用的端点") @RequestParam(required = false, defaultValue = "false") Boolean includeDisabled,
      HttpServletResponse response) {
    return apiCollectionFacade.exportOpenApi(id, format, includeDisabled, response);
  }

}
