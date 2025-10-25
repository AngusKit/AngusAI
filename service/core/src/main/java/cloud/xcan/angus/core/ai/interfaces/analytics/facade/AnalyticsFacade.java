package cloud.xcan.angus.core.ai.interfaces.analytics.facade;

import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.AnalyticsQueryDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.*;

public interface AnalyticsFacade {

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

}
