import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import type { AgentDetailVo } from '@/services/AgentsTypes';
import { AgentStatusEnum } from '@/enums/enums';

/**
 * 智能体详情页 Hook：加载详情、状态切换
 */
export function useAgentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AgentDetailVo | null>(null);

  /** 加载智能体详情 */
  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await Agents.getAgentDetail(id);
      const d: AgentDetailVo | undefined = (res as any)?.data;
      if (!d) {
        toast.error('智能体不存在');
        navigate('/agents');
        return;
      }
      setDetail(d);
    } catch (err: any) {
      toast.error(err?.message || '加载失败');
      navigate('/agents');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  /** 切换发布/离线状态 */
  const handleToggleStatus = async () => {
    if (!id || !detail?.status) return;
    const newStatus: AgentStatusEnum =
      detail.status === AgentStatusEnum.ACTIVE ? AgentStatusEnum.INACTIVE : AgentStatusEnum.ACTIVE;
    try {
      await Agents.updateAgentStatus(id, newStatus);
      toast.success(newStatus === AgentStatusEnum.ACTIVE ? '已发布' : '离线');
      setDetail(d => (d ? { ...d, status: newStatus } : null));
    } catch (error: any) {
      toast.error(error?.message || '操作失败');
    }
  };

  return {
    id,
    detail,
    loading,
    loadDetail,
    handleToggleStatus,
    navigate,
  };
}
