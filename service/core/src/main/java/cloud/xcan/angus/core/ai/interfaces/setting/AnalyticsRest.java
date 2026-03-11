package cloud.xcan.angus.core.ai.interfaces.setting;

import cloud.xcan.angus.core.ai.interfaces.setting.facade.AnalyticsFacade;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.AnalyticsQueryDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.AnalyticsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiCallsTrendVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.AppDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ErrorAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ModelDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ResourcesBadgeVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ResponseTimeAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.TokenUsageTrendVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.TopEndpointsVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Analytics", description = "使用分析 - API使用统计、性能分析、趋势图表等功能")
@Validated
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsRest {

  @Resource
  private AnalyticsFacade analyticsFacade;

  @Operation(operationId = "getAnalyticsOverview", summary = "获取分析概览",
      description = "获取使用分析的概览统计数据，包括API调用、活跃用户、Token消耗、响应时间等核心指标")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "概览数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/overview")
  public ApiLocaleResult<AnalyticsOverviewVo> getOverview(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getOverview(dto));
  }

  @Operation(operationId = "getApiCallsTrend", summary = "获取API调用趋势",
      description = "获取API调用量的时间序列数据，显示总调用、成功调用、失败调用的趋势变化")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "趋势数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/api-calls")
  public ApiLocaleResult<ApiCallsTrendVo> getApiCallsTrend(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getApiCallsTrend(dto));
  }

  @Operation(operationId = "getTokenUsageTrend", summary = "获取Token使用趋势",
      description = "获取Token使用量的时间序列数据，包括输入Token、输出Token和总消耗")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Token趋势数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/token-usage")
  public ApiLocaleResult<TokenUsageTrendVo> getTokenUsageTrend(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getTokenUsageTrend(dto));
  }

  @Operation(operationId = "getResponseTimeAnalysis", summary = "获取响应时间分析",
      description = "获取API响应时间的统计数据，包括平均值、P50、P95、P99等性能指标")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "响应时间分析获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/response-time")
  public ApiLocaleResult<ResponseTimeAnalysisVo> getResponseTimeAnalysis(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getResponseTimeAnalysis(dto));
  }

  @Operation(operationId = "getAppDistribution", summary = "获取应用使用分布",
      description = "获取不同应用的使用分布情况，包括调用次数、Token消耗、占比等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "应用分布数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/app-distribution")
  public ApiLocaleResult<AppDistributionVo> getAppDistribution(
      @Valid @ParameterObject AnalyticsQueryDto dto,
      @Parameter(description = "Top N，默认10") @RequestParam(required = false, defaultValue = "10") Integer limit) {
    return ApiLocaleResult.success(analyticsFacade.getAppDistribution(dto, limit));
  }

  @Operation(operationId = "getModelDistribution", summary = "获取模型使用分布",
      description = "获取不同模型的使用分布情况，显示各模型的调用占比、Token消耗等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "模型分布数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/model-distribution")
  public ApiLocaleResult<ModelDistributionVo> getModelDistribution(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getModelDistribution(dto));
  }

  @Operation(operationId = "getTopEndpoints", summary = "获取Top接口统计",
      description = "获取调用最多的接口统计，包括调用次数、响应时间、成功率等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Top接口数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/top-endpoints")
  public ApiLocaleResult<TopEndpointsVo> getTopEndpoints(
      @Valid @ParameterObject AnalyticsQueryDto dto,
      @Parameter(description = "Top N，默认10") @RequestParam(required = false, defaultValue = "10") Integer limit,
      @Parameter(description = "排序字段") @RequestParam(required = false, defaultValue = "calls") String orderBy) {
    return ApiLocaleResult.success(analyticsFacade.getTopEndpoints(dto, limit, orderBy));
  }

  @Operation(operationId = "getErrorAnalysis", summary = "获取错误分析",
      description = "获取错误统计和分析，包括按状态码分组、错误趋势等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "错误分析数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/errors")
  public ApiLocaleResult<ErrorAnalysisVo> getErrorAnalysis(
      @Valid @ParameterObject AnalyticsQueryDto dto) {
    return ApiLocaleResult.success(analyticsFacade.getErrorAnalysis(dto));
  }

  @Operation(operationId = "getResourcesBadge", summary = "获取关键资源badge统计",
      description = "获取当前用户关键资源badge统计，包括对话Session数、我的应用数、通知数")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "关键资源badge统计获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/resources/badge")
  public ApiLocaleResult<ResourcesBadgeVo> getResourcesBadge() {
    return ApiLocaleResult.success(analyticsFacade.getResourcesBadge());
  }
}
