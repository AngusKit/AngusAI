/** 对话页头像/占位等使用的配色模板（无用户切换入口，固定默认主题） */

export type TemplateType = 'modern-blue' | 'minimal-gray' | 'elegant-purple' | 'warm-orange';

export interface ThemeTemplate {
  id: TemplateType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  hoverColor: string;
}

export const CHAT_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'modern-blue',
    name: '现代蓝',
    description: '专业清新的蓝色主题',
    primaryColor: 'bg-blue-500',
    secondaryColor: 'bg-blue-50 dark:bg-blue-900/20',
    accentColor: 'border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
  },
  {
    id: 'minimal-gray',
    name: '简约灰',
    description: '简洁优雅的灰色主题',
    primaryColor: 'bg-gray-700',
    secondaryColor: 'bg-gray-50 dark:bg-gray-800',
    accentColor: 'border-gray-200 dark:border-gray-700',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-750',
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    description: '高雅精致的紫色主题',
    primaryColor: 'bg-purple-500',
    secondaryColor: 'bg-purple-50 dark:bg-purple-900/20',
    accentColor: 'border-purple-200 dark:border-purple-800',
    hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
  },
  {
    id: 'warm-orange',
    name: '温暖橙',
    description: '活力温馨的橙色主题',
    primaryColor: 'bg-orange-500',
    secondaryColor: 'bg-orange-50 dark:bg-orange-900/20',
    accentColor: 'border-orange-200 dark:border-orange-800',
    hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
  },
];

/** 固定默认主题（原 ThemeDialog 已移除） */
export const DEFAULT_CHAT_TEMPLATE: ThemeTemplate = CHAT_TEMPLATES[0]!;
