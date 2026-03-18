import { useState, useEffect, useCallback } from 'react';
import { SearchCriteria } from '@xcan-angus/infra';
import { useLanguage } from '@/components/LanguageProvider';
import MonitorService from '@/services/Monitor';
import SessionService from '@/services/Session';
import MessageService from '@/services/Message';
import Applications from '@/services/Applications';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import Member from '@/services/Member';
import type { ChartDataPointVo, ChatMonitorOverviewVo } from '@/services/MonitorTypes';
import type { MessageVo, MessageFindDto } from '@/services/MessageTypes';
import { MessageSquare, FileText, ThumbsUp, ThumbsDown, ChevronLeft, BarChart3, Search, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { Pagination } from '@/components/gm/Pagination';
import { MonitorOverview } from './components/MonitorOverview';
import { MonitorSessionsTab } from './components/MonitorSessionsTab';
import { MonitorMessagesTab } from './components/MonitorMessagesTab';
import { MonitorFeedbackTab } from './components/MonitorFeedbackTab';
import type { MonitorSession, MonitorMessage, MonitorFeedback, OverviewStats } from './components/MonitorTypes';
import type { LazySelectFetcher } from './components/MonitorLazySelect';
import { MonthEnum } from '@/enums/enums';

const DEFAULT_OVERVIEW_STATS: OverviewStats = {
  throughput: { current: 0, min: 0, max: 0, average: 0 },
  sessions: { active: 0, total: 0 },
  messages: { active: 0, total: 0 },
  users: { active: 0, total: 0 },
  feedback: { like: 0, dislike: 0, total: 0 },
  applications: { active: 0, total: 0 },
  agents: { active: 0, total: 0 },
  models: { active: 0, total: 0 },
};

export function Monitor() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentView, setCurrentView] = useState<'list' | 'session-detail' | 'message-detail'>('list');
  
  // Chart time range
  const [sessionsChartRange, setSessionsChartRange] = useState<'year' | 'month' | 'day'>('day');
  const [messagesChartRange, setMessagesChartRange] = useState<'year' | 'month' | 'day'>('day');
  const [feedbackChartRange, setFeedbackChartRange] = useState<'year' | 'month' | 'day'>('day');
  
  // Chart date selection - Sessions
  const [sessionsSelectedYear, setSessionsSelectedYear] = useState(new Date().getFullYear().toString());
  const [sessionsSelectedMonth, setSessionsSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [sessionsSelectedDay, setSessionsSelectedDay] = useState(new Date().getDate().toString());
  
  // Chart date selection - Messages
  const [messagesSelectedYear, setMessagesSelectedYear] = useState(new Date().getFullYear().toString());
  const [messagesSelectedMonth, setMessagesSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [messagesSelectedDay, setMessagesSelectedDay] = useState(new Date().getDate().toString());
  
  // Chart date selection - Feedback
  const [feedbackSelectedYear, setFeedbackSelectedYear] = useState(new Date().getFullYear().toString());
  const [feedbackSelectedMonth, setFeedbackSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [feedbackSelectedDay, setFeedbackSelectedDay] = useState(new Date().getDate().toString());
  
  // Session filters: keyword search + 全部应用、全部智能体、全部模型、全部用户
  const [sessionKeywordSearch, setSessionKeywordSearch] = useState('');
  const [sessionAppFilter, setSessionAppFilter] = useState('all');
  const [sessionAgentFilter, setSessionAgentFilter] = useState('all');
  const [sessionModelFilter, setSessionModelFilter] = useState('all');
  const [sessionUserFilter, setSessionUserFilter] = useState('all');
  
  // Message filters: keyword search + 全部应用、全部智能体、全部模型、全部会话、全部用户
  const [messageKeywordSearch, setMessageKeywordSearch] = useState('');
  const [messageAppFilter, setMessageAppFilter] = useState('all');
  const [messageAgentFilter, setMessageAgentFilter] = useState('all');
  const [messageModelFilter, setMessageModelFilter] = useState('all');
  const [messageSessionFilter, setMessageSessionFilter] = useState('all');
  const [messageUserFilter, setMessageUserFilter] = useState('all');
  
  // Feedback filters: keyword search + 全部应用、全部智能体、全部模型、全部会话、全部用户
  const [feedbackAppFilter, setFeedbackAppFilter] = useState('all');
  const [feedbackAgentFilter, setFeedbackAgentFilter] = useState('all');
  const [feedbackModelFilter, setFeedbackModelFilter] = useState('all');
  const [feedbackSessionFilter, setFeedbackSessionFilter] = useState('all');
  const [feedbackUserFilter, setFeedbackUserFilter] = useState('all');
  
  // Session detail
  const [selectedSession, setSelectedSession] = useState<MonitorSession | null>(null);
  const [sessionMessageSearch, setSessionMessageSearch] = useState('');
  const [sessionMessagePage, setSessionMessagePage] = useState(1);
  
  // Message detail
  const [selectedMessage, setSelectedMessage] = useState<MonitorMessage | null>(null);
  
  // Delete confirmation
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'session' | 'message' | 'feedback'; id: string } | null>(null);

  // 关键字防抖：输入停止后 400ms 才触发搜索
  const [messageKeywordApplied, setMessageKeywordApplied] = useState('');

  // API 数据 - 会话、消息、反馈列表
  const [sessions, setSessions] = useState<MonitorSession[]>([]);
  const [sessionsListLoading, setSessionsListLoading] = useState(false);
  const [messages, setMessages] = useState<MonitorMessage[]>([]);
  const [messagesListLoading, setMessagesListLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<MonitorFeedback[]>([]);
  const [feedbacksListLoading, setFeedbacksListLoading] = useState(false);
  const [sessionMessages, setSessionMessages] = useState<MessageVo[]>([]);
  const [sessionMessagesLoading, setSessionMessagesLoading] = useState(false);

  const [overviewStats, setOverviewStats] = useState<OverviewStats>(DEFAULT_OVERVIEW_STATS);
  const [overviewStatsLoading, setOverviewStatsLoading] = useState(true);
  const [sessionsChartData, setSessionsChartData] = useState<ChartDataPointVo[]>([]);
  const [sessionsChartLoading, setSessionsChartLoading] = useState(true);
  const [messagesChartData, setMessagesChartData] = useState<ChartDataPointVo[]>([]);
  const [messagesChartLoading, setMessagesChartLoading] = useState(true);
  const [feedbackChartData, setFeedbackChartData] = useState<ChartDataPointVo[]>([]);
  const [feedbackChartLoading, setFeedbackChartLoading] = useState(true);

  const buildChartQuery = useCallback(
    (range: 'year' | 'month' | 'day', year: string, month: string, day: string) => {
      const q: Record<string, string> = { range };
      if (range === 'year' || range === 'month') q.year = year;
      if (range === 'month') q.month = month;
      if (range === 'day') {
        q.year = year;
        q.month = month;
        q.day = day;
      }
      return q;
    },
    []
  );

  const mapOverviewFromApi = useCallback((vo: ChatMonitorOverviewVo | null): OverviewStats => {
    if (!vo) return DEFAULT_OVERVIEW_STATS;
    return {
      throughput: {
        current: vo.throughput?.current ?? 0,
        min: vo.throughput?.min ?? 0,
        max: vo.throughput?.max ?? 0,
        average: vo.throughput?.average ?? 0,
      },
      sessions: { active: vo.sessions?.active ?? 0, total: vo.sessions?.total ?? 0 },
      messages: { active: vo.messages?.active ?? 0, total: vo.messages?.total ?? 0 },
      users: { active: vo.users?.active ?? 0, total: vo.users?.total ?? 0 },
      feedback: {
        like: vo.feedback?.like ?? 0,
        dislike: vo.feedback?.dislike ?? 0,
        total: vo.feedback?.total ?? 0,
      },
      applications: { active: vo.applications?.active ?? 0, total: vo.applications?.total ?? 0 },
      agents: { active: vo.agents?.active ?? 0, total: vo.agents?.total ?? 0 },
      models: { active: vo.models?.active ?? 0, total: vo.models?.total ?? 0 },
    };
  }, []);

  const loadOverview = useCallback(async () => {
    setOverviewStatsLoading(true);
    try {
      const res = await MonitorService.getOverview();
      const data = (res as { data?: ChatMonitorOverviewVo })?.data;
      setOverviewStats(mapOverviewFromApi(data ?? null));
    } catch {
      setOverviewStats(DEFAULT_OVERVIEW_STATS);
    } finally {
      setOverviewStatsLoading(false);
    }
  }, [mapOverviewFromApi]);

  const formatChartDate = useCallback(
    (date: string) => {
      if (Object.values(MonthEnum).includes(date as MonthEnum)) {
        const translated = t(`enum.MonthEnum.${date}`);
        return translated.startsWith('enum.') ? date : translated;
      }
      return date;
    },
    [t]
  );

  const loadSessionsChart = useCallback(async () => {
    setSessionsChartLoading(true);
    try {
      const query = buildChartQuery(
        sessionsChartRange,
        sessionsSelectedYear,
        sessionsSelectedMonth,
        sessionsSelectedDay
      );
      const res = await MonitorService.getSessionsChartData(query);
      const list = (res as { data?: ChartDataPointVo[] })?.data ?? [];
      setSessionsChartData(list.map((p) => ({
        ...p,
        value: Number(p.value),
        date: formatChartDate(p.date),
      })));
    } catch {
      setSessionsChartData([]);
    } finally {
      setSessionsChartLoading(false);
    }
  }, [
    sessionsChartRange,
    sessionsSelectedYear,
    sessionsSelectedMonth,
    sessionsSelectedDay,
    buildChartQuery,
    formatChartDate,
  ]);

  const loadMessagesChart = useCallback(async () => {
    setMessagesChartLoading(true);
    try {
      const query = buildChartQuery(
        messagesChartRange,
        messagesSelectedYear,
        messagesSelectedMonth,
        messagesSelectedDay
      );
      const res = await MonitorService.getMessagesChartData(query);
      const list = (res as { data?: ChartDataPointVo[] })?.data ?? [];
      setMessagesChartData(list.map((p) => ({
        ...p,
        value: Number(p.value),
        date: formatChartDate(p.date),
      })));
    } catch {
      setMessagesChartData([]);
    } finally {
      setMessagesChartLoading(false);
    }
  }, [
    messagesChartRange,
    messagesSelectedYear,
    messagesSelectedMonth,
    messagesSelectedDay,
    buildChartQuery,
    formatChartDate,
  ]);

  const loadFeedbackChart = useCallback(async () => {
    setFeedbackChartLoading(true);
    try {
      const query = buildChartQuery(
        feedbackChartRange,
        feedbackSelectedYear,
        feedbackSelectedMonth,
        feedbackSelectedDay
      );
      const res = await MonitorService.getFeedbackChartData(query);
      const list = (res as { data?: ChartDataPointVo[] })?.data ?? [];
      setFeedbackChartData(list.map((p) => ({
        ...p,
        value: Number(p.value),
        date: formatChartDate(p.date),
      })));
    } catch {
      setFeedbackChartData([]);
    } finally {
      setFeedbackChartLoading(false);
    }
  }, [
    feedbackChartRange,
    feedbackSelectedYear,
    feedbackSelectedMonth,
    feedbackSelectedDay,
    buildChartQuery,
    formatChartDate,
  ]);

  // 分页状态：会话、消息、反馈、会话详情消息
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [feedbacksPage, setFeedbacksPage] = useState(1);
  const [feedbacksTotal, setFeedbacksTotal] = useState(0);
  const [sessionMessagesTotal, setSessionMessagesTotal] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const loadSessionsList = useCallback(async (pageNo = 1) => {
    setSessionsListLoading(true);
    try {
      const query: Record<string, unknown> = { pageNo, pageSize: PAGE_SIZE };
      if (sessionKeywordSearch.trim()) query.keyword = sessionKeywordSearch.trim();
      if (sessionAppFilter !== 'all') query.appId = sessionAppFilter;
      if (sessionAgentFilter !== 'all') query.agentId = sessionAgentFilter;
      if (sessionModelFilter !== 'all') query.modelId = sessionModelFilter;
      const res = await SessionService.getSessionList(query as Parameters<typeof SessionService.getSessionList>[0]);
      const data = (res as { data?: { list?: MonitorSession[]; total?: number } })?.data;
      const list = data?.list ?? [];
      setSessions(list);
      setSessionsTotal(data?.total ?? list.length);
    } catch {
      setSessions([]);
      setSessionsTotal(0);
    } finally {
      setSessionsListLoading(false);
    }
  }, [sessionKeywordSearch, sessionAppFilter, sessionAgentFilter, sessionModelFilter]);

  const mapMessageToMonitor = useCallback((m: MessageVo, sessionTitle?: string): MonitorMessage => ({
    ...m,
    messageId: m.id ?? '',
    sessionTitle: sessionTitle ?? m.sessionName ?? m.sessionId,
    userName: (m as { creator?: string }).creator ?? '-',
  }), []);

  const loadMessagesList = useCallback(async (pageNo = 1) => {
    setMessagesListLoading(true);
    try {
      const query: MessageFindDto = { pageNo, pageSize: PAGE_SIZE };
      if (messageKeywordApplied.trim()) query.keyword = messageKeywordApplied.trim();
      if (messageAppFilter !== 'all') query.appId = messageAppFilter;
      if (messageAgentFilter !== 'all') query.agentId = messageAgentFilter;
      if (messageModelFilter !== 'all') query.modelId = messageModelFilter;
      if (messageSessionFilter !== 'all') query.sessionId = messageSessionFilter;
      if (messageUserFilter !== 'all') query.createdBy = Number(messageUserFilter);
      const res = await MessageService.getMessageList(query);
      const data = (res as { data?: { list?: MessageVo[]; total?: number } })?.data;
      const list = data?.list ?? [];
      setMessages(list.map((m) => mapMessageToMonitor(m)));
      setMessagesTotal(data?.total ?? list.length);
    } catch {
      setMessages([]);
      setMessagesTotal(0);
    } finally {
      setMessagesListLoading(false);
    }
  }, [
    mapMessageToMonitor,
    messageKeywordApplied,
    messageAppFilter,
    messageAgentFilter,
    messageModelFilter,
    messageSessionFilter,
    messageUserFilter,
  ]);

  // 关键字防抖：输入停止 400ms 后触发搜索，并重置到第一页
  useEffect(() => {
    const t = setTimeout(() => {
      setMessageKeywordApplied(messageKeywordSearch);
      setMessagesPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [messageKeywordSearch]);

  // 消息 Tab 下拉懒加载 fetchers（每页 10 条，后端搜索）
  const messageAppFetcher = useCallback<LazySelectFetcher>(async ({ pageNo, pageSize, keyword }) => {
    const res = await Applications.getApplicationList({ pageNo, pageSize, keyword } as Record<string, unknown>);
    const data = (res as { data?: Array<{ id?: string | number; name?: string }> | { list?: Array<{ id?: string | number; name?: string }>; total?: number } })?.data;
    const list = Array.isArray(data) ? data : (data as { list?: Array<{ id?: string | number; name?: string }> })?.list ?? [];
    const total = Array.isArray(data) ? data.length : (data as { total?: number })?.total ?? list.length;
    return { list: list.map((a) => ({ id: String(a.id ?? ''), name: a.name ?? '-' })), total };
  }, []);
  const messageAgentFetcher = useCallback<LazySelectFetcher>(async ({ pageNo, pageSize, keyword }) => {
    const res = await Agents.getAgentList({ pageNo, pageSize, keyword });
    const data = (res as { data?: { list?: Array<{ id?: string | number; name?: string }>; total?: number } })?.data;
    const list = data?.list ?? [];
    return { list: list.map((a) => ({ id: String(a.id ?? ''), name: a.name ?? '-' })), total: data?.total ?? list.length };
  }, []);
  const messageModelFetcher = useCallback<LazySelectFetcher>(async ({ pageNo, pageSize, keyword }) => {
    const res = await Models.getModelList({ pageNo, pageSize, keyword } as Record<string, unknown>);
    const data = (res as { data?: { list?: Array<{ id?: string | number; name?: string }>; total?: number } })?.data;
    const list = data?.list ?? [];
    return { list: list.map((m) => ({ id: String(m.id ?? ''), name: m.name ?? '-' })), total: data?.total ?? list.length };
  }, []);
  const messageSessionFetcher = useCallback<LazySelectFetcher>(async ({ pageNo, pageSize, keyword }) => {
    const res = await SessionService.getSessionList({ pageNo, pageSize, keyword } as Record<string, unknown>);
    const data = (res as { data?: { list?: Array<{ id?: string; sessionId?: string; title?: string }>; total?: number } })?.data;
    const list = data?.list ?? [];
    return {
      list: list.map((s) => ({ id: String(s.sessionId ?? s.id ?? ''), name: s.title ?? '-' })),
      total: data?.total ?? list.length,
    };
  }, []);
  const messageUserFetcher = useCallback<LazySelectFetcher>(async ({ pageNo, pageSize, keyword }) => {
    const res = await Member.list({ pageNo, pageSize, keyword });
    const data = (res as { data?: { list?: Array<{ id?: string | number; name?: string; username?: string }>; total?: number } })?.data;
    const list = data?.list ?? [];
    return {
      list: list.map((u) => ({ id: String(u.id ?? ''), name: u.name ?? u.username ?? '-' })),
      total: data?.total ?? list.length,
    };
  }, []);

  const loadFeedbacksList = useCallback(async (pageNo = 1) => {
    setFeedbacksListLoading(true);
    try {
      const query: Record<string, unknown> = {
        pageNo,
        pageSize: PAGE_SIZE,
        filters: [{ key: 'feedbackType', op: SearchCriteria.OpEnum.IsNotNull }],
      };
      if (feedbackAppFilter !== 'all') query.appId = feedbackAppFilter;
      if (feedbackAgentFilter !== 'all') query.agentId = feedbackAgentFilter;
      if (feedbackModelFilter !== 'all') query.modelId = feedbackModelFilter;
      if (feedbackSessionFilter !== 'all') query.sessionId = feedbackSessionFilter;
      if (feedbackUserFilter !== 'all') query.createdBy = Number(feedbackUserFilter);
      const res = await MessageService.getMessageList(query as Parameters<typeof MessageService.getMessageList>[0]);
      const data = (res as { data?: { list?: MessageVo[]; total?: number } })?.data;
      const list = data?.list ?? [];
      const toFeedback = (m: MessageVo): MonitorFeedback => ({
        id: m.id ?? '',
        messageId: m.id ?? '',
        sessionId: m.sessionId,
        sessionTitle: m.sessionName ?? m.sessionId ?? '',
        feedbackType: ((m.feedbackType ?? '').toLowerCase() === 'like' ? 'like' : 'dislike') as 'like' | 'dislike',
        feedbackComment: m.feedbackComment,
        appId: m.appId,
        appName: m.appName,
        agentId: m.agentId,
        agentName: m.agentName,
        modelId: m.modelId,
        modelName: m.modelName,
        messageContent: m.content,
        userName: (m as { creator?: string }).creator,
        createdAt: m.datetime,
      });
      setFeedbacks(list.map(toFeedback));
      setFeedbacksTotal(data?.total ?? list.length);
    } catch {
      setFeedbacks([]);
      setFeedbacksTotal(0);
    } finally {
      setFeedbacksListLoading(false);
    }
  }, [
    feedbackAppFilter,
    feedbackAgentFilter,
    feedbackModelFilter,
    feedbackSessionFilter,
    feedbackUserFilter,
  ]);

  const loadSessionMessages = useCallback(async (sessionId: string, pageNo = 1, keyword?: string) => {
    setSessionMessagesLoading(true);
    try {
      const res = await MessageService.getMessageList({
        sessionId,
        pageNo,
        pageSize: PAGE_SIZE,
        ...(keyword ? { keyword } : {}),
      });
      const data = (res as { data?: { list?: MessageVo[]; total?: number } })?.data;
      const list = data?.list ?? [];
      setSessionMessages(list);
      setSessionMessagesTotal(data?.total ?? list.length);
    } catch {
      setSessionMessages([]);
      setSessionMessagesTotal(0);
    } finally {
      setSessionMessagesLoading(false);
    }
  }, []);

  // 按需加载：Chart 与 List 分离，下拉变更不触发 Chart 重载；三个 Tab 下拉均为 LazySelect 懒加载
  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessionsChart();
    }
  }, [activeTab, loadSessionsChart]);

  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessionsList(sessionsPage);
    }
  }, [activeTab, loadSessionsList, sessionsPage]);

  useEffect(() => {
    if (activeTab === 'messages') {
      loadMessagesChart();
    }
  }, [activeTab, loadMessagesChart]);

  useEffect(() => {
    if (activeTab === 'messages') {
      loadMessagesList(messagesPage);
    }
  }, [activeTab, loadMessagesList, messagesPage]);

  useEffect(() => {
    if (activeTab === 'feedback') {
      loadFeedbackChart();
    }
  }, [activeTab, loadFeedbackChart]);

  useEffect(() => {
    if (activeTab === 'feedback') {
      loadFeedbacksList(feedbacksPage);
    }
  }, [activeTab, loadFeedbacksList, feedbacksPage]);

  useEffect(() => {
    if (selectedSession?.sessionId ?? selectedSession?.id) {
      loadSessionMessages(
        selectedSession.sessionId ?? selectedSession.id ?? '',
        sessionMessagePage,
        sessionMessageSearch || undefined
      );
    } else {
      setSessionMessages([]);
    }
  }, [selectedSession, sessionMessagePage, sessionMessageSearch, loadSessionMessages]);

  // Handlers
  const handleViewSessionDetail = (session: MonitorSession) => {
    setSelectedSession(session);
    setCurrentView('session-detail');
    setSessionMessagePage(1);
    setSessionMessageSearch('');
  };

  const handleViewMessageDetail = (message: MonitorMessage) => {
    setSelectedMessage(message);
    setCurrentView('message-detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSession(null);
    setSelectedMessage(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    setDeleteTarget({ type: 'session', id: sessionId });
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteMessage = (messageId: string) => {
    setDeleteTarget({ type: 'message', id: messageId });
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setDeleteTarget({ type: 'feedback', id: feedbackId });
    setShowDeleteConfirmDialog(true);
  };

  // 会话 Tab 筛选变更时重置到第一页
  const handleSessionAppFilterChange = (v: string) => {
    setSessionAppFilter(v);
    setSessionsPage(1);
  };
  const handleSessionAgentFilterChange = (v: string) => {
    setSessionAgentFilter(v);
    setSessionsPage(1);
  };
  const handleSessionModelFilterChange = (v: string) => {
    setSessionModelFilter(v);
    setSessionsPage(1);
  };
  const handleSessionUserFilterChange = (v: string) => {
    setSessionUserFilter(v);
    setSessionsPage(1);
  };

  // 消息 Tab 筛选变更时重置到第一页
  const handleMessageAppFilterChange = (v: string) => {
    setMessageAppFilter(v);
    setMessagesPage(1);
  };
  const handleMessageAgentFilterChange = (v: string) => {
    setMessageAgentFilter(v);
    setMessagesPage(1);
  };
  const handleMessageModelFilterChange = (v: string) => {
    setMessageModelFilter(v);
    setMessagesPage(1);
  };
  const handleMessageSessionFilterChange = (v: string) => {
    setMessageSessionFilter(v);
    setMessagesPage(1);
  };
  const handleMessageUserFilterChange = (v: string) => {
    setMessageUserFilter(v);
    setMessagesPage(1);
  };

  // 反馈 Tab 筛选变更时重置到第一页
  const handleFeedbackAppFilterChange = (v: string) => {
    setFeedbackAppFilter(v);
    setFeedbacksPage(1);
  };
  const handleFeedbackAgentFilterChange = (v: string) => {
    setFeedbackAgentFilter(v);
    setFeedbacksPage(1);
  };
  const handleFeedbackModelFilterChange = (v: string) => {
    setFeedbackModelFilter(v);
    setFeedbacksPage(1);
  };
  const handleFeedbackSessionFilterChange = (v: string) => {
    setFeedbackSessionFilter(v);
    setFeedbacksPage(1);
  };
  const handleFeedbackUserFilterChange = (v: string) => {
    setFeedbackUserFilter(v);
    setFeedbacksPage(1);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'session') {
        await SessionService.deleteSession(deleteTarget.id);
        setSessions((prev) => prev.filter((s) => (s.sessionId ?? s.id) !== deleteTarget!.id));
        if (selectedSession && (selectedSession.sessionId ?? selectedSession.id) === deleteTarget.id) {
          handleBackToList();
        }
      } else if (deleteTarget.type === 'message') {
        await MessageService.deleteMessage(deleteTarget.id);
        setMessages((prev) => prev.filter((m) => (m.id ?? m.messageId ?? '') !== deleteTarget!.id));
        if (selectedMessage && (selectedMessage.id ?? selectedMessage.messageId) === deleteTarget.id) {
          handleBackToList();
        }
      } else if (deleteTarget.type === 'feedback') {
        await MessageService.deleteFeedback(deleteTarget.id);
        setFeedbacks((prev) => prev.filter((f) => f.id !== deleteTarget!.id));
      }
      toast.success(
        language === 'zh-CN'
          ? `${deleteTarget.type === 'session' ? '会话' : deleteTarget.type === 'message' ? '消息' : '反馈'}已删除`
          : `${deleteTarget.type} deleted successfully`
      );
    } catch {
      toast.error(language === 'zh-CN' ? '删除失败' : 'Delete failed');
    } finally {
      setShowDeleteConfirmDialog(false);
      setDeleteTarget(null);
    }
  };

  // Render session detail page
  const renderSessionDetail = () => {
    if (!selectedSession) return null;

    const totalPages = Math.max(1, Math.ceil(sessionMessagesTotal / PAGE_SIZE));

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === 'zh-CN' ? '返回列表' : 'Back to List'}
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          <h2 className="text-xl font-semibold dark:text-white">
            {language === 'zh-CN' ? '会话详情' : 'Session Details'}
          </h2>
        </div>

        {/* Session Info Card */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold dark:text-white">{selectedSession.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedSession.sessionId}
                  </Badge>
                  {selectedSession.isPinned && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                      {language === 'zh-CN' ? '已置顶' : 'Pinned'}
                    </Badge>
                  )}
                  {selectedSession.isStarred && (
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
                      {language === 'zh-CN' ? '已收藏' : 'Starred'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '应用' : 'Application'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.appName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '智能体' : 'Agent'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.agentName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '用户' : 'User'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{(selectedSession as { userName?: string }).userName ?? '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '消息数量' : 'Message Count'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.messageCount}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '创建时间' : 'Created At'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{(selectedSession as { createdAt?: string; createdDate?: string }).createdAt ?? (selectedSession as { createdDate?: string }).createdDate ?? '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '更新时间' : 'Updated At'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{(selectedSession as { updatedAt?: string; lastModifiedDate?: string }).updatedAt ?? (selectedSession as { lastModifiedDate?: string }).lastModifiedDate ?? '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Messages Section */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">
                {language === 'zh-CN' ? '消息记录' : 'Message History'}
              </h3>
              <div className="w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索消息内容...' : 'Search messages...'}
                    value={sessionMessageSearch}
                    onChange={(e) => {
                      setSessionMessageSearch(e.target.value);
                      setSessionMessagePage(1);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && loadSessionMessages(
                      selectedSession.sessionId ?? selectedSession.id ?? '',
                      1,
                      sessionMessageSearch || undefined
                    )}
                    className="pl-10 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            {sessionMessagesLoading && sessionMessages.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {language === 'zh-CN' ? '加载中...' : 'Loading...'}
              </div>
            )}
            <div className="space-y-3">
              {sessionMessages.map((message) => (
                <div
                  key={message.id ?? ''}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      (message.role ?? '').toUpperCase() === 'USER'
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-purple-100 dark:bg-purple-900/30"
                    )}>
                      {(message.role ?? '').toUpperCase() === 'USER' ? (
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium dark:text-white">
                          {(message.role ?? '').toUpperCase() === 'USER' ? ((message as { creator?: string }).creator ?? '-') : 'AI Assistant'}
                        </span>
                        <Badge variant="secondary" className="text-xs font-mono">
                          {message.id ?? ''}
                        </Badge>
                        {(message.feedbackType ?? '').toLowerCase() && (
                          <Badge className={cn(
                            "text-xs border-0",
                            (message.feedbackType ?? '').toLowerCase() === 'like'
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {(message.feedbackType ?? '').toLowerCase() === 'like' ? (
                              <ThumbsUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ThumbsDown className="h-3 w-3 mr-1" />
                            )}
                            {(message.feedbackType ?? '').toLowerCase() === 'like' 
                              ? (language === 'zh-CN' ? '好评' : 'Like')
                              : (language === 'zh-CN' ? '差评' : 'Dislike')
                            }
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{message.datetime ?? (message as { createdAt?: string }).createdAt ?? '-'}</span>
                        {message.usage && (
                          <span>
                            {language === 'zh-CN' ? 'Token: ' : 'Tokens: '}
                            {message.usage.totalTokens ?? 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={sessionMessagePage}
                totalPages={totalPages}
                onPageChange={setSessionMessagePage}
                totalItems={sessionMessagesTotal}
                pageSize={PAGE_SIZE}
              />
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Render message detail page
  const renderMessageDetail = () => {
    if (!selectedMessage) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === 'zh-CN' ? '返回列表' : 'Back to List'}
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          <h2 className="text-xl font-semibold dark:text-white">
            {language === 'zh-CN' ? '消息详情' : 'Message Details'}
          </h2>
        </div>

        {/* Message Info Card */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                (selectedMessage.role ?? '').toUpperCase() === 'USER' 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-purple-100 dark:bg-purple-900/30"
              )}>
                {(selectedMessage.role ?? '').toUpperCase() === 'USER' ? (
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold dark:text-white">
                    {(selectedMessage.role ?? '').toUpperCase() === 'USER' ? selectedMessage.userName : 'AI Assistant'}
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {selectedMessage.messageId ?? selectedMessage.id ?? ''}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    (selectedMessage.role ?? '').toUpperCase() === 'USER'
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                    "border-0"
                  )}>
                    {(selectedMessage.role ?? '').toUpperCase() === 'USER' 
                      ? (language === 'zh-CN' ? '用户消息' : 'User Message')
                      : (language === 'zh-CN' ? '助手回复' : 'Assistant Reply')
                    }
                  </Badge>
                  {selectedMessage.feedbackType && (
                    <Badge className={cn(
                      "border-0",
                      selectedMessage.feedbackType === 'like'
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {selectedMessage.feedbackType === 'like' ? (
                        <ThumbsUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ThumbsDown className="h-3 w-3 mr-1" />
                      )}
                      {selectedMessage.feedbackType === 'like' 
                        ? (language === 'zh-CN' ? '好评' : 'Like')
                        : (language === 'zh-CN' ? '差评' : 'Dislike')
                      }
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Label className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {language === 'zh-CN' ? '消息内容' : 'Message Content'}
              </Label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '所属会话' : 'Session'}
                </Label>
                <div className="mt-1">
                  <button
                    onClick={() => {
                      const session = sessions.find((s) => (s.sessionId ?? s.id) === selectedMessage.sessionId);
                      if (session) handleViewSessionDetail(session);
                    }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedMessage.sessionTitle}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    {selectedMessage.sessionId}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '应用' : 'Application'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedMessage.appName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '智能体' : 'Agent'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedMessage.agentName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '创建时间' : 'Created At'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedMessage.datetime ?? (selectedMessage as { createdAt?: string }).createdAt ?? '-'}</p>
              </div>
              {selectedMessage.usage && (
                <>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '输入Token' : 'Prompt Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.usage?.promptTokens ?? 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '输出Token' : 'Completion Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.usage?.completionTokens ?? 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '总Token' : 'Total Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.usage?.totalTokens ?? 0}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Feedback Comment if exists */}
            {selectedMessage.feedbackComment && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {language === 'zh-CN' ? '反馈评论' : 'Feedback Comment'}
                </Label>
                <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm dark:text-gray-300">
                    {selectedMessage.feedbackComment}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  if (currentView === 'session-detail') {
    return renderSessionDetail();
  }

  if (currentView === 'message-detail') {
    return renderMessageDetail();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold dark:text-white mb-2">
          {language === 'zh-CN' ? '对话监控' : 'Conversation Monitoring'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'zh-CN' 
            ? '监控和管理AI对话会话、消息和用户反馈' 
            : 'Monitor and manage AI conversation sessions, messages, and user feedback'
          }
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'zh-CN' ? '统计概览' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger 
            value="sessions"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {language === 'zh-CN' ? '会话管理' : 'Sessions'}
          </TabsTrigger>
          <TabsTrigger 
            value="messages"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
          >
            <FileText className="h-4 w-4 mr-2" />
            {language === 'zh-CN' ? '消息管理' : 'Messages'}
          </TabsTrigger>
          <TabsTrigger 
            value="feedback"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {language === 'zh-CN' ? '反馈管理' : 'Feedback'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <MonitorOverview stats={overviewStats} loading={overviewStatsLoading} />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <MonitorSessionsTab
            chartRange={sessionsChartRange}
            chartSelectedYear={sessionsSelectedYear}
            chartSelectedMonth={sessionsSelectedMonth}
            chartSelectedDay={sessionsSelectedDay}
            onChartRangeChange={setSessionsChartRange}
            onChartYearChange={setSessionsSelectedYear}
            onChartMonthChange={setSessionsSelectedMonth}
            onChartDayChange={setSessionsSelectedDay}
            chartData={sessionsChartData}
            chartLoading={sessionsChartLoading}
            keywordSearch={sessionKeywordSearch}
            onKeywordSearchChange={setSessionKeywordSearch}
            appFilter={sessionAppFilter}
            agentFilter={sessionAgentFilter}
            modelFilter={sessionModelFilter}
            userFilter={sessionUserFilter}
            onAppFilterChange={handleSessionAppFilterChange}
            onAgentFilterChange={handleSessionAgentFilterChange}
            onModelFilterChange={handleSessionModelFilterChange}
            onUserFilterChange={handleSessionUserFilterChange}
            appFetcher={messageAppFetcher}
            agentFetcher={messageAgentFetcher}
            modelFetcher={messageModelFetcher}
            userFetcher={messageUserFetcher}
            sessions={sessions}
            sessionsLoading={sessionsListLoading}
            pagination={{
              page: sessionsPage,
              total: sessionsTotal,
              pageSize: PAGE_SIZE,
              onPageChange: (p) => setSessionsPage(p),
            }}
            onViewSession={handleViewSessionDetail}
            onDeleteSession={handleDeleteSession}
          />
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <MonitorMessagesTab
            chartRange={messagesChartRange}
            chartSelectedYear={messagesSelectedYear}
            chartSelectedMonth={messagesSelectedMonth}
            chartSelectedDay={messagesSelectedDay}
            onChartRangeChange={setMessagesChartRange}
            onChartYearChange={setMessagesSelectedYear}
            onChartMonthChange={setMessagesSelectedMonth}
            onChartDayChange={setMessagesSelectedDay}
            chartData={messagesChartData}
            chartLoading={messagesChartLoading}
            keywordSearch={messageKeywordSearch}
            onKeywordSearchChange={setMessageKeywordSearch}
            onKeywordSubmit={() => {
              setMessageKeywordApplied(messageKeywordSearch);
              setMessagesPage(1);
            }}
            appFilter={messageAppFilter}
            agentFilter={messageAgentFilter}
            modelFilter={messageModelFilter}
            sessionFilter={messageSessionFilter}
            userFilter={messageUserFilter}
            onAppFilterChange={handleMessageAppFilterChange}
            onAgentFilterChange={handleMessageAgentFilterChange}
            onModelFilterChange={handleMessageModelFilterChange}
            onSessionFilterChange={handleMessageSessionFilterChange}
            onUserFilterChange={handleMessageUserFilterChange}
            appFetcher={messageAppFetcher}
            agentFetcher={messageAgentFetcher}
            modelFetcher={messageModelFetcher}
            sessionFetcher={messageSessionFetcher}
            userFetcher={messageUserFetcher}
            messages={messages}
            messagesLoading={messagesListLoading}
            pagination={{
              page: messagesPage,
              total: messagesTotal,
              pageSize: PAGE_SIZE,
              onPageChange: (p) => setMessagesPage(p),
            }}
            onViewSession={handleViewSessionDetail}
            onViewMessage={handleViewMessageDetail}
            onDeleteMessage={handleDeleteMessage}
          />
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <MonitorFeedbackTab
            chartRange={feedbackChartRange}
            chartSelectedYear={feedbackSelectedYear}
            chartSelectedMonth={feedbackSelectedMonth}
            chartSelectedDay={feedbackSelectedDay}
            onChartRangeChange={setFeedbackChartRange}
            onChartYearChange={setFeedbackSelectedYear}
            onChartMonthChange={setFeedbackSelectedMonth}
            onChartDayChange={setFeedbackSelectedDay}
            chartData={feedbackChartData}
            chartLoading={feedbackChartLoading}
            appFilter={feedbackAppFilter}
            agentFilter={feedbackAgentFilter}
            modelFilter={feedbackModelFilter}
            sessionFilter={feedbackSessionFilter}
            userFilter={feedbackUserFilter}
            onAppFilterChange={handleFeedbackAppFilterChange}
            onAgentFilterChange={handleFeedbackAgentFilterChange}
            onModelFilterChange={handleFeedbackModelFilterChange}
            onSessionFilterChange={handleFeedbackSessionFilterChange}
            onUserFilterChange={handleFeedbackUserFilterChange}
            appFetcher={messageAppFetcher}
            agentFetcher={messageAgentFetcher}
            modelFetcher={messageModelFetcher}
            sessionFetcher={messageSessionFetcher}
            userFetcher={messageUserFetcher}
            feedbacks={feedbacks}
            feedbacksLoading={feedbacksListLoading}
            pagination={{
              page: feedbacksPage,
              total: feedbacksTotal,
              pageSize: PAGE_SIZE,
              onPageChange: (p) => setFeedbacksPage(p),
            }}
            messages={messages}
            onViewSession={handleViewSessionDetail}
            onViewMessage={handleViewMessageDetail}
            onDeleteFeedback={handleDeleteFeedback}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'zh-CN' ? '确认删除' : 'Confirm Delete'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' 
                ? `确定要删除这个${deleteTarget?.type === 'session' ? '会话' : deleteTarget?.type === 'message' ? '消息' : '反馈'}吗？此操作无法撤销。`
                : `Are you sure you want to delete this ${deleteTarget?.type}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {language === 'zh-CN' ? '删除' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
