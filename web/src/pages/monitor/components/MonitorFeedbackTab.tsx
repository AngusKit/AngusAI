import { useMemo } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import type { MonitorFeedback, MonitorMessage, MonitorSession } from './MonitorTypes';
import type { ChartDataPointVo } from '@/services/MonitorTypes';
import type { LazySelectFetcher } from './MonitorLazySelect';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MonitorLazySelect } from './MonitorLazySelect';
import { MonitorLineChart } from './MonitorLineChart';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export interface MonitorFeedbackTabProps {
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
  feedbacks: MonitorFeedback[];
  feedbacksLoading?: boolean;
  messages: MonitorMessage[];
  pagination?: { page: number; total: number; pageSize: number; onPageChange: (page: number) => void };
  onViewSession: (session: MonitorSession) => void;
  onViewMessage: (message: MonitorMessage) => void;
  onDeleteFeedback: (feedbackId: string) => void;
}

export function MonitorFeedbackTab(props: MonitorFeedbackTabProps) {
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
    feedbacks,
    feedbacksLoading,
    messages,
    pagination,
    onViewSession,
    onViewMessage,
    onDeleteFeedback,
  } = props;
  const { language } = useLanguage();

  // 从反馈列表推导会话列表，用于表格中的「查看会话」链接
  const sessionsFromFeedbacks = useMemo(() => {
    const map = new Map<string, MonitorSession>();
    feedbacks.forEach((f) => {
      const sid = f.sessionId ?? '';
      if (sid && !map.has(sid)) {
        map.set(sid, {
          sessionId: sid,
          id: sid,
          title: f.sessionTitle ?? f.sessionId ?? '-',
          sessionName: f.sessionTitle ?? f.sessionId,
        } as MonitorSession);
      }
    });
    return Array.from(map.values());
  }, [feedbacks]);

  return (
    <div className="space-y-4">
      <MonitorLineChart
        title={language === 'zh-CN' ? '反馈趋势' : 'Feedback Trends'}
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
        lineColor="#f59e0b"
        lineName={language === 'zh-CN' ? '反馈数' : 'Feedbacks'}
      />

      <div className="flex items-center gap-3">
        <Input
          placeholder={language === 'zh-CN' ? '关键字搜索...' : 'Keyword search...'}
          value={keywordSearch}
          onChange={(e) => onKeywordSearchChange(e.target.value)}
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
        {(feedbacksLoading && feedbacks.length === 0) && (
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
                  {language === 'zh-CN' ? '反馈类型' : 'Type'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '用户' : 'User'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '评论' : 'Comment'}
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
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        const message = messages.find((m) => (m.messageId ?? m.id) === feedback.messageId);
                        if (message) onViewMessage(message);
                      }}
                      className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      {feedback.messageId}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        const session = sessionsFromFeedbacks.find((s) => (s.sessionId ?? s.id) === feedback.sessionId);
                        if (session) onViewSession(session);
                      }}
                      className="text-left"
                    >
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {feedback.sessionTitle}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {feedback.sessionId}
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        'border-0',
                        feedback.feedbackType === 'like'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {feedback.feedbackType === 'like' ? <ThumbsUp className="h-3 w-3 mr-1" /> : <ThumbsDown className="h-3 w-3 mr-1" />}
                      {feedback.feedbackType === 'like' ? (language === 'zh-CN' ? '好评' : 'Like') : language === 'zh-CN' ? '差评' : 'Dislike'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm dark:text-gray-300">{feedback.userName ?? '-'}</td>
                  <td className="px-4 py-3 max-w-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {feedback.feedbackComment || '-'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{feedback.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFeedback(feedback.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.total > pagination.pageSize && (
          <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
                    className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => pagination.onPageChange(p)}
                      isActive={pagination.page === p}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => pagination.onPageChange(Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.page + 1))}
                    className={pagination.page >= Math.ceil(pagination.total / pagination.pageSize) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}
