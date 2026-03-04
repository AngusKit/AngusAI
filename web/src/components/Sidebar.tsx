import React from 'react';
import { Home, FileText, Workflow, BookOpen, Package, Database, Settings, Users, Share2, BarChart3, Key, CreditCard, MessageSquare, Sparkles, Code2, Server, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { AppNavigator } from './AppNavigator.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  /** 侧边栏是否收起 */
  collapsed?: boolean;
}

export function Sidebar({ activePage, onPageChange, collapsed = false }: SidebarProps) {
  const { t } = useLanguage();

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

  const renderMenuItem = (item: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: string;
  }) => (
    <div key={item.id} className="relative">
      <Button
        onClick={() => onPageChange(item.id)}
        variant={activePage === item.id ? 'default' : 'ghost'}
        className={`w-full justify-start ${
          activePage === item.id
            ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {item.icon && (
          <item.icon
            className={`w-4 h-4 shrink-0 mr-2 ${
              activePage === item.id ? 'dark:text-blue-400 text-white' : ''
            }`}
          />
        )}
        <span className='flex-1 text-left'>{item.label}</span>
        {item.badge && (
          <Badge
            variant={activePage === item.id ? 'secondary' : 'default'}
            className={`ml-2 ${activePage === item.id ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            {item.badge}
          </Badge>
        )}
      </Button>
    </div>
  );

  const allMenuItems = [...mainMenuItems, ...teamMenuItems, ...settingsMenuItems];

  return (
    <aside
      className={`relative overflow-visible bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <AppNavigator collapsed={collapsed} />

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar">
        <div className={`py-4 space-y-1 ${collapsed ? 'px-2' : 'px-2'}`}>
          {collapsed ? (
            allMenuItems.map((item) => (
              <div key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-full h-9 ${activePage === item.id ? 'bg-blue-600 text-white' : ''}`}
                      onClick={() => onPageChange(item.id)}
                    >
                      <item.icon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </div>
            ))
          ) : (
            <>
              <div className="my-1 space-y-0.5">
                {mainMenuItems.map((item) => renderMenuItem(item))}
              </div>
              <div className="px-2 py-1.5 mb-1 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('nav.team')}</span>
              </div>
              <div className="my-1 space-y-0.5">
                {teamMenuItems.map((item) => renderMenuItem(item))}
              </div>
              <div className="px-2 py-1.5 mb-1 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('common.actions.settings')}</span>
              </div>
              <div className="my-1 space-y-0.5">
                {settingsMenuItems.map((item) => renderMenuItem(item))}
              </div>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}
