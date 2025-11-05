import { Check, ChevronDown, Zap, Brain, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/ui/dropdown-menu';
import { Badge } from '@/ui/badge';
import { cn } from '@/ui/utils';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength: string;
  speed: 'fast' | 'medium' | 'slow';
  cost: 'low' | 'medium' | 'high';
  capabilities: string[];
  icon: React.ElementType;
}

interface ModelSwitcherProps {
  currentModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSwitcher({ currentModelId, onModelChange }: ModelSwitcherProps) {
  const models: Model[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: '最强大的推理能力，适合复杂任务',
      contextLength: '128K',
      speed: 'medium',
      cost: 'high',
      capabilities: ['推理', '编程', '创作'],
      icon: Brain,
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: '快速响应，性价比高',
      contextLength: '16K',
      speed: 'fast',
      cost: 'low',
      capabilities: ['对话', '总结', '翻译'],
      icon: Zap,
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: '擅长长文本分析和复杂推理',
      contextLength: '200K',
      speed: 'slow',
      cost: 'high',
      capabilities: ['分析', '推理', '创作'],
      icon: Sparkles,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: '平衡性能与速度',
      contextLength: '200K',
      speed: 'medium',
      cost: 'medium',
      capabilities: ['对话', '编程', '分析'],
      icon: Cpu,
    },
  ];

  const currentModel = models.find(model => model.id === currentModelId) || models[0];
  const CurrentIcon = currentModel.icon;

  const getSpeedLabel = (speed: string) => {
    switch (speed) {
      case 'fast':
        return '快速';
      case 'medium':
        return '中等';
      case 'slow':
        return '较慢';
      default:
        return '';
    }
  };

  const getCostLabel = (cost: string) => {
    switch (cost) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      default:
        return '';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'slow':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return '';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-9">
          <CurrentIcon className="w-4 h-4 text-purple-500" />
          <span className="dark:text-white">{currentModel.name}</span>
          <Badge variant="secondary" className="text-xs">
            {currentModel.contextLength}
          </Badge>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-96 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-2 py-1.5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">选择模型</p>
        </div>
        <DropdownMenuSeparator className="dark:bg-gray-700" />
        <div className="max-h-96 overflow-y-auto">
          {models.map(model => {
            const Icon = model.icon;
            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer',
                  currentModelId === model.id && 'bg-purple-50 dark:bg-purple-900/20'
                )}
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="dark:text-white">{model.name}</span>
                    {currentModelId === model.id && (
                      <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {model.provider}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      上下文 {model.contextLength}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {model.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {model.capabilities.map((cap, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">速度:</span>
                      <span className={getSpeedColor(model.speed)}>
                        {getSpeedLabel(model.speed)}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">成本:</span>
                      <Badge variant="secondary" className={cn('text-xs', getCostColor(model.cost))}>
                        {getCostLabel(model.cost)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator className="dark:bg-gray-700" />
        <DropdownMenuItem className="text-purple-600 dark:text-purple-400 justify-center cursor-pointer">
          模型设置
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
