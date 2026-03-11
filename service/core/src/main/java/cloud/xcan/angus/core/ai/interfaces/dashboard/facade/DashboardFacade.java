package cloud.xcan.angus.core.ai.interfaces.dashboard.facade;

import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.dto.DashboardQueryDto;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationsVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;

public interface DashboardFacade {

  /**
   * 获取使用详情（热度应用 TOP5、API 调用 TOP5、费用成本 TOP5）
   */
  UsageDetailsVo getUsageDetails(DashboardQueryDto dto);

  /**
   * 获取统计概览（总应用数、API 调用、Token 消耗、活跃用户等）
   */
  StatsOverviewVo getStatsOverview(DashboardQueryDto dto);

  /**
   * 获取最近使用的应用列表
   */
  RecentApplicationsVo getRecentApplications(DashboardQueryDto dto);
}
