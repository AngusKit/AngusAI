import { useState, useEffect } from 'react';
import { FileText, Zap, Coins, Users, MessageSquare, Database } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import DashboardApi from '@/services/Dashboard.ts';
import type {
  UsageDetailsVo,
  HotAppItemVo,
  TopApiItemVo,
  CostModelItemVo,
  StatItemVo,
  StatsOverviewResult,
  RecentApplicationItemVo,
} from '@/services/DashboardTypes.ts';
import { TimeRangeEnum } from '@/enums/enums.ts';

/* ========== Dashboard 页面加载 ========== */
export function useDashboardPageLoading() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return isLoading;
}

/* ========== 使用详情 ========== */
export function useUsageDetails() {
  const [hotApps, setHotApps] = useState<HotAppItemVo[]>([]);
  const [topApis, setTopApis] = useState<TopApiItemVo[]>([]);
  const [costModels, setCostModels] = useState<CostModelItemVo[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardApi.getUsageDetails({
          timeRange: TimeRangeEnum.Value7Days,
          limit: 5,
        });
        const data = (res as { data?: UsageDetailsVo })?.data;
        setHotApps(data?.hotApps ?? []);
        setTopApis(data?.topApis ?? []);
        setCostModels(data?.costModels ?? []);
      } catch {
        setHotApps([]);
        setTopApis([]);
        setCostModels([]);
      }
    }
    load();
  }, []);

  return { hotApps, topApis, costModels };
}

/* ========== 统计概览 ========== */
export interface StatData {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
  iconBg: string;
  details: {
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    lastMonth: string;
  };
}

const TYPE_TO_ICON: Record<string, any> = {
  totalApps: FileText,
  apiCalls: Zap,
  tokenUsage: Coins,
  activeUsers: Users,
};

const TYPE_TO_ICON_BG: Record<string, string> = {
  totalApps: 'bg-blue-500',
  apiCalls: 'bg-emerald-500',
  tokenUsage: 'bg-orange-500',
  activeUsers: 'bg-purple-500',
};

function toStatData(vo: StatItemVo, t: (key: string) => string): StatData {
  const type = vo.type ?? 'totalApps';
  const Icon = TYPE_TO_ICON[type] ?? FileText;
  const iconBg = TYPE_TO_ICON_BG[type] ?? 'bg-blue-500';
  const rawKey = vo.label || `dashboard.stats.${type}`;
  const labelKey = rawKey.startsWith('stats.') && !rawKey.startsWith('dashboard.') ? `dashboard.${rawKey}` : rawKey;
  const label = t(labelKey);
  const details = vo.details ?? {};
  return {
    icon: Icon,
    label,
    value: vo.value ?? '-',
    subtitle: vo.subtitle ?? '',
    trend: vo.trend ?? '-',
    trendUp: vo.trendUp ?? true,
    iconBg,
    details: {
      thisWeek: details.thisWeek ?? '-',
      lastWeek: details.lastWeek ?? '-',
      thisMonth: details.thisMonth ?? '-',
      lastMonth: details.lastMonth ?? '-',
    },
  };
}

export function useStatsOverview() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardApi.getStatsOverview({
          timeRange: TimeRangeEnum.Value7Days,
        });
        const data = (res as StatsOverviewResult)?.data ?? [];
        setStats(data.map((vo: StatItemVo) => toStatData(vo, t)));
      } catch {
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [t]);

  return { stats, isLoading };
}

/* ========== 最近应用 ========== */
export interface Application {
  id: string;
  icon: any;
  name: string;
  description: string;
  fullDescription: string;
  tags: string[];
  usage: string;
  iconBg: string;
  createdAt: string;
  lastUsed: string;
  totalCalls: string;
  avgResponseTime: string;
}

const DEFAULT_ICONS = [MessageSquare, FileText, Database];
const DEFAULT_ICON_BGS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'] as const;

function toApplication(vo: RecentApplicationItemVo, index: number): Application {
  const Icon = DEFAULT_ICONS[index % DEFAULT_ICONS.length];
  const iconBg = DEFAULT_ICON_BGS[index % DEFAULT_ICON_BGS.length] ?? 'bg-blue-500';
  return {
    id: vo.id ?? String(index),
    icon: Icon,
    name: vo.name ?? '未命名应用',
    description: vo.description ?? '',
    fullDescription: vo.fullDescription ?? vo.description ?? '',
    tags: vo.tags ?? [],
    usage: vo.usage ?? '',
    iconBg,
    createdAt: vo.createdAt ?? '',
    lastUsed: vo.lastUsed ?? '',
    totalCalls: vo.totalCalls ?? '-',
    avgResponseTime: vo.avgResponseTime ?? '-',
  };
}

export function useRecentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardApi.getRecentApplications({ limit: 6, offset: 0 });
        const payload = (res as unknown as { data?: { items?: RecentApplicationItemVo[] } })?.data;
        const items = payload?.items ?? [];
        setApplications(items.map((vo: RecentApplicationItemVo, i: number) => toApplication(vo, i)));
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { applications, isLoading };
}
