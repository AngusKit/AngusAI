import {
  Check,
  ChevronDown,
  Search,
  Loader2,
  LayoutGrid,
  Bot,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { useLanguage } from '@/components/LanguageProvider';
import { useChatSwitcher, type ChatSwitcherSelection } from './hooks/useChatSwitcher';

export type { ChatSwitcherSelection };

interface ChatSwitcherProps {
  selection: ChatSwitcherSelection;
  onSelectionChange: (s: ChatSwitcherSelection) => void;
}

export function ChatSwitcher({ selection, onSelectionChange }: ChatSwitcherProps) {
  const { t } = useLanguage();
  const {
    appOpen,
    setAppOpen,
    agentOpen,
    setAgentOpen,
    modelOpen,
    setModelOpen,
    appKeyword,
    setAppKeyword,
    modelKeyword,
    setModelKeyword,
    apps,
    appLoading,
    appLoadMore,
    models,
    modelLoading,
    modelLoadMore,
    appScrollRef,
    modelScrollRef,
    agents,
    displayApp,
    selectedModelId,
    handleAppScroll,
    handleModelScroll,
    handleSelectApp,
    handleSelectAgent,
    handleSelectModel,
    appDisplayName,
    agentDisplayName,
    modelDisplayName,
  } = useChatSwitcher({ selection, onSelectionChange });

  return (
    <div className='flex items-center gap-2'>
      {/* 应用选择 */}
      <DropdownMenu open={appOpen} onOpenChange={setAppOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='gap-2 h-9 max-w-[160px]'>
            {displayApp?.icon ? (
              <span className='w-4 h-4 flex items-center justify-center text-lg flex-shrink-0'>{displayApp.icon}</span>
            ) : (
              <LayoutGrid className='w-4 h-4 text-blue-500 flex-shrink-0' />
            )}
            <span className='dark:text-white truncate'>{appDisplayName}</span>
            <ChevronDown className='w-4 h-4 text-gray-400 flex-shrink-0' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-[300px] p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-2 border-b dark:border-gray-700'>
            <div className='relative'>
              <Search className='absolute ml-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='搜索应用...'
                value={appKeyword}
                onChange={(e) => setAppKeyword(e.target.value)}
                className='pl-9 h-8'
              />
            </div>
          </div>
          <div
            ref={appScrollRef}
            className='max-h-[280px] overflow-y-auto'
            onScroll={handleAppScroll}
          >
            {appLoading && apps.length === 0 ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
              </div>
            ) : !appLoading && apps.length === 0 ? (
              <div className='py-8 text-center text-gray-500 dark:text-gray-400 text-sm px-4'>
                暂无已发布应用，请先创建应用
              </div>
            ) : (
              apps.map((app) => (
                <button
                  key={app.id}
                  type='button'
                  onClick={() => handleSelectApp(app)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50',
                    selection.appId === String(app.id) && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <div className='w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0'>
                    {app.icon ? (
                      <span className='text-xl'>{app.icon}</span>
                    ) : (
                      <LayoutGrid className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='dark:text-white font-medium truncate'>{app.name}</span>
                      {selection.appId === String(app.id) && (
                        <Check className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                      )}
                    </div>
                    {app.description && (
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>
                        {app.description}
                      </p>
                    )}
                    {app.status && (
                      <Badge variant='secondary' className='mt-2 text-xs'>
                        {t(`enum.ApplicationStatusEnum.${app.status}`) ?? app.status}
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            )}
            <div className='h-2' />
            {appLoadMore && (
              <div className='flex justify-center py-2'>
                <Loader2 className='w-5 h-5 animate-spin text-gray-400' />
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='w-px h-6 bg-gray-200 dark:bg-gray-700' />

      {/* 智能体选择 */}
      <DropdownMenu open={agentOpen} onOpenChange={setAgentOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='gap-2 h-9 max-w-[160px]'
            disabled={!selection.appId}
          >
            <Bot className='w-4 h-4 text-purple-500' />
            <span className='dark:text-white truncate'>{agentDisplayName}</span>
            <ChevronDown className='w-4 h-4 text-gray-400 flex-shrink-0' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-[300px] p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='max-h-[280px] overflow-y-auto'>
            {agents.length === 0 ? (
              <div className='py-8 text-center text-gray-500 dark:text-gray-400 text-sm'>
                暂无智能体
              </div>
            ) : (
              agents.map((agent) => {
                const isActive = agent.status === 'ACTIVE';
                const isSelected = selection.agentId === String(agent.id);
                return (
                  <button
                    key={agent.id}
                    type='button'
                    onClick={() => handleSelectAgent(agent)}
                    disabled={!isActive}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 text-left',
                      isActive
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        : 'opacity-60 cursor-not-allowed',
                      isSelected && 'bg-purple-50 dark:bg-purple-900/20'
                    )}
                  >
                    <div className='w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0'>
                      <Bot className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='dark:text-white font-medium truncate'>{agent.name}</span>
                        {isSelected && (
                          <Check className='w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0' />
                        )}
                      </div>
                      {agent.description && (
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>
                          {agent.description}
                        </p>
                      )}
                      <div className='flex flex-wrap gap-1.5 mt-2'>
                        {agent.status && (
                          <Badge variant='secondary' className='text-xs'>
                            {t(`enum.AgentStatusEnum.${agent.status}`) ?? agent.status}
                          </Badge>
                        )}
                        {agent.interactionMode && (
                          <Badge variant='outline' className='text-xs'>
                            {t(`enum.InteractionModeEnum.${agent.interactionMode}`) ?? agent.interactionMode}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='w-px h-6 bg-gray-200 dark:bg-gray-700' />

      {/* 模型选择 */}
      <DropdownMenu open={modelOpen} onOpenChange={setModelOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='gap-2 h-9 max-w-[180px]'
            disabled={!selection.agentId}
          >
            <Cpu className='w-4 h-4 text-blue-500' />
            <span className='dark:text-white truncate'>{modelDisplayName}</span>
            <ChevronDown className='w-4 h-4 text-gray-400 flex-shrink-0' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-[300px] p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-2 border-b dark:border-gray-700'>
            <div className='relative'>
              <Search className='absolute ml-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='搜索模型...'
                value={modelKeyword}
                onChange={(e) => setModelKeyword(e.target.value)}
                className='pl-9 h-8'
              />
            </div>
          </div>
          <div
            ref={modelScrollRef}
            className='max-h-[280px] overflow-y-auto'
            onScroll={handleModelScroll}
          >
            {modelLoading && models.length === 0 ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
              </div>
            ) : (
              models.map((model) => {
                const m = model as typeof model & { type?: string; provider?: string };
                const isSelected = selectedModelId === String(model.id);
                return (
                  <button
                    key={model.id}
                    type='button'
                    onClick={() => handleSelectModel(model)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    <div className='w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0'>
                      <Cpu className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='dark:text-white font-medium truncate'>{model.name}</span>
                        {isSelected && (
                          <Check className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                        )}
                      </div>
                      {model.description && (
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>
                          {model.description}
                        </p>
                      )}
                      <div className='flex flex-wrap gap-1.5 mt-2'>
                        {m.type && (
                          <Badge variant='outline' className='text-xs'>
                            {t(`enum.ModelTypeEnum.${m.type}`) ?? m.type}
                          </Badge>
                        )}
                        {m.provider && (
                          <Badge variant='outline' className='text-xs'>
                            {t(`enum.ModelProviderEnum.${m.provider}`) ?? m.provider}
                          </Badge>
                        )}
                        {model.status && (
                          <Badge variant='secondary' className='text-xs'>
                            {t(`enum.ModelStatusEnum.${model.status}`) ?? model.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
            <div className='h-2' />
            {modelLoadMore && (
              <div className='flex justify-center py-2'>
                <Loader2 className='w-5 h-5 animate-spin text-gray-400' />
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
