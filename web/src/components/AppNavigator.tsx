import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { appContext, ApplicationDetail, WebTagValue2 } from '@xcan-angus/infra';
import { useState } from 'react';

interface AppNavigatorProps {
  /** 侧边栏是否收起 */
  collapsed?: boolean;
}

export function AppNavigator({ collapsed = false }: AppNavigatorProps) {
  const { t } = useLanguage();
  const appContextInfo = appContext.getContext();
  const [selectedApp] = useState<ApplicationDetail | undefined>(
    appContextInfo?.accessApp as ApplicationDetail
  );

  const accessApps = appContextInfo?.authApps || [];
  const currentEditionType = appContextInfo?.accessApp?.editionType;

  const applications: ApplicationDetail[] = accessApps
    .filter(app => {
      return (
        app.editionType === currentEditionType &&
        (app.tags || [])?.some(
          tag => tag === WebTagValue2.DISPLAY_IN_APP_NAVIGATOR
        )
      );
    })
    .map(app => ({
      ...app,
      iconText: app.name?.split('Angus')[1]?.[0]
    }));

  return (
    <div className={`h-16 border-b border-gray-200 dark:border-gray-700 flex items-center ${collapsed ? 'px-2 justify-center' : 'px-4'}`}>
      <div className={`flex items-center gap-2 flex-1 ${collapsed ? 'flex-col justify-center' : ''}`}>
        <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">
            {selectedApp?.name?.split('Angus')[1]?.[0] || 'A'}
          </span>
        </div>
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 flex-1 min-w-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-semibold dark:text-white truncate">{selectedApp?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{selectedApp?.description}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
              <div className="p-2">
                <div className="px-2 py-1.5 mb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('sidebar.appSwitcher.switchApp')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {applications.map((app) => (
                    <DropdownMenuItem
                      key={app.id}
                      onClick={() => {
                        window.open(app.url, '_self');
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-all duration-200 ${
                        selectedApp?.name === app.name
                          ? 'bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                    >
                      <div className="size-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {app.name?.split('Angus')[1]?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-sm ${
                              selectedApp?.name === app.name
                                ? 'text-blue-700 dark:text-blue-300 font-medium'
                                : 'dark:text-white'
                            }`}
                          >
                            {app.name}
                          </span>
                          {selectedApp?.name === app.name && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
