import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { refreshResourcesBadge } from '@/hooks/useResourcesBadge';
import Applications from '@/services/Applications';
import type { ApplicationDetailVo, ApplicationStatisticsVo } from '@/services/ApplicationsTypes';
import { ApplicationStatusEnum } from '@/enums/enums';

/** 默认统计时间范围：最近7天 */
function getDefaultStatsRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    period: 'DAY' as const,
  };
}

/**
 * 应用详情页 Hook：加载详情、状态切换、复制、删除等
 */
export function useApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ApplicationDetailVo | null>(null);
  const [statistics, setStatistics] = useState<ApplicationStatisticsVo | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  /** 加载应用详情与完整统计数据（含 overview、trends、topUsers） */
  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const range = getDefaultStatsRange();
      const [detailRes, statsRes] = await Promise.all([
        Applications.getApplicationDetail(id),
        Applications.getApplicationStatistics(id, range).catch(() => null),
      ]);
      const d = (detailRes as any)?.data ?? detailRes;
      if (!d?.id && !d?.name) {
        toast.error('应用不存在');
        navigate('/apps');
        return;
      }
      const statsData = (statsRes as any)?.data ?? statsRes;
      const overview = statsData?.overview ?? statsData;
      setDetail({
        ...d,
        stats: overview ? { ...d?.stats, ...overview } : d?.stats,
      } as ApplicationDetailVo);
      setStatistics(statsData);
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || '加载失败');
      navigate('/apps');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  /** 切换发布/暂停状态 */
  const handleToggleStatus = async () => {
    if (!id || !detail?.status) return;
    const isPublished = detail.status === ApplicationStatusEnum.PUBLISHED;
    const newStatus = isPublished ? ApplicationStatusEnum.PAUSED : ApplicationStatusEnum.PUBLISHED;
    try {
      await Applications.modifyApplicationStatus(id, { status: newStatus });
      toast.success(isPublished ? '已暂停' : '已发布');
      setDetail(d => (d ? { ...d, status: newStatus } : null));
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? '操作失败');
    }
  };

  /** 复制应用 */
  const handleDuplicate = async () => {
    if (!id || !detail?.name) return;
    try {
      const res: any = await Applications.duplicateApplication(id, { name: `${detail.name} 副本` });
      const data = res?.data ?? res;
      const newId = data?.id ?? data?.id;
      toast.success('复制成功');
      if (newId) navigate(`/apps/${newId}`);
      else loadDetail();
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? '复制失败');
    }
  };

  /** 删除应用 */
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('确定要删除此应用吗？此操作不可恢复。')) return;
    try {
      await Applications.deleteApplication(id);
      toast.success('已删除');
      refreshResourcesBadge();
      navigate('/apps');
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? '删除失败');
    }
  };

  return {
    id,
    detail,
    statistics,
    loading,
    shareDialogOpen,
    setShareDialogOpen,
    loadDetail,
    handleToggleStatus,
    handleDuplicate,
    handleDelete,
    navigate,
  };
}
