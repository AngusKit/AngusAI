package cloud.xcan.angus.core.ai.interfaces.monitor.facade;

import cloud.xcan.angus.core.ai.interfaces.monitor.facade.dto.ChatMonitorChartQueryDto;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChartDataPointVo;
import java.util.List;

/**
 * 对话监控门面接口
 */
public interface ChatMonitorFacade {

  /**
   * 获取统计概览
   */
  ChatMonitorOverviewVo getOverview();

  /**
   * 获取会话趋势折线图数据
   */
  List<ChartDataPointVo> getSessionsChartData(ChatMonitorChartQueryDto dto);

  /**
   * 获取消息趋势折线图数据
   */
  List<ChartDataPointVo> getMessagesChartData(ChatMonitorChartQueryDto dto);

  /**
   * 获取反馈趋势折线图数据
   */
  List<ChartDataPointVo> getFeedbackChartData(ChatMonitorChartQueryDto dto);
}
