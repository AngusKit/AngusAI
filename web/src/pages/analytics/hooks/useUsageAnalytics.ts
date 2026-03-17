import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Analytics from '@/services/Analytics';
import Applications from '@/services/Applications';
import type {
  AnalyticsOverviewVo,
  ApiCallsTrendVo,
  TokenUsageTrendVo,
  ResponseTimeAnalysisVo,
  TopEndpointsVo,
  ModelDistributionVo,
  AppDistributionVo,
  ErrorAnalysisVo,
  EndpointItemVo,
  DistributionItemVo,
  TrendItemVo,
  ErrorByStatusCodeVo,
} from '@/services/AnalyticsTypes';
import type { ApplicationListVo } from '@/services/ApplicationsTypes';
import { TimeRangeEnum, GranularityEnum } from '@/enums/enums';

/** API 调用趋势图表数据点（扩展 TrendItemVo，后端可能返回 totalCalls/successfulCalls/failedCalls） */
interface ApiCallsTrendItem extends TrendItemVo {
  totalCalls?: number;
  successfulCalls?: number;
  failedCalls?: number;
}

/** 响应时间趋势数据点（扩展 TrendItemVo，后端返回秒） */
interface ResponseTimeTrendItem extends TrendItemVo {
  avgTime?: number;
  avgResponseTime?: number;
  p50?: number;
  p95?: number;
  p99?: number;
}

