/**
 * 新建工作流子页面
 * 支持选择类型、图标、标签等，创建后可选自动启动
 */
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card } from '@/components/ui/card.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { ChevronLeft } from 'lucide-react';
import { Workflow, Zap, Bot, FileText, Database, MessageSquare, Brain, Code, Settings, GitBranch } from 'lucide-react';
import { WorkflowTypeEnum } from '@/enums/enums.ts';
import { useCreateWorkflowForm } from '../hooks/useCreateWorkflowForm';

// 工作流图标选项
const iconOptions = [
  { icon: Workflow, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400', label: '工作流' },
  { icon: Zap, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400', label: '快速执行' },
  { icon: Bot, bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400', label: 'AI助手' },
  { icon: FileText, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400', label: '文档处理' },
  { icon: Database, bg: 'bg-indigo-100 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400', label: '数据处理' },
  { icon: MessageSquare, bg: 'bg-pink-100 dark:bg-pink-900/30', color: 'text-pink-600 dark:text-pink-400', label: '对话流程' },
  { icon: Brain, bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400', label: '智能分析' },
  { icon: Code, bg: 'bg-cyan-100 dark:bg-cyan-900/30', color: 'text-cyan-600 dark:text-cyan-400', label: '代码执行' },
  { icon: Settings, bg: 'bg-gray-100 dark:bg-gray-700/30', color: 'text-gray-600 dark:text-gray-400', label: '自动化' },
  { icon: GitBranch, bg: 'bg-teal-100 dark:bg-teal-900/30', color: 'text-teal-600 dark:text-teal-400', label: '流程分支' },
];

const workflowTypes = [
  { value: WorkflowTypeEnum.SINGLE_TASK, label: '单轮任务流', description: '执行单次任务的工作流，不保留上下文' },
  { value: WorkflowTypeEnum.MULTI_TURN, label: '多轮对话流（记忆）', description: '支持多轮对话并保留上下文记忆的工作流' },
];

function getTagColor(tag: string): string {
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
  return colors[index] ?? colors[0]!;
}

export function CreateWorkflowPage() {
  const {
    workflowName,
    setWorkflowName,
    description,
    setDescription,
    workflowType,
    setWorkflowType,
    submitting,
    selectedIcon,
    setSelectedIcon,
    tags,
    tagInput,
    setTagInput,
    autoStart,
    setAutoStart,
    handleAddTag,
    handleRemoveTag,
    handleCreate,
    onBack,
  } = useCreateWorkflowForm();

  const selectedWorkflowType = workflowTypes.find(t => t.value === workflowType);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' onClick={onBack} className='dark:text-gray-300'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          返回
        </Button>
      </div>

      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>创建工作流</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>创建一个新的AI工作流来自动化您的任务流程</p>
      </div>

      <ScrollArea className='h-[calc(100vh-280px)] pr-4'>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='space-y-5'>
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
                <Select value={workflowType} onValueChange={v => setWorkflowType(v as WorkflowTypeEnum)}>
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

            {selectedWorkflowType && (
              <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
                <p className='text-sm text-blue-800 dark:text-blue-300'>
                  <span className='font-semibold'>{selectedWorkflowType.label}：</span>
                  {selectedWorkflowType.description}
                </p>
              </div>
            )}

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
        </Card>
      </ScrollArea>

      <div className='flex justify-between sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-700 -mx-7 px-7'>
        <Button variant='outline' onClick={onBack} className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          取消
        </Button>
        <Button onClick={handleCreate} disabled={submitting} className='bg-blue-500 hover:bg-blue-600 text-white'>
          {submitting ? '创建中...' : '创建'}
        </Button>
      </div>
    </div>
  );
}
