import { useLanguage } from '@/components/LanguageProvider';
import type { MonitorSession, SelectOption } from './MonitorTypes';
import type { ChartDataPointVo } from '@/services/MonitorTypes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonitorLineChart } from './MonitorLineChart';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Eye, Trash2 } from 'lucide-react';

export interface MonitorSessionsTabProps {
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
  userFilter: string;
  onAppFilterChange: (v: string) => void;
  onAgentFilterChange: (v: string) => void;
  onModelFilterChange: (v: string) => void;
  onUserFilterChange: (v: string) => void;
  appSearch: string;
  agentSearch: string;
  modelSearch: string;
  userSearch: string;
  onAppSearchChange: (v: string) => void;
  onAgentSearchChange: (v: string) => void;
  onModelSearchChange: (v: string) => void;
  onUserSearchChange: (v: string) => void;
  applications: SelectOption[];
  agents: SelectOption[];
  models: SelectOption[];
  users: SelectOption[];
  sessions: MonitorSession[];
  sessionsLoading?: boolean;
  pagination?: { page: number; total: number; pageSize: number; onPageChange: (page: number) => void };
  onViewSession: (session: MonitorSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function MonitorSessionsTab({
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
  userFilter,
  onAppFilterChange,
  onAgentFilterChange,
  onModelFilterChange,
  onUserFilterChange,
  appSearch,
  agentSearch,
  modelSearch,
  userSearch,
  onAppSearchChange,
  onAgentSearchChange,
  onModelSearchChange,
  onUserSearchChange,
  applications,
  agents,
  models,
  users,
  sessions,
  sessionsLoading,
  pagination,
  onViewSession,
  onDeleteSession,
}: MonitorSessionsTabProps) {
  const { language } = useLanguage();

  const formatSessionDate = (s: MonitorSession) => {
    const d = (s as { createdAt?: string; createdDate?: string }).createdAt ?? (s as { createdDate?: string }).createdDate;
    return d ? (typeof d === 'string' ? d : new Date(d).toLocaleString()) : '-';
  };

  return (
    <div className="space-y-4">
      <MonitorLineChart
        title={language === 'zh-CN' ? '会话趋势' : 'Session Trends'}
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
        lineColor="#3b82f6"
        lineName={language === 'zh-CN' ? '会话数' : 'Sessions'}
      />

      <div className="flex items-center gap-3">
        <Input
          placeholder={language === 'zh-CN' ? '关键字搜索...' : 'Keyword search...'}
          value={keywordSearch}
          onChange={(e) => onKeywordSearchChange(e.target.value)}
          className="w-[300px] dark:bg-gray-900 dark:border-gray-700"
        />
        <div className="flex-1 flex items-center justify-end gap-3">
          <Select value={appFilter} onValueChange={onAppFilterChange}>
            <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue placeholder={language === 'zh-CN' ? '全部应用' : 'All Apps'} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2">
                <Input
                  placeholder={language === 'zh-CN' ? '搜索...' : 'Search...'}
                  value={appSearch}
                  onChange={(e) => onAppSearchChange(e.target.value)}
                  className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <SelectItem value="all">{language === 'zh-CN' ? '全部应用' : 'All Applications'}</SelectItem>
              {applications.filter((a) => a.name.toLowerCase().includes(appSearch.toLowerCase())).map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={agentFilter} onValueChange={onAgentFilterChange}>
            <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue placeholder={language === 'zh-CN' ? '全部智能体' : 'All Agents'} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2">
                <Input
                  placeholder={language === 'zh-CN' ? '搜索...' : 'Search...'}
                  value={agentSearch}
                  onChange={(e) => onAgentSearchChange(e.target.value)}
                  className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <SelectItem value="all">{language === 'zh-CN' ? '全部智能体' : 'All Agents'}</SelectItem>
              {agents.filter((a) => a.name.toLowerCase().includes(agentSearch.toLowerCase())).map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={modelFilter} onValueChange={onModelFilterChange}>
            <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue placeholder={language === 'zh-CN' ? '全部模型' : 'All Models'} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2">
                <Input
                  placeholder={language === 'zh-CN' ? '搜索...' : 'Search...'}
                  value={modelSearch}
                  onChange={(e) => onModelSearchChange(e.target.value)}
                  className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <SelectItem value="all">{language === 'zh-CN' ? '全部模型' : 'All Models'}</SelectItem>
              {models.filter((m) => m.name.toLowerCase().includes(modelSearch.toLowerCase())).map((m) => (
                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={onUserFilterChange}>
            <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-700">
              <SelectValue placeholder={language === 'zh-CN' ? '全部用户' : 'All Users'} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2">
                <Input
                  placeholder={language === 'zh-CN' ? '搜索...' : 'Search...'}
                  value={userSearch}
                  onChange={(e) => onUserSearchChange(e.target.value)}
                  className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <SelectItem value="all">{language === 'zh-CN' ? '全部用户' : 'All Users'}</SelectItem>
              {users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase())).map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        {(sessionsLoading && sessions.length === 0) && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{language === 'zh-CN' ? '加载中...' : 'Loading...'}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '会话标题' : 'Session Title'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '应用' : 'App'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '用户' : 'User'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '智能体' : 'Agent'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {language === 'zh-CN' ? '消息数' : 'Messages'}
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
              {sessions.map((session) => (
                <tr key={session.sessionId ?? session.id ?? ''} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => onViewSession(session)} className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {session.title}
                        </span>
                        {session.isPinned && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 text-xs">
                            {language === 'zh-CN' ? '置顶' : 'Pinned'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                        {session.sessionId}
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm dark:text-gray-300">{session.appName ?? '-'}</td>
                  <td className="px-4 py-3 text-sm dark:text-gray-300">{(session as { creator?: string }).creator ?? '-'}</td>
                  <td className="px-4 py-3 text-sm dark:text-gray-300">{session.agentName ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{session.messageCount}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatSessionDate(session)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewSession(session)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSession(session.sessionId ?? session.id ?? '')}
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
