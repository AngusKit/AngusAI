package cloud.xcan.angus.core.ai.interfaces.dashboard.facade;

import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.dto.DashboardQueryDto;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;
import java.util.List;

public interface DashboardFacade {

  /**
   * 获取使用详情（热度应用 TOP5、API 调用 TOP5、费用成本 TOP5）
   */
  UsageDetailsVo getUsageDetails(DashboardQueryDto dto);

  /**
   * 获取统计概览（总应用数、API 调用、Token 消耗、活跃用户等）
   */
  List<StatItemVo> getStatsOverview(DashboardQueryDto dto);

  /**
   * 获取最近使用的应用列表
   */
  List<RecentApplicationItemVo> getRecentApplications(DashboardQueryDto dto);
}
