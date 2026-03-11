package cloud.xcan.angus.core.ai.interfaces.dashboard;

import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.DashboardFacade;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.dto.DashboardQueryDto;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard", description = "工作台 - 工作台对应统计数据、最近访问应用、使用分析等")
@Validated
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardRest {

  @Resource
  private DashboardFacade dashboardFacade;

  @Operation(operationId = "getUsageDetails", summary = "获取使用详情",
      description = "获取使用详情：热度应用 TOP5、API 调用 TOP5、费用成本 TOP5")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "使用详情获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/usage-details")
  public ApiLocaleResult<UsageDetailsVo> getUsageDetails(
      @Valid @ParameterObject DashboardQueryDto dto) {
    return ApiLocaleResult.success(dashboardFacade.getUsageDetails(dto));
  }

  @Operation(operationId = "getStatsOverview", summary = "获取统计概览",
      description = "获取统计概览：总应用数、API 调用、Token 消耗、活跃用户等")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计概览获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/stats-overview")
  public ApiLocaleResult<List<StatItemVo>> getStatsOverview(
      @Valid @ParameterObject DashboardQueryDto dto) {
    return ApiLocaleResult.success(dashboardFacade.getStatsOverview(dto));
  }

  @Operation(operationId = "getRecentApplications", summary = "获取最近应用",
      description = "获取最近使用的应用列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "最近应用列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/recent-applications")
  public ApiLocaleResult<List<RecentApplicationItemVo>> getRecentApplications(
      @Valid @ParameterObject DashboardQueryDto dto) {
    return ApiLocaleResult.success(dashboardFacade.getRecentApplications(dto));
  }
}
