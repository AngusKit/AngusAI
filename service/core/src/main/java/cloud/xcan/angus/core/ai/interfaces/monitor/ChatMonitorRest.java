package cloud.xcan.angus.core.ai.interfaces.monitor;

import cloud.xcan.angus.core.ai.interfaces.monitor.facade.ChatMonitorFacade;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.dto.ChatMonitorChartQueryDto;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChartDataPointVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ChatMonitor", description = "对话监控 - 统计概览、会话/消息/反馈趋势图表")
@Validated
@RestController
@RequestMapping("/api/v1/monitor")
public class ChatMonitorRest {

  @Resource
  private ChatMonitorFacade chatMonitorFacade;

  @Operation(operationId = "getMonitorOverview", summary = "获取统计概览",
      description = "获取对话监控的统计概览，包括吞吐量、会话、消息、用户、反馈、应用、智能体、模型等核心指标")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "概览数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/overview")
  public ApiLocaleResult<ChatMonitorOverviewVo> getOverview() {
    return ApiLocaleResult.success(chatMonitorFacade.getOverview());
  }

  @Operation(operationId = "getSessionsChartData", summary = "获取会话趋势折线图数据",
      description = "按年/月/日维度获取会话数量趋势数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/charts/sessions")
  public ApiLocaleResult<List<ChartDataPointVo>> getSessionsChartData(
      @ParameterObject ChatMonitorChartQueryDto dto) {
    return ApiLocaleResult.success(chatMonitorFacade.getSessionsChartData(dto));
  }

  @Operation(operationId = "getMessagesChartData", summary = "获取消息趋势折线图数据",
      description = "按年/月/日维度获取消息数量趋势数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/charts/messages")
  public ApiLocaleResult<List<ChartDataPointVo>> getMessagesChartData(
      @ParameterObject ChatMonitorChartQueryDto dto) {
    return ApiLocaleResult.success(chatMonitorFacade.getMessagesChartData(dto));
  }

  @Operation(operationId = "getFeedbackChartData", summary = "获取反馈趋势折线图数据",
      description = "按年/月/日维度获取用户反馈（点赞/点踩）趋势数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/charts/feedback")
  public ApiLocaleResult<List<ChartDataPointVo>> getFeedbackChartData(
      @ParameterObject ChatMonitorChartQueryDto dto) {
    return ApiLocaleResult.success(chatMonitorFacade.getFeedbackChartData(dto));
  }
}
