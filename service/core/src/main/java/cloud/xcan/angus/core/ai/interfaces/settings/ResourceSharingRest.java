package cloud.xcan.angus.core.ai.interfaces.settings;

import cloud.xcan.angus.core.ai.domain.settings.ResourceType;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.ResourceSharingFacade;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingAccessDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingAddMembersDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.Map;
import org.springdoc.core.annotations.ParameterObject;
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

@Tag(name = "Resource Sharing", description = "资源共享管理 - 团队资源共享、权限控制、访问统计")
@Validated
@RestController
@RequestMapping("/api/v1/sharing")
public class ResourceSharingRest {

  @Resource
  private ResourceSharingFacade resourceSharingFacade;

  @Operation(operationId = "createResourceSharing", summary = "创建资源共享", description = "创建新的资源共享")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "共享创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/resources")
  public ApiLocaleResult<ResourceSharingDetailVo> create(
      @Valid @RequestBody ResourceSharingCreateDto dto) {
    ResourceSharingDetailVo result = resourceSharingFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "getResourceSharingList", summary = "获取共享资源列表", description = "获取当前用户可访问的共享资源列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "列表获取成功")
  })
  @GetMapping("/resources")
  public ApiLocaleResult<PageResult<ResourceSharingListVo>> list(
      @Valid @ParameterObject ResourceSharingFindDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.list(dto));
  }

  @Operation(operationId = "getResourceSharingDetail", summary = "获取共享详情", description = "获取资源共享的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "详情获取成功"),
      @ApiResponse(responseCode = "404", description = "共享不存在")
  })
  @GetMapping("/resources/{id}")
  public ApiLocaleResult<ResourceSharingDetailVo> getDetail(
      @Parameter(description = "共享ID") @PathVariable Long id) {
    return ApiLocaleResult.success(resourceSharingFacade.getDetail(id));
  }

  @Operation(operationId = "updateResourceSharing", summary = "更新共享权限", description = "更新资源共享配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PatchMapping("/resources/{id}")
  public ApiLocaleResult<ResourceSharingDetailVo> update(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Valid @RequestBody ResourceSharingUpdateDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.update(id, dto));
  }

  @Operation(operationId = "deleteResourceSharing", summary = "取消资源共享", description = "取消资源共享")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "取消成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/resources/{id}")
  public void delete(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Parameter(description = "是否通知成员") @RequestParam(required = false, defaultValue = "true") Boolean notifyMembers) {
    resourceSharingFacade.delete(id, notifyMembers);
  }

  @Operation(operationId = "addSharingMembers", summary = "批量添加成员", description = "批量添加共享成员")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "成员已添加")
  })
  @PostMapping("/resources/{id}/members")
  public ApiLocaleResult<Map<String, Object>> addMembers(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Valid @RequestBody ResourceSharingAddMembersDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.addMembers(id, dto));
  }

  @Operation(operationId = "removeSharingMember", summary = "移除共享成员", description = "从共享中移除特定成员")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "成员已移除")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/resources/{id}/members/{userId}")
  public void removeMember(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Parameter(description = "成员用户ID") @PathVariable Long userId) {
    resourceSharingFacade.removeMember(id, userId);
  }

  @Operation(operationId = "checkResourceAccess", summary = "检查资源访问权限", description = "检查当前用户对资源的访问权限")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "检查成功")
  })
  @GetMapping("/check-access")
  public ApiLocaleResult<ResourceAccessCheckVo> checkAccess(
      @Parameter(description = "资源ID") @RequestParam Long resourceId,
      @Parameter(description = "资源类型") @RequestParam ResourceType resourceType) {
    return ApiLocaleResult.success(resourceSharingFacade.checkAccess(resourceId, resourceType));
  }

  @Operation(operationId = "recordResourceAccess", summary = "记录访问日志", description = "记录资源访问（自动调用）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "已记录")
  })
  @PostMapping("/resources/{id}/access")
  public ApiLocaleResult<Void> recordAccess(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Valid @RequestBody ResourceSharingAccessDto dto) {
    resourceSharingFacade.recordAccess(id, dto);
    return ApiLocaleResult.success(null);
  }

  @Operation(operationId = "getResourceSharingStatistics", summary = "获取共享访问统计", description = "获取资源共享的访问统计")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/resources/{id}/statistics")
  public ApiLocaleResult<Map<String, Object>> getStatistics(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Parameter(description = "统计周期") @RequestParam(required = false, defaultValue = "week") String period) {
    return ApiLocaleResult.success(resourceSharingFacade.getStatistics(id, period));
  }

  @Operation(operationId = "getMyShareStatistics", summary = "获取我的共享统计", description = "获取当前用户的共享统计概览")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/my-statistics")
  public ApiLocaleResult<ResourceSharingStatisticsVo> getMyStatistics() {
    return ApiLocaleResult.success(resourceSharingFacade.getMyStatistics());
  }
}
