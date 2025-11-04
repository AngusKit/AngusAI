import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../ui/LanguageProvider';

export function UsageDetails() {
  const { t } = useLanguage();
  const apiUsage = [
    { name: 'API 调用分析', items: [
      { label: '聊天应用', percentage: 42, trend: null, color: 'bg-blue-500' },
      { label: '文本生成', percentage: 28, trend: null, color: 'bg-purple-500' },
      { label: '知识问答', percentage: 18, trend: null, color: 'bg-green-500' },
      { label: '其他', percentage: 12, trend: null, color: 'bg-gray-400' },
    ]},
  ];

  const modelUsage = [
    { label: '调用次数分析', trend: null },
    { label: 'GPT-4', value: '3M', percentage: 45, trend: '1.2s', trendValue: null },
    { label: 'Claude-3', value: '2.8M', percentage: 32, trend: '0.4M Tokens', trendValue: null },
    { label: 'Llama-3', value: '1.5M', percentage: 18, trend: '0.4M Tokens', trendValue: null },
  ];

  const costAnalysis = [
    { label: '成本分析', trend: null },
    { label: '本月至今', value: '$342.50', trend: '较上月同期 $42.30', trendUp: null },
    { label: '预测月度成本', value: '$398.20', trend: '基于当前使用趋势', trendUp: null },
    { label: '成本节约建议', value: '$56.80', trend: '优化可能节省的费用', trendUp: null },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
        <h2 className="text-lg dark:text-white">{t('usage.title')}</h2>
      </div>

      <Card className="p-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[100px]">
        {/* API Usage */}
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('usage.apiCallsTitle')}</h3>
          <div className="space-y-4">
            {apiUsage[0].items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2 dark:text-gray-300">
                  <span>{item.label}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Usage */}
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-4">模型调用分析</h3>
          <div className="space-y-4">
            {modelUsage.slice(1).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm dark:text-gray-300">{item.label}</span>
                    <span className={`text-sm ${index === 0 ? 'text-green-600 dark:text-green-400' : index === 1 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-4">成本分析</h3>
          <div className="space-y-4">
            {costAnalysis.slice(1).map((item, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className={`dark:text-gray-200 ${index === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>{item.value}</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{item.trend}</div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Card>
    </div>
  );
}
