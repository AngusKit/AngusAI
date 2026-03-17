package cloud.xcan.angus.core.ai.interfaces.analytics.facade;

import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.AnalyticsQueryDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AnalyticsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiCallsTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AppDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ErrorAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ModelDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ResourcesBadgeVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ResponseTimeAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TokenUsageTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TopEndpointsVo;

public interface ChatAnalyticsFacade {

  /**
   * 获取分析概览
   */
  AnalyticsOverviewVo getOverview(AnalyticsQueryDto dto);

  /**
   * 获取API调用趋势
   */
  ApiCallsTrendVo getApiCallsTrend(AnalyticsQueryDto dto);

  /**
   * 获取Token使用趋势
   */
  TokenUsageTrendVo getTokenUsageTrend(AnalyticsQueryDto dto);

  /**
   * 获取响应时间分析
   */
  ResponseTimeAnalysisVo getResponseTimeAnalysis(AnalyticsQueryDto dto);

  /**
   * 获取应用使用分布
   */
  AppDistributionVo getAppDistribution(AnalyticsQueryDto dto, Integer limit);

  /**
   * 获取模型使用分布
   */
  ModelDistributionVo getModelDistribution(AnalyticsQueryDto dto);

  /**
   * 获取Top接口统计
   */
  TopEndpointsVo getTopEndpoints(AnalyticsQueryDto dto, Integer limit, String orderBy);

  /**
   * 获取错误分析
   */
  ErrorAnalysisVo getErrorAnalysis(AnalyticsQueryDto dto);

  /**
   * 获取关键资源badge统计（对话Session数、我的应用数、未读通知数）
   */
  ResourcesBadgeVo getResourcesBadge();

}
