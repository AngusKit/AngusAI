import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Save, X, Calendar, Clock, TrendingUp, Activity, Tag, Workflow as WorkflowIcon, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowDetailVo } from '@/services/WorkflowsTypes';
import { WorkflowStatusEnum, WorkflowTypeEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';

const statusDisplayMap: Record<WorkflowStatusEnum, string> = {
  [WorkflowStatusEnum.DRAFT]: '草稿',
  [WorkflowStatusEnum.RUNNING]: '运行中',
  [WorkflowStatusEnum.STOPPED]: '已停止',
};

export function WorkflowDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<WorkflowDetailVo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState({ name: '', description: '', status: WorkflowStatusEnum.DRAFT });
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await Workflows.getWorkflowDetail(id);
      const data = (res as { data?: WorkflowDetailVo }).data;
      if (data) {
        setDetail(data);
        setFormData({
          name: data.name ?? '',
          description: data.description ?? '',
          status: (data.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT,
        });
      } else {
        toast.error('工作流不存在');
        navigate('/workflow');
      }
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '加载失败');
      navigate('/workflow');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (id && !loading && !detail) {
      navigate('/workflow');
    }
  }, [id, loading, detail, navigate]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await Workflows.updateWorkflow(id, {
        name: formData.name,
        description: formData.description,
      });
      toast.success('工作流信息已保存');
      setMode('view');
      loadDetail();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => setMode('edit');

  const handleCancel = () => {
    if (detail) {
      setFormData({
        name: detail.name ?? '',
        description: detail.description ?? '',
        status: (detail.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT,
      });
    }
    setMode('view');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDesign = () => {
    if (!detail) return;
    const statusDisplay = statusDisplayMap[(detail.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT];
    navigate(`/workflow-design?workflowId=${id}&workflowName=${encodeURIComponent(detail.name ?? '')}&workflowStatus=${statusDisplay}`);
  };

  if (loading || !detail) {
    return (
      <div className='flex items-center justify-center py-24'>
        <span className='text-gray-500 dark:text-gray-400'>加载中...</span>
      </div>
    );
  }

  const status = (detail.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT;
  const statusDisplay = statusDisplayMap[status];
  const stats = detail.executionStats;
  const totalExec = stats?.totalExecutions ?? 0;
  const successTotal = stats?.successfulExecutions ?? 0;
  const todayCalls = totalExec > 0 ? String(totalExec) : '--';
  const successRate = totalExec > 0 ? `${((successTotal / totalExec) * 100).toFixed(1)}%` : '--';

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' onClick={() => navigate('/workflow')} className='dark:text-gray-300'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          返回
        </Button>
      </div>

      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
            <WorkflowIcon className='w-6 h-6 text-blue-500' />
          </div>
          <div>
            <h1 className='text-2xl dark:text-white'>{mode === 'view' ? '工作流详情' : '编辑工作流'}</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {mode === 'view' ? '查看工作流的详细信息和统计数据' : '修改工作流的基本配置信息'}
            </p>
          </div>
        </div>
        {mode === 'view' && (
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={handleDesign} className='dark:bg-gray-800 dark:border-gray-700'>
              <Edit2 className='w-4 h-4 mr-2' />
              设计工作流
            </Button>
            <Button variant='outline' size='sm' onClick={handleEdit} className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <Edit2 className='w-4 h-4 mr-2' />
              编辑
            </Button>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='flex items-center gap-2 text-gray-900 dark:text-white mb-4'>
            <WorkflowIcon className='w-4 h-4' />
            基本信息
          </h3>

          <div className='space-y-4 pl-6'>
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>工作流名称</Label>
              {mode === 'edit' ? (
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder='请输入工作流名称'
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                />
              ) : (
                <p className='text-sm text-gray-700 dark:text-gray-300'>{formData.name}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>工作流类型</Label>
              <p className='text-sm text-gray-700 dark:text-gray-300'>
                {detail.type ? getEnumDescription(WorkflowTypeEnum, detail.type as WorkflowTypeEnum) ?? detail.type : '--'}
              </p>
            </div>

            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>描述</Label>
              {mode === 'edit' ? (
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder='请输入工作流描述'
                  rows={3}
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none'
                />
              ) : (
                <p className='text-sm text-gray-700 dark:text-gray-300'>{formData.description || '--'}</p>
              )}
            </div>

            {tags.length > 0 && (
              <div className='space-y-2'>
                <Label className='dark:text-gray-300 flex items-center gap-2'>
                  <Tag className='w-4 h-4' />
                  标签
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {tags.map(tag => (
                    <Badge key={tag} variant='secondary' className='dark:bg-gray-700 dark:text-gray-300'>
                      {tag}
                      {mode === 'edit' && (
                        <button onClick={() => handleRemoveTag(tag)} className='ml-2 hover:text-red-500'>
                          <X className='w-3 h-3' />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {mode === 'edit' && (
                  <div className='flex gap-2'>
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      placeholder='添加新标签'
                      className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                    />
                    <Button type='button' variant='outline' onClick={handleAddTag} className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                      添加
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>当前状态</Label>
              <Badge
                className={`${
                  status === WorkflowStatusEnum.RUNNING
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
                } border-0`}
              >
                {statusDisplay}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='flex items-center gap-2 text-gray-900 dark:text-white mb-4'>
            <Activity className='w-4 h-4' />
            运行统计
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 pl-6'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <TrendingUp className='w-4 h-4' />
                调用次数
              </div>
              <p className='text-xl text-gray-900 dark:text-white'>{todayCalls}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <Activity className='w-4 h-4' />
                成功率
              </div>
              <p className='text-xl text-gray-900 dark:text-white'>{successRate}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <Calendar className='w-4 h-4' />
                创建时间
              </div>
              <p className='text-sm text-gray-700 dark:text-gray-300'>{detail.createdDate ?? '--'}</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <Clock className='w-4 h-4' />
                最后修改
              </div>
              <p className='text-sm text-gray-700 dark:text-gray-300'>{(detail as { modifiedDate?: string }).modifiedDate ?? detail.createdDate ?? '--'}</p>
            </div>
          </div>
        </Card>

        {mode === 'edit' && (
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={handleCancel} className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <X className='w-4 h-4 mr-2' />
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving} className='bg-blue-500 hover:bg-blue-600 text-white'>
              <Save className='w-4 h-4 mr-2' />
              {saving ? '保存中...' : '保存更改'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
