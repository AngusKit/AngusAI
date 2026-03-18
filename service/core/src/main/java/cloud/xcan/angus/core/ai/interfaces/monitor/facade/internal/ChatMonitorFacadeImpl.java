package cloud.xcan.angus.core.ai.interfaces.monitor.facade.internal;

import cloud.xcan.angus.core.ai.application.query.monitor.ChatMonitorQuery;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.ChatMonitorFacade;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.dto.ChatMonitorChartQueryDto;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChartDataPointVo;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ChatMonitorFacadeImpl implements ChatMonitorFacade {

  @Resource
  private ChatMonitorQuery chatMonitorQuery;

  @Override
  public ChatMonitorOverviewVo getOverview() {
    return chatMonitorQuery.getOverview();
  }

  @Override
  public List<ChartDataPointVo> getSessionsChartData(ChatMonitorChartQueryDto dto) {
    return chatMonitorQuery.getSessionsChartData(dto);
  }

  @Override
  public List<ChartDataPointVo> getMessagesChartData(ChatMonitorChartQueryDto dto) {
    return chatMonitorQuery.getMessagesChartData(dto);
  }

  @Override
  public List<ChartDataPointVo> getFeedbackChartData(ChatMonitorChartQueryDto dto) {
    return chatMonitorQuery.getFeedbackChartData(dto);
  }
}
