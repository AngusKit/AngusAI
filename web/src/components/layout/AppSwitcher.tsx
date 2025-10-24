import {
  Bot,
  Check,
  ChevronDown,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface App {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  type: 'chat' | 'agent' | 'workflow';
  isOnline: boolean;
}

interface AppSwitcherProps {
  currentAppId: string;
  onAppChange: (appId: string) => void;
}

export function AppSwitcher({ currentAppId, onAppChange }: AppSwitcherProps) {
  const apps: App[] = [
    {
      id: 'app-1',
      name: '智能客服助手',
      description: '提供7x24小时智能客服服务',
      icon: MessageSquare,
      type: 'chat',
      isOnline: true,
    },
    {
      id: 'app-2',
      name: '代码审查助手',
      description: '自动审查代码质量和最佳实践',
      icon: Sparkles,
      type: 'agent',
      isOnline: true,
    },
    {
      id: 'app-3',
      name: '文档写作助手',
      description: '智能辅助技术文档编写',
      icon: Bot,
      type: 'chat',
      isOnline: true,
    },
    {
      id: 'app-4',
      name: '数据分析助手',
      description: '智能数据分析与可视化',
      icon: Zap,
      type: 'workflow',
      isOnline: false,
    },
  ];

  const currentApp = apps.find(app => app.id === currentAppId) || apps[0];
  const CurrentIcon = currentApp.icon;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'chat':
        return '对话型';
      case 'agent':
        return '智能体';
      case 'workflow':
        return '工作流';
      default:
        return '';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'chat':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'agent':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'workflow':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default:
        return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='gap-2 h-9'>
          <CurrentIcon className='w-4 h-4 text-blue-500' />
          <span className='dark:text-white'>{currentApp.name}</span>
          <ChevronDown className='w-4 h-4 text-gray-400' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='w-80 dark:bg-gray-800 dark:border-gray-700'
      >
        <div className='px-2 py-1.5'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
            选择应用
          </p>
        </div>
        <DropdownMenuSeparator className='dark:bg-gray-700' />
        <div className='max-h-96 overflow-y-auto'>
          {apps.map(app => {
            const Icon = app.icon;
            return (
              <DropdownMenuItem
                key={app.id}
                onClick={() => onAppChange(app.id)}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer',
                  currentAppId === app.id && 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    app.type === 'chat' && 'bg-blue-100 dark:bg-blue-900/30',
                    app.type === 'agent' &&
                      'bg-purple-100 dark:bg-purple-900/30',
                    app.type === 'workflow' &&
                      'bg-green-100 dark:bg-green-900/30'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      app.type === 'chat' && 'text-blue-600 dark:text-blue-400',
                      app.type === 'agent' &&
                        'text-purple-600 dark:text-purple-400',
                      app.type === 'workflow' &&
                        'text-green-600 dark:text-green-400'
                    )}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='dark:text-white truncate'>{app.name}</span>
                    {currentAppId === app.id && (
                      <Check className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                    )}
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
                    {app.description}
                  </p>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className={cn('text-xs', getTypeBadgeClass(app.type))}
                    >
                      {getTypeLabel(app.type)}
                    </Badge>
                    {app.isOnline ? (
                      <div className='flex items-center gap-1'>
                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                        <span className='text-xs text-green-600 dark:text-green-400'>
                          在线
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                        <span className='w-1.5 h-1.5 bg-gray-400 rounded-full'></span>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          离线
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator className='dark:bg-gray-700' />
        <DropdownMenuItem className='text-blue-600 dark:text-blue-400 justify-center cursor-pointer'>
          查看所有应用
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
