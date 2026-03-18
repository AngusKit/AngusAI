import { useMemo } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import type { MonitorMessage, MonitorSession } from './MonitorTypes';
import type { ChartDataPointVo } from '@/services/MonitorTypes';
import type { LazySelectFetcher } from './MonitorLazySelect';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MonitorLazySelect } from './MonitorLazySelect';
import { MonitorLineChart } from './MonitorLineChart';
import { Pagination } from '@/components/gm/Pagination';
import { Eye, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export interface MonitorMessagesTabProps {
  chartRange: 'year' | 'month' | 'day';
  chartSelectedYear: string;
  chartSelectedMonth: string;
  chartSelectedDay: string;
  onChartRangeChange: (v: 'year' | 'month' | 'day') => void;
  onChartYearChange: (v: string) => void;
  onChartMonthChange: (v: string) => void;
  onChartDayChange: (v: string) => void;
  chartData: ChartDataPointVo[];
  chartLoading?: boolean;
  keywordSearch: string;
  onKeywordSearchChange: (v: string) => void;
  /** 按 Enter 立即搜索 */
  onKeywordSubmit?: () => void;
  appFilter: string;
  agentFilter: string;
  modelFilter: string;
  sessionFilter: string;
  userFilter: string;
  onAppFilterChange: (v: string) => void;
  onAgentFilterChange: (v: string) => void;
  onModelFilterChange: (v: string) => void;
  onSessionFilterChange: (v: string) => void;
  onUserFilterChange: (v: string) => void;
  appFetcher: LazySelectFetcher;
  agentFetcher: LazySelectFetcher;
  modelFetcher: LazySelectFetcher;
  sessionFetcher: LazySelectFetcher;
  userFetcher: LazySelectFetcher;
  messages: MonitorMessage[];
  messagesLoading?: boolean;
  pagination?: { page: number; total: number; pageSize: number; onPageChange: (page: number) => void };
  onViewSession: (session: MonitorSession) => void;
  onViewMessage: (message: MonitorMessage) => void;
  onDeleteMessage: (messageId: string) => void;
}

export function MonitorMessagesTab(props: MonitorMessagesTabProps) {
  const {
    chartRange,
    chartSelectedYear,
    chartSelectedMonth,
    chartSelectedDay,
    onChartRangeChange,
    onChartYearChange,
    onChartMonthChange,
    onChartDayChange,
    chartData,
    chartLoading,
    keywordSearch,
    onKeywordSearchChange,
    onKeywordSubmit,
    appFilter,
    agentFilter,
    modelFilter,
    sessionFilter,
    userFilter,
    onAppFilterChange,
    onAgentFilterChange,
    onModelFilterChange,
    onSessionFilterChange,
    onUserFilterChange,
    appFetcher,
    agentFetcher,
    modelFetcher,
    sessionFetcher,
    userFetcher,
    messages,
    messagesLoading,
    pagination,
    onViewSession,
    onViewMessage,
    onDeleteMessage,
  } = props;
  const { language } = useLanguage();

  // 从消息列表推导会话列表，用于表格中的「查看会话」链接
  const sessionsFromMessages = useMemo(() => {
    const map = new Map<string, MonitorSession>();
    messages.forEach((m) => {
      const sid = m.sessionId ?? '';
      if (sid && !map.has(sid)) {
        map.set(sid, {
          sessionId: sid,
          id: sid,
          title: m.sessionName ?? m.sessionId ?? '-',
          sessionName: m.sessionName ?? m.sessionId,
        } as MonitorSession);
      }
    });
    return Array.from(map.values());
  }, [messages]);

  return (
    <div className="space-y-4">
      <MonitorLineChart
        title={language === 'zh-CN' ? '消息趋势' : 'Message Trends'}
        range={chartRange}
        selectedYear={chartSelectedYear}
        selectedMonth={chartSelectedMonth}
        selectedDay={chartSelectedDay}
        onRangeChange={onChartRangeChange}
        onYearChange={onChartYearChange}
        onMonthChange={onChartMonthChange}
        onDayChange={onChartDayChange}
        data={chartData}
        loading={chartLoading}
        lineColor="#8b5cf6"
        lineName={language === 'zh-CN' ? '消息数' : 'Messages'}
      />

      <div className="flex items-center gap-3">
        <Input
          placeholder={language === 'zh-CN' ? '关键字搜索...' : 'Keyword search...'}
          value={keywordSearch}
          onChange={(e) => onKeywordSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onKeywordSubmit?.()}
          className="w-[300px] dark:bg-gray-900 dark:border-gray-700"
        />
        <div className="flex-1 flex items-center justify-end gap-3">
          <MonitorLazySelect
            value={appFilter}
            onValueChange={onAppFilterChange}
            fetcher={appFetcher}
            placeholder={language === 'zh-CN' ? '全部应用' : 'All Apps'}
            allOptionLabel={language === 'zh-CN' ? '全部应用' : 'All Applications'}
            className="w-40 dark:bg-gray-900 dark:border-gray-700"
          />
          <MonitorLazySelect
            value={agentFilter}
            onValueChange={onAgentFilterChange}
            fetcher={agentFetcher}
            placeholder={language === 'zh-CN' ? '全部智能体' : 'All Agents'}
            allOptionLabel={language === 'zh-CN' ? '全部智能体' : 'All Agents'}
            className="w-40 dark:bg-gray-900 dark:border-gray-700"
          />
          <MonitorLazySelect
            value={modelFilter}
            onValueChange={onModelFilterChange}
            fetcher={modelFetcher}
            placeholder={language === 'zh-CN' ? '全部模型' : 'All Models'}
            allOptionLabel={language === 'zh-CN' ? '全部模型' : 'All Models'}
            className="w-40 dark:bg-gray-900 dark:border-gray-700"
          />
          <MonitorLazySelect
            value={sessionFilter}
            onValueChange={onSessionFilterChange}
            fetcher={sessionFetcher}
            placeholder={language === 'zh-CN' ? '全部会话' : 'All Sessions'}
            allOptionLabel={language === 'zh-CN' ? '全部会话' : 'All Sessions'}
            className="w-40 dark:bg-gray-900 dark:border-gray-700"
          />
          <MonitorLazySelect
            value={userFilter}
            onValueChange={onUserFilterChange}
            fetcher={userFetcher}
            placeholder={language === 'zh-CN' ? '全部用户' : 'All Users'}
            allOptionLabel={language === 'zh-CN' ? '全部用户' : 'All Users'}
            className="w-40 dark:bg-gray-900 dark:border-gray-700"
          />
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        {(messagesLoading && messages.length === 0) && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{language === 'zh-CN' ? '加载中...' : 'Loading...'}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '消息ID' : 'Message ID'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '会话' : 'Session'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '角色' : 'Role'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '内容' : 'Content'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '反馈' : 'Feedback'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '创建时间' : 'Created'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '操作' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((message) => (
                <tr key={message.id ?? message.messageId ?? ''} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewMessage(message)}
                      className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {message.messageId ?? message.id ?? '-'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        const session = sessionsFromMessages.find((s) => (s.sessionId ?? s.id) === message.sessionId);
                        if (session) onViewSession(session);
                      }}
                      className="text-left"
                    >
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {message.sessionName ?? message.sessionId ?? '-'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {message.sessionId}
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <Badge
                        className={cn(
                          'border-0',
                          (message.role ?? '').toUpperCase() === 'USER'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        )}
                      >
                        {(message.role ?? '').toUpperCase() === 'USER'
                          ? language === 'zh-CN'
                            ? '用户'
                            : 'User'
                          : language === 'zh-CN'
                            ? '助手'
                            : 'Assistant'}
                      </Badge>
                      {(message.role ?? '').toUpperCase() === 'USER' && ((message as { creator?: string }).creator ?? message.userName) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(message as { creator?: string }).creator ?? message.userName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{message.content}</p>
                  </td>
                  <td className="px-4 py-3">
                    {(message.feedbackType ?? '').toLowerCase() ? (
                      <Badge
                        className={cn(
                          'border-0',
                          (message.feedbackType ?? '').toLowerCase() === 'like'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {(message.feedbackType ?? '').toLowerCase() === 'like' ? <ThumbsUp className="h-3 w-3 mr-1" /> : <ThumbsDown className="h-3 w-3 mr-1" />}
                        {(message.feedbackType ?? '').toLowerCase() === 'like' ? (language === 'zh-CN' ? '好评' : 'Like') : language === 'zh-CN' ? '差评' : 'Dislike'}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{(message as { createdAt?: string }).createdAt ?? message.datetime ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewMessage(message)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteMessage(message.id ?? message.messageId ?? '')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.total > pagination.pageSize && (
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
            onPageChange={pagination.onPageChange}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
          />
        )}
      </Card>
    </div>
  );
}
