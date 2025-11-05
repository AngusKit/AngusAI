package cloud.xcan.angus.core.ai.interfaces.application;

import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.ApplicationFacade;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
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

@Tag(name = "Application", description = "应用管理 - 应用的创建、编辑、删除、配置、发布等功能")
@Validated
@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationRest {

  @Resource
  private ApplicationFacade applicationFacade;

  @Operation(operationId = "createApplication", summary = "创建应用", description = "创建新应用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "应用创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<ApplicationDetailVo> create(
      @Valid @RequestBody ApplicationCreateDto dto) {
    ApplicationDetailVo result = applicationFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "duplicateApplication", summary = "复制应用", description = "复制应用，包含所有配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "复制成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{id}/duplicate")
  public ApiLocaleResult<ApplicationDetailVo> duplicate(
      @Parameter(description = "源应用ID") @PathVariable Long id,
      @Valid @RequestBody ApplicationDuplicateDto dto) {
    ApplicationDetailVo result = applicationFacade.duplicate(id, dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updateApplication", summary = "更新应用基本信息", description = "更新应用的基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<ApplicationDetailVo> update(
      @Parameter(description = "应用ID") @PathVariable Long id,
      @Valid @RequestBody ApplicationUpdateDto dto) {
    return ApiLocaleResult.success(applicationFacade.update(id, dto));
  }

  @Operation(operationId = "updateApplicationConfig", summary = "更新应用配置", description = "更新应用的详细配置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "配置更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/config")
  public ApiLocaleResult<ApplicationDetailVo> updateConfig(
      @Parameter(description = "应用ID") @PathVariable Long id,
      @Valid @RequestBody ApplicationConfig dto) {
    return ApiLocaleResult.success(applicationFacade.updateConfig(id, dto));
  }

  @Operation(operationId = "modifyApplicationStatus", summary = "修改应用状态", description = "修改应用状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "修改状态成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/status")
  public ApiLocaleResult<ApplicationDetailVo> modifyStatus(
      @Parameter(description = "应用ID") @PathVariable Long id,
      @Parameter(description = "应用状态") ApplicationStatus status) {
    return ApiLocaleResult.success(applicationFacade.modifyStatus(id, status));
  }

  @Operation(operationId = "shareApplication", summary = "分享应用", description = "生成应用分享链接或邀请码")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "分享链接已生成")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/share")
  public ApiLocaleResult<ApplicationDetailVo> share(
      @Parameter(description = "应用ID") @PathVariable Long id,
      @Valid @RequestBody ApplicationShareDto dto) {
    return ApiLocaleResult.success(applicationFacade.share(id, dto));
  }

  @Operation(operationId = "deleteApplication", summary = "删除应用", description = "删除指定应用")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "应用ID") @PathVariable Long id) {
    applicationFacade.delete(id);
  }

  @Operation(operationId = "getApplicationDetail", summary = "获取应用详情", description = "获取指定应用的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "应用详情获取成功"),
      @ApiResponse(responseCode = "404", description = "应用不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<ApplicationDetailVo> getDetail(
      @Parameter(description = "应用ID") @PathVariable Long id) {
    return ApiLocaleResult.success(applicationFacade.getDetail(id));
  }

  @Operation(operationId = "getApplicationList", summary = "获取应用列表", description = "获取当前用户的应用列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "应用列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<ApplicationListVo>> list(
      @Valid @ParameterObject ApplicationFindDto dto) {
    return ApiLocaleResult.success(applicationFacade.list(dto));
  }

  @Operation(operationId = "getApplicationStatistics", summary = "获取应用统计", description = "获取应用的详细统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功"),
      @ApiResponse(responseCode = "404", description = "应用不存在")
  })
  @GetMapping("/{id}/statistics")
  public ApiLocaleResult<ApplicationStatisticsVo> getStatistics(
      @Parameter(description = "应用ID") @PathVariable Long id,
      @Parameter(description = "开始日期") @RequestParam(required = false) String startDate,
      @Parameter(description = "结束日期") @RequestParam(required = false) String endDate,
      @Parameter(description = "统计周期") @RequestParam(required = false) String period) {
    return ApiLocaleResult.success(applicationFacade.getStatistics(id, startDate, endDate, period));
  }

}
