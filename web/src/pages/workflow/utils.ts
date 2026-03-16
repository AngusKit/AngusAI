/**
 * 工作流模块工具函数
 */
import type { WorkflowListVo, WorkflowStatisticsVo } from '@/services/WorkflowsTypes';
import { VisibilityEnum, WorkflowStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { ICON_BG_MAP, STATUS_COLOR_MAP, STATUS_DISPLAY_MAP } from './constants';

/** 列表项展示数据结构 */
export interface WorkflowDisplayItem {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
  status: WorkflowStatusEnum | string;
  statusDisplay: string;
  statusColor: string;
  visibility?: string;
  visibilityDisplay?: string;
  calls: string;
  successRate: string;
}

/**
 * 将 API 返回的工作流 VO 转换为列表展示项
 */
export function mapWorkflowVoToItem(vo: WorkflowListVo): WorkflowDisplayItem {
  const status = (vo.status ?? WorkflowStatusEnum.DRAFT) as WorkflowStatusEnum;
  const stats = vo.stats as Record<string, unknown> | undefined;
  const todayCalls = stats?.todayCalls != null ? Number(stats.todayCalls) : 0;
  const successRateVal = stats?.successRate != null ? Number(stats.successRate) : null;
  const iconStyle = ICON_BG_MAP[vo.iconBg ?? ''] ?? ICON_BG_MAP['bg-blue-500'];

  const visibility = (vo.visibility ?? VisibilityEnum.PRIVATE) as VisibilityEnum;
  return {
    id: vo.id ?? '',
    name: vo.name ?? '',
    description: vo.description ?? '',
    iconBg: iconStyle.bg,
    iconColor: iconStyle.color,
    status,
    statusDisplay: STATUS_DISPLAY_MAP[status] ?? status,
    statusColor: STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP[WorkflowStatusEnum.DRAFT],
    visibility,
    visibilityDisplay: getEnumDescription(VisibilityEnum, visibility),
    calls: `今日运行：${todayCalls} 次`,
    successRate: successRateVal != null ? `成功率：${successRateVal.toFixed(1)}%` : '--',
  };
}

/** 统计数字格式化后的展示结果 */
export interface StatsDisplay {
  totalWorkflows: string;
  runningWorkflows: string;
  todayCalls: string;
  successRate: string;
}

/**
 * 将统计 API 返回数据格式化为可展示的字符串
 */
export function getStatsFromStatistics(stats: WorkflowStatisticsVo | null): StatsDisplay {
  if (!stats) {
    return {
      totalWorkflows: '--',
      runningWorkflows: '--',
      todayCalls: '--',
      successRate: '--',
    };
  }
  const total = Number(stats.totalWorkflows ?? 0);
  const running = Number(stats.runningWorkflows ?? 0);
  const today = Number(stats.todayCalls ?? 0);
  const rate = Number(stats.successRate ?? NaN);
  return {
    totalWorkflows: String(total),
    runningWorkflows: String(running),
    todayCalls: !Number.isNaN(today) ? today.toLocaleString() : '--',
    successRate: !Number.isNaN(rate) ? `${rate.toFixed(1)}%` : '--',
  };
}
