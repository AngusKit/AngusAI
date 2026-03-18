import { useLanguage } from '@/components/LanguageProvider';
import type { ChatMonitorOverviewVo } from '@/services/MonitorTypes';
import { Card } from '@/components/ui/card';
import { Zap, MessageSquare, FileText, Users, ThumbsUp, ThumbsDown, Layers, Bot, Cpu } from 'lucide-react';

interface MonitorOverviewProps {
  stats: ChatMonitorOverviewVo;
  loading?: boolean;
}

export function MonitorOverview({ stats, loading }: MonitorOverviewProps) {
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {language === 'zh-CN' ? '加载概览中...' : 'Loading overview...'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Throughput Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '吞吐量' : 'Throughput'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {language === 'zh-CN' ? '今天每分钟消息数' : 'Messages per minute today'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold dark:text-white">
              {stats.throughput?.current ?? 0}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '条/分' : 'msg/min'}
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'zh-CN' ? '最小' : 'Min'}
                </p>
                <p className="text-sm font-semibold dark:text-gray-300">{stats.throughput?.min ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'zh-CN' ? '平均' : 'Avg'}
                </p>
                <p className="text-sm font-semibold dark:text-gray-300">{stats.throughput?.average ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'zh-CN' ? '最大' : 'Max'}
                </p>
                <p className="text-sm font-semibold dark:text-gray-300">{stats.throughput?.max ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sessions Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '会话' : 'Sessions'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
            <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.sessions?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.sessions?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总会话' : 'Active / Total Sessions'}
          </p>
        </div>
      </Card>

      {/* Messages Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '消息' : 'Messages'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.messages?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.messages?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总消息' : 'Active / Total Messages'}
          </p>
        </div>
      </Card>

      {/* Users Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '用户' : 'Users'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.users?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.users?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总用户' : 'Active / Total Users'}
          </p>
        </div>
      </Card>

      {/* Feedback Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-yellow-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '反馈' : 'Feedback'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
            <ThumbsUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.feedback?.like ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.feedback?.dislike ?? 0}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? `总计: ${stats.feedback?.total ?? 0} 条反馈` : `Total: ${stats.feedback?.total ?? 0} feedbacks`}
          </p>
        </div>
      </Card>

      {/* Applications Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '应用' : 'Applications'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.applications?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.applications?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总应用' : 'Active / Total Apps'}
          </p>
        </div>
      </Card>

      {/* Agents Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-pink-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '智能体' : 'Agents'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20">
            <Bot className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {stats.agents?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.agents?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总智能体' : 'Active / Total Agents'}
          </p>
        </div>
      </Card>

      {/* Models Card */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-teal-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === 'zh-CN' ? '模型' : 'Models'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20">
            <Cpu className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {stats.models?.active ?? 0}
            </span>
            <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.models?.total ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '对话中 / 总模型' : 'Active / Total Models'}
          </p>
        </div>
      </Card>
    </div>
  );
}
