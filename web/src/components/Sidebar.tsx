import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Workflow, BookOpen, Package, Database, Settings, Users, Share2, BarChart3, Key, CreditCard, MessageSquare, Sparkles, Code2, Server, Activity, Bell, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { AppNavigator } from './AppNavigator.tsx';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface SidebarProps {
  /** 侧边栏是否收起 */
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { id: 'home', icon: Home, label: t('sidebar.nav.dashboard') },
    { id: 'chat', icon: MessageSquare, label: t('sidebar.nav.chat') },
    { id: 'apps', icon: FileText, label: t('sidebar.nav.apps'), badge: '12' },
    { id: 'agents', icon: Bot, label: t('sidebar.nav.agents') },
    { id: 'workflow', icon: Workflow, label: t('sidebar.nav.workflow') },
    { id: 'knowledge', icon: BookOpen, label: t('sidebar.nav.knowledge') },
    { id: 'dataset', icon: Database, label: t('sidebar.nav.dataset') },
    { id: 'api-collection', icon: Code2, label: t('sidebar.nav.apiCollection') },
    { id: 'prompts', icon: Sparkles, label: t('sidebar.nav.prompts') },
  ];

  const teamMenuItems = [
    { id: 'team-members', icon: Users, label: t('sidebar.nav.members') },
    { id: 'resource-sharing', icon: Share2, label: t('sidebar.nav.sharing') },
    { id: 'notifications', icon: Bell, label: t('sidebar.nav.notifications') },
    { id: 'activity-log', icon: Activity, label: t('sidebar.nav.activityLog') },
  ];

  const systemMenuItems = [
    { id: 'usage-analytics', icon: BarChart3, label: t('analytics.title') },
    { id: 'plugins', icon: Package, label: t('sidebar.nav.plugins') },
    { id: 'models', icon: Settings, label: t('sidebar.nav.models') },
    { id: 'vector-store', icon: Server, label: t('sidebar.nav.vectorStore') },
    { id: 'api-keys', icon: Key, label: t('sidebar.nav.apiKeys') },
    { id: 'billing', icon: CreditCard, label: t('sidebar.nav.billing') },
  ];

  const getIsActive = (id: string) => {
    const path = `/${id}`;
    if (id === 'workflow') {
      return location.pathname === path || location.pathname.startsWith('/workflow-design');
    }
    return location.pathname === path;
  };

  const renderMenuItem = (item: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: string;
  }) => {
    const isActive = getIsActive(item.id);
    const path = `/${item.id}`;
    return (
      <div key={item.id} className="relative">
        <Button
          onClick={() => navigate(path)}
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start ${
            isActive
              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {item.icon && (
            <item.icon
              className={`w-4 h-4 shrink-0 mr-2 ${
                isActive ? 'dark:text-blue-400 text-white' : ''
              }`}
            />
          )}
          <span className='flex-1 text-left'>{item.label}</span>
          {item.badge && (
            <Badge
              variant={isActive ? 'secondary' : 'default'}
              className={`ml-2 ${isActive ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              {item.badge}
            </Badge>
          )}
        </Button>
      </div>
    );
  };

  const allMenuItems = [...mainMenuItems, ...teamMenuItems, ...systemMenuItems];

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
            allMenuItems.map((item) => {
              const isActive = getIsActive(item.id);
              const path = `/${item.id}`;
              return (
                <div key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-full h-9 ${isActive ? 'bg-blue-600 text-white' : ''}`}
                        onClick={() => navigate(path)}
                      >
                        <item.icon className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                </div>
              );
            })
          ) : (
            <>
              <div className="my-1 space-y-0.5">
                {mainMenuItems.map((item) => renderMenuItem(item))}
              </div>
              <div className="px-2 py-1.5 mb-1 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('sidebar.nav.team')}</span>
              </div>
              <div className="my-1 space-y-0.5">
                {teamMenuItems.map((item) => renderMenuItem(item))}
              </div>
              <div className="px-2 py-1.5 mb-1 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('sidebar.nav.system')}</span>
              </div>
              <div className="my-1 space-y-0.5">
                {systemMenuItems.map((item) => renderMenuItem(item))}
              </div>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}
