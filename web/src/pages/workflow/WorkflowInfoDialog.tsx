import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Calendar, Clock, TrendingUp, Activity, Tag, Workflow as WorkflowIcon, Edit2, Eye, } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: {
    id: number;
    name: string;
    description: string;
    status: string;
    calls: string;
    successRate: string;
  };
  mode?: 'view' | 'edit';
}

export function WorkflowInfoDialog({
  open,
  onOpenChange,
  workflow,
  mode: initialMode = 'view',
}: WorkflowInfoDialogProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [formData, setFormData] = useState({
    name: workflow.name,
    description: workflow.description,
    type: 'single-task',
    status: workflow.status,
    tags: ['AI处理', '自动化', '客户服务'],
    icon: '🤖',
    autoStart: true,
  });

  const handleSave = () => {
    toast.success('工作流信息已保存');
    setMode('view');
  };

  const handleEdit = () => {
    setMode('edit');
  };

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

  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[800px] max-w-[90vw] sm:max-w-[800px] dark:bg-gray-900 dark:border-gray-700 max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                <WorkflowIcon className='w-6 h-6 text-blue-500' />
              </div>
              <div>
                <DialogTitle className='dark:text-white'>{mode === 'view' ? '工作流详情' : '编辑工作流'}</DialogTitle>
                <DialogDescription className='dark:text-gray-400'>
                  {mode === 'view' ? '查看工作流的详细信息和统计数据' : '修改工作流的基本配置信息'}
                </DialogDescription>
              </div>
            </div>
            {mode === 'view' && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleEdit}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                <Edit2 className='w-4 h-4 mr-2' />
                编辑
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* 基本信息 */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-gray-900 dark:text-white'>
              <WorkflowIcon className='w-4 h-4' />
              基本信息
            </h3>

            <div className='space-y-4 pl-6'>
              {/* 工作流名称 */}
              <div className='space-y-2'>
                <Label htmlFor='name' className='dark:text-gray-300'>
                  工作流名称
                </Label>
                {mode === 'edit' ? (
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='请输入工作流名称'
                    className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                  />
                ) : (
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{formData.name}</p>
                )}
              </div>

              {/* 工作流类型 */}
              <div className='space-y-2'>
                <Label htmlFor='type' className='dark:text-gray-300'>
                  工作流类型
                </Label>
                {mode === 'edit' ? (
                  <Select value={formData.type} onValueChange={value => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                      <SelectItem value='single-task' className='dark:text-gray-300'>
                        单轮任务流
                      </SelectItem>
                      <SelectItem value='multi-conversation' className='dark:text-gray-300'>
                        多轮对话流（记忆）
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {formData.type === 'single-task'
                      ? '单轮任务流'
                      : formData.type === 'multi-conversation'
                        ? '多轮对话流（记忆）'
                        : formData.type}
                  </p>
                )}
              </div>

              {/* 描述 */}
              <div className='space-y-2'>
                <Label htmlFor='description' className='dark:text-gray-300'>
                  描述
                </Label>
                {mode === 'edit' ? (
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder='请输入工作流描述'
                    rows={3}
                    className='dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none'
                  />
                ) : (
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{formData.description}</p>
                )}
              </div>

              {/* 标签 */}
              <div className='space-y-2'>
                <Label className='dark:text-gray-300 flex items-center gap-2'>
                  <Tag className='w-4 h-4' />
                  标签
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {formData.tags.map(tag => (
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
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleAddTag}
                      className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                    >
                      添加
                    </Button>
                  </div>
                )}
              </div>

              {/* 状态 */}
              <div className='space-y-2'>
                <Label className='dark:text-gray-300'>当前状态</Label>
                <div>
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
            </div>
          </div>

          {/* 统计数据 */}
          <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
            <h3 className='flex items-center gap-2 text-gray-900 dark:text-white'>
              <Activity className='w-4 h-4' />
              运行统计
            </h3>

            <div className='grid grid-cols-2 gap-4 pl-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <TrendingUp className='w-4 h-4' />
                  调用次数
                </div>
                <p className='text-xl text-gray-900 dark:text-white'>{workflow.calls}</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Activity className='w-4 h-4' />
                  成功率
                </div>
                <p className='text-xl text-gray-900 dark:text-white'>{workflow.successRate}</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Calendar className='w-4 h-4' />
                  创建时间
                </div>
                <p className='text-sm text-gray-700 dark:text-gray-300'>2024-01-15 10:30</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Clock className='w-4 h-4' />
                  最后修改
                </div>
                <p className='text-sm text-gray-700 dark:text-gray-300'>2024-01-20 14:25</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Activity className='w-4 h-4' />
                  平均响应时间
                </div>
                <p className='text-sm text-gray-700 dark:text-gray-300'>1.2秒</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <TrendingUp className='w-4 h-4' />
                  节点总数
                </div>
                <p className='text-sm text-gray-700 dark:text-gray-300'>5个节点</p>
              </div>
            </div>
          </div>

          {/* 性能指标 */}
          <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
            <h3 className='flex items-center gap-2 text-gray-900 dark:text-white'>
              <TrendingUp className='w-4 h-4' />
              性能指标
            </h3>

            <div className='space-y-3 pl-6'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>CPU使用率</span>
                  <span className='text-gray-900 dark:text-white'>45%</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div className='bg-blue-500 h-2 rounded-full' style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>内存使用</span>
                  <span className='text-gray-900 dark:text-white'>62%</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div className='bg-green-500 h-2 rounded-full' style={{ width: '62%' }}></div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>网络吞吐</span>
                  <span className='text-gray-900 dark:text-white'>78%</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          {mode === 'edit' ? (
            <>
              <Button
                variant='outline'
                onClick={handleCancel}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                <X className='w-4 h-4 mr-2' />
                取消
              </Button>
              <Button onClick={handleSave} className='bg-blue-500 hover:bg-blue-600 text-white'>
                <Save className='w-4 h-4 mr-2' />
                保存更改
              </Button>
            </>
          ) : (
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              关闭
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
