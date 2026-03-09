import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Save, X, Calendar, Clock, TrendingUp, Activity, Tag, Workflow as WorkflowIcon, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

// 工作流 mock 数据 - 实际应从 API 获取
const MOCK_WORKFLOWS: Record<string, { id: number; name: string; description: string; status: string; calls: string; successRate: string }> = {
  '1': { id: 1, name: '客户服务自动化', description: '自动处理客户咨询请求并提供相应的解答', status: '运行中', calls: '今日运行：156 次', successRate: '成功率：99.2%' },
  '2': { id: 2, name: '内容生成流程链', description: '自动化内容生成流程，从构思到完稿', status: '运行中', calls: '今日运行：89 次', successRate: '成功率：97.8%' },
  '3': { id: 3, name: '数据分析评估', description: '自动化数据采集分析与可视化展现流程', status: '已停止', calls: '今日运行：0 次', successRate: '成功率：96.5%' },
  '4': { id: 4, name: '邮件营销自动化', description: '自动化邮件营销活动，包括内容生成和发送', status: '运行中', calls: '今日运行：234 次', successRate: '成功率：98.5%' },
  '5': { id: 5, name: '智能文档处理', description: '自动化文档分类、提取和归档处理流程', status: '运行中', calls: '今日运行：127 次', successRate: '成功率：97.2%' },
  '6': { id: 6, name: '社交媒体发布', description: '多平台社交媒体内容自动生成和发布', status: '已停止', calls: '今日运行：0 次', successRate: '成功率：95.8%' },
  '7': { id: 7, name: '订单处理流程', description: '自动化订单确认、处理和通知流程', status: '运行中', calls: '今日运行：412 次', successRate: '成功率：99.5%' },
  '8': { id: 8, name: '知识库维护', description: '自动化知识库内容更新和优化流程', status: '运行中', calls: '今日运行：78 次', successRate: '成功率：96.9%' },
};

export function WorkflowDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const workflow = id ? MOCK_WORKFLOWS[id] : undefined;

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState({
    name: workflow?.name ?? '',
    description: workflow?.description ?? '',
    type: 'single-task',
    status: workflow?.status ?? '运行中',
    tags: ['AI处理', '自动化', '客户服务'],
    icon: '🤖',
    autoStart: true,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description,
        type: 'single-task',
        status: workflow.status,
        tags: ['AI处理', '自动化', '客户服务'],
        icon: '🤖',
        autoStart: true,
      });
    }
  }, [id, workflow?.id]);

  useEffect(() => {
    if (id && !workflow) {
      toast.error('工作流不存在');
      navigate('/workflow');
    }
  }, [id, workflow, navigate]);

  if (!workflow) return null;

  const handleSave = () => {
    toast.success('工作流信息已保存');
    setMode('view');
  };

  const handleEdit = () => setMode('edit');

  const handleCancel = () => {
    setFormData({
      name: workflow.name,
      description: workflow.description,
      type: 'single-task',
      status: workflow.status,
      tags: ['AI处理', '自动化', '客户服务'],
      icon: '🤖',
      autoStart: true,
    });
    setMode('view');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleDesign = () => {
    navigate(`/workflow-design?workflowId=${workflow.id}&workflowName=${workflow.name}&workflowStatus=${workflow.status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/workflow')} className="dark:text-gray-300">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <WorkflowIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl dark:text-white">{mode === 'view' ? '工作流详情' : '编辑工作流'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'view' ? '查看工作流的详细信息和统计数据' : '修改工作流的基本配置信息'}
            </p>
          </div>
        </div>
        {mode === 'view' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDesign} className="dark:bg-gray-800 dark:border-gray-700">
              <Edit2 className="w-4 h-4 mr-2" />
              设计工作流
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <Edit2 className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
            <WorkflowIcon className="w-4 h-4" />
            基本信息
          </h3>

          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">工作流名称</Label>
              {mode === 'edit' ? (
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入工作流名称"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">{formData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">工作流类型</Label>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formData.type === 'single-task' ? '单轮任务流' : formData.type === 'multi-conversation' ? '多轮对话流（记忆）' : formData.type}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">描述</Label>
              {mode === 'edit' ? (
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入工作流描述"
                  rows={3}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">{formData.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签
              </Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    {tag}
                    {mode === 'edit' && (
                      <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {mode === 'edit' && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                    placeholder="添加新标签"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    添加
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">当前状态</Label>
              <Badge
                className={`${
                  formData.status === '运行中'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
                } border-0`}
              >
                {formData.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
            <Activity className="w-4 h-4" />
            运行统计
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                调用次数
              </div>
              <p className="text-xl text-gray-900 dark:text-white">{workflow.calls}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                成功率
              </div>
              <p className="text-xl text-gray-900 dark:text-white">{workflow.successRate}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                创建时间
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">2024-01-15 10:30</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                最后修改
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">2024-01-20 14:25</p>
            </div>
          </div>
        </Card>

        {mode === 'edit' && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              保存更改
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
