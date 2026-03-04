import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 侧边栏展开/收起按钮
 * 位于右侧内容区，中心对准左侧菜单区右侧边框边缘
 */
export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  const { t } = useLanguage();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onToggle}
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-4 h-8 flex items-center justify-center shrink-0 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-500 shrink-0" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-500 shrink-0" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
      </TooltipContent>
    </Tooltip>
  );
}
