package cloud.xcan.angus.core.ai.interfaces.team;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceInfo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.team.facade.ResourceSharingFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingToggleDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingStatisticsVo;
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
import java.util.Map;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ResourceSharing", description = "资源共享管理 - 团队资源共享、权限控制、访问统计。注意：资源可访问性由资源可见性和资源共享两种方式控制")
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

  @Operation(operationId = "updateResourceSharing", summary = "更新共享权限", description = "更新资源共享配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PutMapping("/resources/{id}")
  public ApiLocaleResult<ResourceSharingDetailVo> update(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Valid @RequestBody ResourceSharingUpdateDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.update(id, dto));
  }

  @Operation(operationId = "toggleResourceSharingStatus", summary = "切换资源共享状态", description = "启用或停止资源共享")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "状态修改成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/toggle")
  public ApiLocaleResult<ResourceSharingDetailVo> toggle(
      @Parameter(description = "知识库ID") @PathVariable Long id,
      @Valid @RequestBody ResourceSharingToggleDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.toggle(id, dto));
  }

  @Operation(operationId = "deleteResourceSharing", summary = "取消资源共享", description = "取消资源共享")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "取消成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/resources/{id}")
  public void delete(
      @Parameter(description = "共享ID") @PathVariable Long id) {
    resourceSharingFacade.delete(id);
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

  @Operation(operationId = "getResourceSharingList", summary = "获取共享资源列表", description = "获取当前用户可访问的共享资源列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "列表获取成功")
  })
  @GetMapping("/resources")
  public ApiLocaleResult<PageResult<ResourceSharingListVo>> list(
      @Valid @ParameterObject ResourceSharingFindDto dto) {
    return ApiLocaleResult.success(resourceSharingFacade.list(dto));
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

  @Operation(operationId = "getResourcePermissions", summary = "获取资源访问权限", description = "获取当前用户对资源的访问权限")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "查询成功")
  })
  @GetMapping("/access-permissions")
  public ApiLocaleResult<Map<ResourceInfo, List<SharePermission>>> getResourcePermissions(
      @Parameter(description = "资源ID") @RequestParam Long resourceId,
      @Parameter(description = "资源类型") @RequestParam ResourceType resourceType) {
    return ApiLocaleResult.success(
        resourceSharingFacade.getResourcePermissions(resourceId, resourceType));
  }

  @Operation(operationId = "getResourceSharingStatistics", summary = "获取共享访问统计", description = "获取资源共享的访问统计")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/resources/{id}/statistics")
  public ApiLocaleResult<ResourceSharingStatisticsVo> getStatistics(
      @Parameter(description = "共享ID") @PathVariable Long id,
      @Parameter(description = "统计周期") @RequestParam(required = false) StatisticsPeriod period) {
    return ApiLocaleResult.success(resourceSharingFacade.getStatistics(id, period));
  }

}
