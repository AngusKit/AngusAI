package cloud.xcan.angus.core.ai.interfaces.apis;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiEndpointFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointTestDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointTestVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
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

@Tag(name = "ApiEndpoint", description = "接口集端点管理")
@Validated
@RestController
@RequestMapping("/api/v1/api-collections")
public class ApiEndpointRest {

  @Resource
  private ApiEndpointFacade apiEndpointFacade;

  @Operation(operationId = "apiEndpointCreate", summary = "添加端点", description = "手动添加接口端点")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "创建成功")
  })
  @PostMapping("/{collectionId}/endpoints")
  @ResponseStatus(HttpStatus.CREATED)
  public ApiLocaleResult<ApiEndpointVo> createEndpoint(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Valid @RequestBody ApiEndpointCreateDto dto) {
    return ApiLocaleResult.success(apiEndpointFacade.createEndpoint(collectionId, dto));
  }

  @Operation(operationId = "apiEndpointUpdate", summary = "更新端点", description = "更新接口端点信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PutMapping("/{collectionId}/endpoints/{endpointId}")
  public ApiLocaleResult<ApiEndpointVo> updateEndpoint(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Parameter(description = "端点ID", required = true) @PathVariable Long endpointId,
      @Valid @RequestBody ApiEndpointUpdateDto dto) {
    return ApiLocaleResult.success(apiEndpointFacade.updateEndpoint(collectionId, endpointId, dto));
  }

  @Operation(operationId = "apiEndpointToggle", summary = "切换端点状态", description = "启用/禁用端点")
  @PatchMapping("/{collectionId}/endpoints/{endpointId}/toggle")
  public ApiLocaleResult<ApiEndpointVo> toggleEndpoint(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Parameter(description = "端点ID", required = true) @PathVariable Long endpointId,
      @Parameter(description = "目标状态", required = true) @RequestParam Boolean enabled) {
    return ApiLocaleResult.success(
        apiEndpointFacade.toggleEndpoint(collectionId, endpointId, enabled));
  }

  @Operation(operationId = "apiEndpointTest", summary = "测试接口端点", description = "测试接口端点是否可用")
  @PostMapping("/{collectionId}/endpoints/{endpointId}/test")
  public ApiLocaleResult<ApiEndpointTestVo> testEndpoint(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Parameter(description = "端点ID", required = true) @PathVariable Long endpointId,
      @Valid @RequestBody(required = false) ApiEndpointTestDto dto) {
    return ApiLocaleResult.success(apiEndpointFacade.testEndpoint(collectionId, endpointId, dto));
  }

  @Operation(operationId = "apiEndpointDelete", summary = "删除端点", description = "删除接口端点")
  @DeleteMapping("/{collectionId}/endpoints/{endpointId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteEndpoint(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Parameter(description = "端点ID", required = true) @PathVariable Long endpointId) {
    apiEndpointFacade.deleteEndpoint(collectionId, endpointId);
  }

  @Operation(operationId = "apiEndpointGetDetail", summary = "获取端点详情", description = "根据ID获取端点的详细信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "查询成功"),
      @ApiResponse(responseCode = "404", description = "端点不存在")
  })
  @GetMapping("/{collectionId}/endpoints/{endpointId}")
  public ApiLocaleResult<ApiEndpointDetailVo> getDetail(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Parameter(description = "端点ID", required = true) @PathVariable Long endpointId) {
    return ApiLocaleResult.success(apiEndpointFacade.getDetail(collectionId, endpointId));
  }

  @Operation(operationId = "apiEndpointList", summary = "获取端点列表", description = "获取接口集的端点列表")
  @GetMapping("/{collectionId}/endpoints")
  public ApiLocaleResult<PageResult<ApiEndpointVo>> listEndpoints(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Valid @ParameterObject ApiEndpointFindDto dto) {
    return ApiLocaleResult.success(apiEndpointFacade.listEndpoints(collectionId, dto));
  }
}
