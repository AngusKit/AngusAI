import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Workflow, Zap, Bot, FileText, Database, MessageSquare, Brain, Code, Settings, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 工作流图标选项 - 包含不同类型的工作流图标
const iconOptions = [
  {
    icon: Workflow,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    color: 'text-blue-600 dark:text-blue-400',
    label: '工作流',
  },
  {
    icon: Zap,
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    color: 'text-yellow-600 dark:text-yellow-400',
    label: '快速执行',
  },
  {
    icon: Bot,
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    color: 'text-purple-600 dark:text-purple-400',
    label: 'AI助手',
  },
  {
    icon: FileText,
    bg: 'bg-green-100 dark:bg-green-900/30',
    color: 'text-green-600 dark:text-green-400',
    label: '文档处理',
  },
  {
    icon: Database,
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    color: 'text-indigo-600 dark:text-indigo-400',
    label: '数据处理',
  },
  {
    icon: MessageSquare,
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    color: 'text-pink-600 dark:text-pink-400',
    label: '对话流程',
  },
  {
    icon: Brain,
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    color: 'text-orange-600 dark:text-orange-400',
    label: '智能分析',
  },
  {
    icon: Code,
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    color: 'text-cyan-600 dark:text-cyan-400',
    label: '代码执行',
  },
  {
    icon: Settings,
    bg: 'bg-gray-100 dark:bg-gray-700/30',
    color: 'text-gray-600 dark:text-gray-400',
    label: '自动化',
  },
  {
    icon: GitBranch,
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    color: 'text-teal-600 dark:text-teal-400',
    label: '流程分支',
  },
];

// 工作流类型
const workflowTypes = [
  {
    value: 'single-task',
    label: '单轮任务流',
    description: '执行单次任务的工作流，不保留上下文',
  },
  {
    value: 'multi-conversation',
    label: '多轮对话流（记忆）',
    description: '支持多轮对话并保留上下文记忆的工作流',
  },
];

export function CreateWorkflowDialog({ open, onOpenChange }: CreateWorkflowDialogProps) {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [workflowType, setWorkflowType] = useState('single-task');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [autoStart, setAutoStart] = useState(false);

  // 标签颜色映射
  const getTagColor = (tag: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    ];

    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (!newTag) return;

      if (newTag.length > 10) {
        toast.error('标签长度不能超过10个字符');
        return;
      }

      if (tags.length >= 5) {
        toast.error('最多只能添加5个标签');
        return;
      }

      if (tags.includes(newTag)) {
        toast.error('标签已存在');
        return;
      }

      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = () => {
    if (!workflowName.trim()) {
      toast.error('请输入工作流名称');
      return;
    }
    if (!description.trim()) {
      toast.error('请输入工作流描述');
      return;
    }

    // 创建工作流
    toast.success('工作流创建成功！');

    // 重置表单
    setWorkflowName('');
    setDescription('');
    setWorkflowType('single-task');
    setSelectedIcon(0);
    setTags([]);
    setTagInput('');
    setAutoStart(false);

    onOpenChange(false);
  };

  const handleCancel = () => {
    // 重置表单
    setWorkflowName('');
    setDescription('');
    setWorkflowType('single-task');
    setSelectedIcon(0);
    setTags([]);
    setTagInput('');
    setAutoStart(false);

    onOpenChange(false);
  };

  const selectedWorkflowType = workflowTypes.find(t => t.value === workflowType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[1000px] max-w-[90vw] sm:max-w-[1000px] dark:bg-gray-900 dark:border-gray-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>创建工作流</DialogTitle>
          <DialogDescription className='text-gray-500 dark:text-gray-400'>
            创建一个新的AI工作流来自动化您的任务流程
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-5 py-4'>
          {/* 名称和类型在同一行 */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>工作流名称</Label>
              <Input
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value)}
                placeholder='请输入工作流名称'
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>工作流类型</Label>
              <Select value={workflowType} onValueChange={setWorkflowType}>
                <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {workflowTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className='dark:text-white'>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 类型描述提示 */}
          {selectedWorkflowType && (
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
              <p className='text-sm text-blue-800 dark:text-blue-300'>
                <span className='font-semibold'>{selectedWorkflowType.label}：</span>
                {selectedWorkflowType.description}
              </p>
            </div>
          )}

          {/* 描述 */}
          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>描述</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='请输入工作流描述'
              rows={3}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none'
            />
          </div>

          {/* 标签 */}
          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              标签 <span className='text-gray-400'>({tags.length}/5)</span>
            </Label>
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder='输入标签后按回车，最多5个，每个不超过10字符'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              disabled={tags.length >= 5}
              maxLength={10}
            />
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {tags.map(tag => (
                  <Badge key={tag} className={`border-0 ${getTagColor(tag)}`}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className='ml-1 hover:opacity-70 transition-opacity'>
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 图标 */}
          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>图标</Label>
            <div className='grid grid-cols-5 gap-3'>
              {iconOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedIcon(index)}
                    className={`${option.bg} h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                      selectedIcon === index
                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                        : 'hover:scale-105'
                    }`}
                    title={option.label}
                  >
                    <Icon className={`w-6 h-6 ${option.color}`} />
                    <span className='text-xs text-gray-600 dark:text-gray-400 mt-1'>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 自动启动选项 */}
          <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <input
              type='checkbox'
              id='auto-start'
              checked={autoStart}
              onChange={e => setAutoStart(e.target.checked)}
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <Label htmlFor='auto-start' className='text-sm dark:text-gray-300 cursor-pointer'>
              创建后自动启动工作流
            </Label>
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          >
            取消
          </Button>
          <Button onClick={handleCreate} className='bg-blue-500 hover:bg-blue-600 text-white'>
            创建
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
