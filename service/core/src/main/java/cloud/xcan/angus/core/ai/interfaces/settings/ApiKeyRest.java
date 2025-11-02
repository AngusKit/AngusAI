package cloud.xcan.angus.core.ai.interfaces.settings;

import cloud.xcan.angus.core.ai.interfaces.settings.facade.ApiKeyFacade;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyFindDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyListVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.Map;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

/**
 * API密钥管理REST接口
 */
@Tag(name = "API Keys", description = "API密钥管理 - 密钥的创建、管理、吊销、刷新等功能")
@Validated
@RestController
@RequestMapping("/api/v1/settings/api-keys")
public class ApiKeyRest {

  @Resource
  private ApiKeyFacade apiKeyFacade;

  @Operation(operationId = "createApiKey", summary = "创建API密钥", description = "创建新的API密钥，支持设置权限、资源授权、速率限制等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "API密钥创建成功"),
      @ApiResponse(responseCode = "400", description = "参数验证失败")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<ApiKeyDetailVo> create(@Valid @RequestBody ApiKeyCreateDto dto) {
    // TODO: 从SecurityContext获取当前用户ID
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.create(dto, userId));
  }

  @Operation(operationId = "updateApiKey", summary = "更新API密钥", description = "更新API密钥信息（不包括密钥本身）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限操作此密钥")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<ApiKeyDetailVo> update(
      @Parameter(description = "API密钥ID") @PathVariable Long id,
      @Valid @RequestBody ApiKeyUpdateDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.update(id, dto, userId));
  }

  @Operation(operationId = "toggleApiKeyStatus", summary = "切换API密钥状态", description = "在启用和禁用之间切换API密钥状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "状态切换成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限操作此密钥"),
      @ApiResponse(responseCode = "400", description = "已过期的密钥无法激活")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}/toggle")
  public ApiLocaleResult<ApiKeyDetailVo> toggle(
      @Parameter(description = "API密钥ID") @PathVariable Long id) {
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.toggleStatus(id, userId));
  }

  @Operation(operationId = "revokeApiKey", summary = "吊销API密钥", description = "吊销API密钥，密钥将被禁用且无法再次启用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "吊销成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限操作此密钥")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/{id}/revoke")
  public void revoke(
      @Parameter(description = "API密钥ID") @PathVariable Long id,
      @Valid @RequestBody ApiKeyRevokeDto dto) {
    Long userId = 1L;
    apiKeyFacade.revoke(id, dto, userId);
  }

  @Operation(operationId = "refreshApiKey", summary = "刷新API密钥", description = "生成新的密钥字符串，旧密钥将失效")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "刷新成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限操作此密钥")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/refresh")
  public ApiLocaleResult<ApiKeyDetailVo> refresh(
      @Parameter(description = "API密钥ID") @PathVariable Long id) {
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.refresh(id, userId));
  }

  @Operation(operationId = "deleteApiKey", summary = "删除API密钥", description = "删除指定的API密钥，删除后密钥将失效且无法恢复")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限操作此密钥")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(@Parameter(description = "API密钥ID") @PathVariable Long id) {
    Long userId = 1L;
    apiKeyFacade.delete(id, userId);
  }

  @Operation(operationId = "getApiKeyDetail", summary = "获取API密钥详情", description = "获取指定API密钥的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功"),
      @ApiResponse(responseCode = "404", description = "API密钥不存在"),
      @ApiResponse(responseCode = "403", description = "无权限访问此密钥")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<ApiKeyDetailVo> getDetail(
      @Parameter(description = "API密钥ID") @PathVariable Long id) {
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.getDetail(id, userId));
  }

  @Operation(operationId = "listApiKeys", summary = "获取API密钥列表", description = "获取当前用户的API密钥列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<Page<ApiKeyListVo>> list(@Valid @ParameterObject ApiKeyFindDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(apiKeyFacade.list(dto, userId));
  }

  @Operation(operationId = "validateApiKey", summary = "验证API密钥", description = "验证API密钥的有效性，返回密钥权限和限制信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "验证完成"),
      @ApiResponse(responseCode = "401", description = "密钥无效或已失效")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/validate")
  public ApiLocaleResult<Map<String, Object>> validate(
      @Parameter(description = "API密钥字符串") @RequestParam String apiKey) {
    return ApiLocaleResult.success(apiKeyFacade.validate(apiKey));
  }
}
