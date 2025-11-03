import { MessageSquare, FileText, HelpCircle, User } from 'lucide-react';
import { Card } from '../ui/card';
import { useLanguage } from '../ui/LanguageProvider';

export function RecommendedTools() {
  const { t } = useLanguage();
  
  const tools = [
    {
      icon: MessageSquare,
      name: t('quickActions.createApp'),
      description: t('quickActions.createAppDesc'),
      iconBg: 'bg-blue-500',
    },
    {
      icon: FileText,
      name: t('quickActions.createWorkflow'),
      description: t('quickActions.createWorkflowDesc'),
      iconBg: 'bg-purple-500',
    },
    {
      icon: HelpCircle,
      name: t('quickActions.uploadDocs'),
      description: t('quickActions.uploadDocsDesc'),
      iconBg: 'bg-green-500',
    },
    {
      icon: User,
      name: t('quickActions.viewAnalytics'),
      description: t('quickActions.viewAnalyticsDesc'),
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="text-lg dark:text-white">{t('quickActions.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <Card key={index} className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-blue-500 dark:bg-gray-800 dark:hover:border-blue-400">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${tool.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="dark:text-white">{tool.name}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
