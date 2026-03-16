package cloud.xcan.angus.core.ai.interfaces.apikey;

import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiKeyListVo;
import cloud.xcan.angus.core.ai.interfaces.apikey.facade.ApiKeyFacade;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "APIKeys", description = "API密钥管理 - 密钥的创建、管理、吊销、刷新等功能")
@Validated
@RestController
@RequestMapping("/api/v1/settings/api-keys")
public class ApiKeyRest {

  @Resource
  private ApiKeyFacade apiKeyFacade;

  @Operation(operationId = "createApiKey", summary = "创建API密钥", description = "创建新的API密钥，支持设置权限、资源授权、速率限制等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "API密钥创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<ApiKeyDetailVo> create(@Valid @RequestBody ApiKeyCreateDto dto) {
    return ApiLocaleResult.success(apiKeyFacade.create(dto));
  }

  @Operation(operationId = "revokeApiKey", summary = "吊销API密钥", description = "吊销API密钥，密钥将被禁用且无法再次启用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "吊销成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/{id}/revoke")
  public void revoke(
      @Parameter(description = "API密钥ID") @PathVariable Long id,
      @Valid @RequestBody ApiKeyRevokeDto dto) {
    apiKeyFacade.revoke(id, dto);
  }

  @Operation(operationId = "deleteApiKey", summary = "删除API密钥", description = "删除指定的API密钥，删除后密钥将失效且无法恢复")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(@Parameter(description = "API密钥ID") @PathVariable Long id) {
    apiKeyFacade.delete(id);
  }

  @Operation(operationId = "getApiKeyDetail", summary = "获取API密钥详情", description = "获取指定API密钥的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<ApiKeyDetailVo> getDetail(
      @Parameter(description = "API密钥ID") @PathVariable Long id) {
    return ApiLocaleResult.success(apiKeyFacade.getDetail(id));
  }

  @Operation(operationId = "listApiKeys", summary = "获取API密钥列表", description = "获取API密钥列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<List<ApiKeyListVo>> list() {
    return ApiLocaleResult.success(apiKeyFacade.list());
  }

}
