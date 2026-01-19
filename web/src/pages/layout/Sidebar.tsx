import { Home, FileText, Workflow, BookOpen, Package, Database, Settings, Users, Share2, BarChart3, Key, CreditCard, ChevronDown, Check, MessageSquare, Sparkles, Code2, Server, Activity, SlidersVertical, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AngusAILogo } from './AngusAILogo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { appContext, WebTagValue, AppInfo } from '@xcan-angus/infra';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const { t } = useLanguage();
  const appContextInfo = appContext.getContext();
  const accessApps = appContextInfo?.authApps || [];
  const currentEditionType = appContextInfo.accessApp?.editionType?.value;

  const applicationIcons = {
      AngusGit: '🚀',
      AngusAI: '🤖',
      chatbot: '💬',
      analytics: '📊',
      AngusTester: '🧪',
      AngusGM: '🌍',
  };

  const applications: AppInfo[] = accessApps.filter(app => {
    return (
      app.editionType?.value === currentEditionType &&
      (app.tags || [])?.some(tag => tag.name === WebTagValue.DISPLAY_ON_NAVIGATOR)
    );
  })
  .map(app => ({
    ...app,
    icon: applicationIcons[app.code as keyof typeof applicationIcons],
    iconText: app.name?.split('Angus')[1]?.[0],
  })) as AppInfo[];

  const currentApplication = appContextInfo?.accessApp;

  const handleSelectApplication = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // const applications = [
  //   { id: 'angusai', name: 'AngusAI', icon: '🤖', description: 'AI 工作平台' },
  //   {
  //     id: 'chatbot',
  //     name: '智能客服',
  //     icon: '💬',
  //     description: '客服对话系统',
  //   },
  //   {
  //     id: 'content',
  //     name: '内容创作',
  //     icon: '✨',
  //     description: '内容生成工具',
  //   },
  //   {
  //     id: 'analytics',
  //     name: '数据分析',
  //     icon: '📊',
  //     description: '数据可视化',
  //   },
  // ];

  const mainMenuItems = [
    { id: 'home', icon: Home, label: t('nav.dashboard') },
    { id: 'chat', icon: MessageSquare, label: t('nav.chat') },
    { id: 'apps', icon: FileText, label: t('nav.myApps'), badge: '12' },
    { id: 'workflow', icon: Workflow, label: t('nav.workflow') },
    { id: 'knowledge', icon: BookOpen, label: t('nav.knowledge') },
    { id: 'dataset', icon: Database, label: t('nav.dataset') },
    { id: 'api-collection', icon: Code2, label: t('nav.apiCollection') },
    { id: 'plugins', icon: Package, label: t('nav.plugins') },
    { id: 'models', icon: Settings, label: t('nav.models') },
    { id: 'vector-store', icon: Server, label: t('nav.vectorStore') },
    { id: 'prompts', icon: Sparkles, label: t('nav.prompts') },
  ];

  const teamMenuItems = [
    { id: 'team-members', icon: Users, label: t('nav.members') },
    { id: 'activity-log', icon: Activity, label: t('nav.activityLog') },
    { id: 'resource-sharing', icon: Share2, label: t('nav.sharing') },
    { id: 'team-settings', icon: Settings, label: t('nav.teamSettings') },
  ];

  const settingsMenuItems = [
    { id: 'usage-analytics', icon: BarChart3, label: t('analytics.title') },
    { id: 'api-keys', icon: Key, label: t('nav.apiKeys') },
    { id: 'billing', icon: CreditCard, label: t('nav.billing') },
  ];

  return (
    <aside className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col'>
      {/* Logo with App Navigator - 与Header高度一致 */}
      <div className='h-[57px] px-4 border-b border-gray-200 dark:border-gray-700 flex items-center'>
        <div className='flex items-center gap-2 flex-1'>
          <AngusAILogo className='w-10 h-10 flex-shrink-0' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-2 flex-1 min-w-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1.5 transition-colors'>
                <div className='flex-1 min-w-0 text-left'>
                  <div className='font-semibold dark:text-white truncate'>{currentApplication?.showName}</div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {currentApplication?.description}
                  </div>
                </div>
                <ChevronDown className='w-4 h-4 text-gray-400 flex-shrink-0' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-64 dark:bg-gray-800 dark:border-gray-700'>
              <div className='p-2'>
                <div className='text-xs text-gray-500 dark:text-gray-400 px-2 py-1.5 mb-1'>切换应用</div>
                {applications.map(app => (
                  <DropdownMenuItem
                    key={app.code}
                    onClick={() => handleSelectApplication(app.url)}
                    className={`flex items-center gap-3 py-2 `}
                  >
                    <div className='size-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <span className='text-white font-semibold'>
                        {app.iconText}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm dark:text-white'>{app.name}</span>
                        {currentApplication.code === app.code && <Check className='w-4 h-4 text-blue-500' />}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>{app.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Create Button */}
      <div className='p-4'>
        <Button className='w-full bg-blue-500 hover:bg-blue-600' onClick={() => onPageChange('create-app')}>
          + {t('quickActions.createApp')}
        </Button>
      </div>

      {/* Main Menu */}
      <nav className='flex-1 overflow-y-auto hide-scrollbar'>
        <div className='px-2 py-2 space-y-1'>
          {mainMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activePage === item.id
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className='w-4 h-4' />
              <span className='flex-1 text-left text-sm'>{item.label}</span>
              {item.badge && (
                <Badge variant='secondary' className='text-xs'>
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Team Section */}
        <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
          <div className='px-4 mb-2'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>{t('nav.team')}</span>
          </div>
          <div className='px-2 space-y-1'>
            {teamMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className='w-4 h-4' />
                <span className='flex-1 text-left text-sm'>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
          <div className='px-4 mb-2'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>{t('common.actions.settings')}</span>
          </div>
          <div className='px-2 space-y-1'>
            {settingsMenuItems.map(item => (
              <button
                key={item.label}
                onClick={() => item.id && onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.id && activePage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className='w-4 h-4' />
                <span className='flex-1 text-left text-sm'>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