export function useUsageAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(TimeRangeEnum.Value7Days);
  const [selectedAppId, setSelectedAppId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationListVo[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverviewVo | null>(null);
  const [apiCallsTrend, setApiCallsTrend] = useState<ApiCallsTrendVo | null>(null);
  const [tokenUsageTrend, setTokenUsageTrend] = useState<TokenUsageTrendVo | null>(null);
  const [responseTimeAnalysis, setResponseTimeAnalysis] = useState<ResponseTimeAnalysisVo | null>(null);
  const [topEndpoints, setTopEndpoints] = useState<TopEndpointsVo | null>(null);
  const [modelDistribution, setModelDistribution] = useState<ModelDistributionVo | null>(null);
  const [appDistribution, setAppDistribution] = useState<AppDistributionVo | null>(null);
  const [errorAnalysis, setErrorAnalysis] = useState<ErrorAnalysisVo | null>(null);

  const granularity =
    timeRange === TimeRangeEnum.Value24Hours ? GranularityEnum.Hour : GranularityEnum.Day;
  const appIdParam = selectedAppId === 'all' ? undefined : selectedAppId;

  /** 加载应用列表 */
  const loadApplications = useCallback(async () => {
    try {
      const res = await Applications.getApplicationList({ pageNo: 1, pageSize: 100 });
      const list = (res as { data?: { list?: ApplicationListVo[] } })?.data?.list ?? [];
      setApplications(list);
    } catch {
      setApplications([]);
    }
  }, []);

  /** 加载概览 */
  const loadOverview = useCallback(async () => {
    try {
      const res = await Analytics.getAnalyticsOverview({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: AnalyticsOverviewVo })?.data;
      setOverview(data ?? null);
    } catch {
      setOverview(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载 API 调用趋势 */
  const loadApiCallsTrend = useCallback(async () => {
    try {
      const res = await Analytics.getApiCallsTrend({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: ApiCallsTrendVo })?.data;
      setApiCallsTrend(data ?? null);
    } catch {
      setApiCallsTrend(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载 Token 使用趋势 */
  const loadTokenUsageTrend = useCallback(async () => {
    try {
      const res = await Analytics.getTokenUsageTrend({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: TokenUsageTrendVo })?.data;
      setTokenUsageTrend(data ?? null);
    } catch {
      setTokenUsageTrend(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载响应时间分析 */
  const loadResponseTimeAnalysis = useCallback(async () => {
    try {
      const res = await Analytics.getResponseTimeAnalysis({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: ResponseTimeAnalysisVo })?.data;
      setResponseTimeAnalysis(data ?? null);
    } catch {
      setResponseTimeAnalysis(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载 Top 接口 */
  const loadTopEndpoints = useCallback(async () => {
    try {
      const res = await Analytics.getTopEndpoints({ appId: appIdParam, timeRange, granularity, limit: 10, orderBy: 'calls' });
      const data = (res as { data?: TopEndpointsVo })?.data;
      setTopEndpoints(data ?? null);
    } catch {
      setTopEndpoints(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载模型分布 */
  const loadModelDistribution = useCallback(async () => {
    try {
      const res = await Analytics.getModelDistribution({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: ModelDistributionVo })?.data;
      setModelDistribution(data ?? null);
    } catch {
      setModelDistribution(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载应用分布 */
  const loadAppDistribution = useCallback(async () => {
    try {
      const res = await Analytics.getAppDistribution({ appId: appIdParam, timeRange, granularity, limit: 10 });
      const data = (res as { data?: AppDistributionVo })?.data;
      setAppDistribution(data ?? null);
    } catch {
      setAppDistribution(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载错误分析 */
  const loadErrorAnalysis = useCallback(async () => {
    try {
      const res = await Analytics.getErrorAnalysis({ appId: appIdParam, timeRange, granularity });
      const data = (res as { data?: ErrorAnalysisVo })?.data;
      setErrorAnalysis(data ?? null);
    } catch {
      setErrorAnalysis(null);
    }
  }, [appIdParam, timeRange, granularity]);

  /** 加载全部数据 */
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadOverview(),
        loadApiCallsTrend(),
        loadTokenUsageTrend(),
        loadResponseTimeAnalysis(),
        loadTopEndpoints(),
        loadModelDistribution(),
        loadAppDistribution(),
        loadErrorAnalysis(),
      ]);
    } catch (e) {
      toast.error('加载数据失败');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    loadOverview,
    loadApiCallsTrend,
    loadTokenUsageTrend,
    loadResponseTimeAnalysis,
    loadTopEndpoints,
    loadModelDistribution,
    loadAppDistribution,
    loadErrorAnalysis,
  ]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    timeRange,
    setTimeRange,
    selectedAppId,
    setSelectedAppId,
    isLoading,
    applications,
    overview,
    apiCallsTrend,
    tokenUsageTrend,
    responseTimeAnalysis,
    topEndpoints,
    modelDistribution,
    appDistribution,
    errorAnalysis,
    refresh: loadAll,
  };
}

/** 将 API 调用趋势转为图表数据 */
export function mapApiCallsToChartData(apiCallsTrend: ApiCallsTrendVo | null) {
  const items = (apiCallsTrend?.items ?? []) as ApiCallsTrendItem[];
  return items.map((item) => ({
    date: item.date ?? String(item.datetime ?? ''),
        calls:
          item.totalCalls ??
          ((item.totalTokens ?? 0) + (item.inputTokens ?? 0) + (item.outputTokens ?? 0) || 0),
    success: item.successfulCalls ?? Math.round((item.totalTokens ?? 0) * 0.95),
    failed: item.failedCalls ?? Math.round((item.totalTokens ?? 0) * 0.05),
  }));
}

/** 将 Token 使用趋势转为图表数据 */
export function mapTokenUsageToChartData(tokenUsageTrend: TokenUsageTrendVo | null) {
  const items = tokenUsageTrend?.items ?? [];
  return items.map((item) => ({
    date: item.date ?? String(item.datetime ?? ''),
    input: item.inputTokens ?? 0,
    output: item.outputTokens ?? 0,
  }));
}

/** 将响应时间分析转为图表数据（后端已返回秒，无需转换） */
export function mapResponseTimeToChartData(responseTimeAnalysis: ResponseTimeAnalysisVo | null) {
  const items = (responseTimeAnalysis?.items ?? []) as ResponseTimeTrendItem[];
  return items.map((item) => ({
    date: item.date ?? String(item.datetime ?? ''),
    avgTime: item.avgTime ?? item.avgResponseTime ?? 0,
    p95: item.p95 ?? 0,
    p99: item.p99 ?? 0,
  }));
}

/** 将 Top 接口转为列表数据 */
export function mapTopEndpointsToList(topEndpoints: TopEndpointsVo | null): EndpointItemVo[] {
  return topEndpoints?.items ?? [];
}

/** 应用分布图表数据（进度以 tokens 计算比例） */
export function mapAppDistributionToChartData(appDistribution: AppDistributionVo | null) {
  const items = (appDistribution?.items ?? []) as DistributionItemVo[];
  const total = appDistribution?.total;
  const totalTokens = Number(total?.tokens) || 0;
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280'];
  const chartItems = items.map((item, index) => {
    const tokens = Number(item.tokens) || 0;
    const value = totalTokens > 0 ? Math.round((tokens / totalTokens) * 10000) / 100 : 0;
    return {
      name: item.appName ?? item.modelName ?? '未知',
      value,
      calls: Number(item.calls) || 0,
      tokens,
      color: item.color ?? COLORS[index % COLORS.length],
    };
  });
  return {
    items: chartItems,
    total: {
      apps: Number(total?.apps) ?? 0,
      calls: Number(total?.calls) ?? 0,
      tokens: Number(total?.tokens) ?? 0,
    },
  };
}

/** 模型分布图表数据（饼图以 tokens 计算比例） */
export function mapModelDistributionToChartData(modelDistribution: ModelDistributionVo | null) {
  const items = (modelDistribution?.items ?? []) as DistributionItemVo[];
  const total = modelDistribution?.total;
  const totalTokens = Number(total?.tokens) || 0;
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];
  const chartItems = items.map((item, index) => {
    const tokens = Number(item.tokens) || 0;
    const value = totalTokens > 0 ? Math.round((tokens / totalTokens) * 10000) / 100 : 0;
    return {
      name: item.appName ?? item.modelName ?? '未知',
      value,
      calls: Number(item.calls) || 0,
      tokens,
      color: COLORS[index % COLORS.length],
    };
  });
  return {
    items: chartItems,
    total: {
      models: Number(total?.models) ?? 0,
      calls: Number(total?.calls) ?? 0,
      tokens: Number(total?.tokens) ?? 0,
      cost: Number(total?.cost) ?? 0,
      costDisplay: total?.costDisplay ?? '$0.00',
    },
  };
}

/** @deprecated 使用 mapAppDistributionToChartData / mapModelDistributionToChartData */
export function mapDistributionToChartData(
  distribution: ModelDistributionVo | AppDistributionVo | null
) {
  const items = (distribution?.items ?? []) as DistributionItemVo[];
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280'];
  return items.map((item, index) => ({
    name: item.appName ?? item.modelName ?? '未知',
    value: Number(item.percentage) || 0,
    calls: Number(item.calls) || 0,
    color: COLORS[index % COLORS.length],
  }));
}

/** 将错误分析转为列表数据 */
export function mapErrorAnalysisToList(errorAnalysis: ErrorAnalysisVo | null): ErrorByStatusCodeVo[] {
  return errorAnalysis?.byStatusCode ?? [];
}
