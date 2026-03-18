import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import MonitorService from '@/services/Monitor';
import SessionService from '@/services/Session';
import MessageService from '@/services/Message';
import type { ChartDataPointVo, ChatMonitorOverviewVo } from '@/services/MonitorTypes';
import type { MessageVo } from '@/services/MessageTypes';
import { MessageSquare, FileText, ThumbsUp, ThumbsDown, ChevronLeft, BarChart3, Search, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import {
  MonitorOverview,
  MonitorSessionsTab,
  MonitorMessagesTab,
  MonitorFeedbackTab,
  type MonitorSession,
  type MonitorMessage,
  type MonitorFeedback,
} from './components';

interface ThroughputStats {
  current: number;
  min: number;
  max: number;
  average: number;
}

interface DualStats {
  active: number;
  total: number;
}

interface FeedbackStats {
  like: number;
  dislike: number;
  total: number;
}

interface OverviewStats {
  throughput: ThroughputStats;
  sessions: DualStats;
  messages: DualStats;
  users: DualStats;
  feedback: FeedbackStats;
  applications: DualStats;
  agents: DualStats;
  models: DualStats;
}

/** 月份枚举到前端展示的映射（后端返回 JANUARY 等，国际化由前端处理） */
const MONTH_LABELS: Record<string, { zh: string; en: string }> = {
  JANUARY: { zh: '1月', en: 'Jan' },
  FEBRUARY: { zh: '2月', en: 'Feb' },
  MARCH: { zh: '3月', en: 'Mar' },
  APRIL: { zh: '4月', en: 'Apr' },
  MAY: { zh: '5月', en: 'May' },
  JUNE: { zh: '6月', en: 'Jun' },
  JULY: { zh: '7月', en: 'Jul' },
  AUGUST: { zh: '8月', en: 'Aug' },
  SEPTEMBER: { zh: '9月', en: 'Sep' },
  OCTOBER: { zh: '10月', en: 'Oct' },
  NOVEMBER: { zh: '11月', en: 'Nov' },
  DECEMBER: { zh: '12月', en: 'Dec' },
};

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
  const { language } = useLanguage();
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
  const [sessionAppSearch, setSessionAppSearch] = useState('');
  const [sessionAgentSearch, setSessionAgentSearch] = useState('');
  const [sessionModelSearch, setSessionModelSearch] = useState('');
  const [sessionUserSearch, setSessionUserSearch] = useState('');
  
  // Message filters: keyword search + 全部应用、全部智能体、全部模型、全部会话、全部用户
  const [messageKeywordSearch, setMessageKeywordSearch] = useState('');
  const [messageAppFilter, setMessageAppFilter] = useState('all');
  const [messageAgentFilter, setMessageAgentFilter] = useState('all');
  const [messageModelFilter, setMessageModelFilter] = useState('all');
  const [messageSessionFilter, setMessageSessionFilter] = useState('all');
  const [messageUserFilter, setMessageUserFilter] = useState('all');
  const [messageAppSearch, setMessageAppSearch] = useState('');
  const [messageAgentSearch, setMessageAgentSearch] = useState('');
  const [messageModelSearch, setMessageModelSearch] = useState('');
  const [messageSessionSearch, setMessageSessionSearch] = useState('');
  const [messageUserSearch, setMessageUserSearch] = useState('');
  
  // Feedback filters: keyword search + 全部应用、全部智能体、全部模型、全部会话、全部用户
  const [feedbackKeywordSearch, setFeedbackKeywordSearch] = useState('');
  const [feedbackAppFilter, setFeedbackAppFilter] = useState('all');
  const [feedbackAgentFilter, setFeedbackAgentFilter] = useState('all');
  const [feedbackModelFilter, setFeedbackModelFilter] = useState('all');
  const [feedbackSessionFilter, setFeedbackSessionFilter] = useState('all');
  const [feedbackUserFilter, setFeedbackUserFilter] = useState('all');
  const [feedbackAppSearch, setFeedbackAppSearch] = useState('');
  const [feedbackAgentSearch, setFeedbackAgentSearch] = useState('');
  const [feedbackModelSearch, setFeedbackModelSearch] = useState('');
  const [feedbackSessionSearch, setFeedbackSessionSearch] = useState('');
  const [feedbackUserSearch, setFeedbackUserSearch] = useState('');
  
  // Session detail
  const [selectedSession, setSelectedSession] = useState<MonitorSession | null>(null);
  const [sessionMessageSearch, setSessionMessageSearch] = useState('');
  const [sessionMessagePage, setSessionMessagePage] = useState(1);
  
  // Message detail
  const [selectedMessage, setSelectedMessage] = useState<MonitorMessage | null>(null);
  
  // Delete confirmation
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'session' | 'message' | 'feedback'; id: string } | null>(null);

  // Mock data - 过滤下拉选项（应用、智能体、模型、用户），过滤条件交互下一阶段实现
  const applications = [
    { id: 1, name: language === 'zh-CN' ? '智能客服助手' : 'Smart Customer Service' },
    { id: 2, name: language === 'zh-CN' ? '内容创作工具' : 'Content Creation Tool' },
    { id: 3, name: language === 'zh-CN' ? '数据分析助手' : 'Data Analysis Assistant' },
  ];

  // Mock data - Users
  const users = [
    { id: 1, name: 'Alice Chen' },
    { id: 2, name: 'Bob Wang' },
    { id: 3, name: 'Charlie Liu' },
    { id: 4, name: 'David Zhang' },
  ];

  // Mock data - Agents
  const agents = [
    { id: 1, name: language === 'zh-CN' ? 'GPT-4 助手' : 'GPT-4 Assistant' },
    { id: 2, name: language === 'zh-CN' ? 'Claude 助手' : 'Claude Assistant' },
    { id: 3, name: language === 'zh-CN' ? '自定义助手' : 'Custom Assistant' },
  ];

  // Mock data - Models
  const models = [
    { id: 1, name: 'GPT-4o' },
    { id: 2, name: 'Claude-3' },
    { id: 3, name: 'Gemini-Pro' },
  ];

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

  const formatChartDate = useCallback((date: string) => {
    const labels = MONTH_LABELS[date];
    return labels ? (language === 'zh-CN' ? labels.zh : labels.en) : date;
  }, [language]);

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

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    loadSessionsChart();
  }, [loadSessionsChart]);

  useEffect(() => {
    loadMessagesChart();
  }, [loadMessagesChart]);

  useEffect(() => {
    loadFeedbackChart();
  }, [loadFeedbackChart]);

  const loadSessionsList = useCallback(async () => {
    setSessionsListLoading(true);
    try {
      const res = await SessionService.getSessionList({ pageNo: 1, pageSize: 100 });
      const list = (res as { data?: { list?: MonitorSession[] } })?.data?.list ?? [];
      setSessions(list);
    } catch {
      setSessions([]);
    } finally {
      setSessionsListLoading(false);
    }
  }, []);

  const mapMessageToMonitor = useCallback((m: MessageVo, sessionTitle?: string): MonitorMessage => ({
    ...m,
    messageId: m.id ?? '',
    sessionTitle: sessionTitle ?? m.sessionName ?? m.sessionId,
    userName: '-',
  }), []);

  const loadMessagesList = useCallback(async () => {
    setMessagesListLoading(true);
    try {
      const res = await MessageService.getMessageList({ pageNo: 1, pageSize: 100 });
      const list = (res as { data?: { list?: MessageVo[] } })?.data?.list ?? [];
      setMessages(list.map((m) => mapMessageToMonitor(m)));
    } catch {
      setMessages([]);
    } finally {
      setMessagesListLoading(false);
    }
  }, [mapMessageToMonitor]);

  const loadFeedbacksList = useCallback(async () => {
    setFeedbacksListLoading(true);
    try {
      const [likeRes, dislikeRes] = await Promise.all([
        MessageService.getMessageList({ pageNo: 1, pageSize: 50, feedbackType: 'like' }),
        MessageService.getMessageList({ pageNo: 1, pageSize: 50, feedbackType: 'dislike' }),
      ]);
      const likeList = (likeRes as { data?: { list?: MessageVo[] } })?.data?.list ?? [];
      const dislikeList = (dislikeRes as { data?: { list?: MessageVo[] } })?.data?.list ?? [];
      const sessionMap = new Map(sessions.map((s) => [s.sessionId ?? s.id ?? '', s.title ?? '']));
      const toFeedback = (m: MessageVo): MonitorFeedback => ({
        id: m.id ?? '',
        messageId: m.id ?? '',
        sessionId: m.sessionId,
        sessionTitle: m.sessionName ?? sessionMap.get(m.sessionId ?? '') ?? m.sessionId,
        feedbackType: ((m.feedbackType ?? '').toLowerCase() === 'like' ? 'like' : 'dislike') as 'like' | 'dislike',
        feedbackComment: m.feedbackComment,
        appId: m.appId,
        appName: m.appName,
        agentId: m.agentId,
        agentName: m.agentName,
        modelId: m.modelId,
        modelName: m.modelName,
        messageContent: m.content,
        createdAt: m.datetime,
      });
      setFeedbacks([...likeList.map(toFeedback), ...dislikeList.map(toFeedback)]);
    } catch {
      setFeedbacks([]);
    } finally {
      setFeedbacksListLoading(false);
    }
  }, [sessions]);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    setSessionMessagesLoading(true);
    try {
      const res = await MessageService.getMessageList({ sessionId, pageNo: 1, pageSize: 200 });
      const list = (res as { data?: { list?: MessageVo[] } })?.data?.list ?? [];
      setSessionMessages(list);
    } catch {
      setSessionMessages([]);
    } finally {
      setSessionMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessionsList();
  }, [loadSessionsList]);

  useEffect(() => {
    loadMessagesList();
  }, [loadMessagesList]);

  useEffect(() => {
    loadFeedbacksList();
  }, [loadFeedbacksList]);

  useEffect(() => {
    if (selectedSession?.sessionId ?? selectedSession?.id) {
      loadSessionMessages(selectedSession.sessionId ?? selectedSession.id ?? '');
    } else {
      setSessionMessages([]);
    }
  }, [selectedSession, loadSessionMessages]);

  // Filter functions
  const getFilteredSessions = () => {
    return sessions.filter((session) => {
      if (sessionKeywordSearch) {
        const kw = sessionKeywordSearch.toLowerCase();
        if (!(session.title ?? '').toLowerCase().includes(kw) && !(session.sessionId ?? '').toLowerCase().includes(kw)) return false;
      }
      if (sessionAppFilter !== 'all' && (session.appId ?? '') !== sessionAppFilter) return false;
      if (sessionAgentFilter !== 'all' && (session.agentId ?? '') !== sessionAgentFilter) return false;
      if (sessionModelFilter !== 'all' && (session.modelId ?? '') !== sessionModelFilter) return false;
      if (sessionUserFilter !== 'all') return false;
      return true;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter((message) => {
      if (messageKeywordSearch) {
        const kw = messageKeywordSearch.toLowerCase();
        const content = (message.content ?? '').toLowerCase();
        const sessionTitle = (message.sessionName ?? message.sessionTitle ?? message.sessionId ?? '').toLowerCase();
        const msgId = (message.messageId ?? message.id ?? '').toLowerCase();
        if (!content.includes(kw) && !sessionTitle.includes(kw) && !msgId.includes(kw)) return false;
      }
      if (messageAppFilter !== 'all' && (message.appId ?? '') !== messageAppFilter) return false;
      if (messageAgentFilter !== 'all' && (message.agentId ?? '') !== messageAgentFilter) return false;
      if (messageModelFilter !== 'all' && (message.modelId ?? '') !== messageModelFilter) return false;
      if (messageSessionFilter !== 'all' && (message.sessionId ?? '') !== messageSessionFilter) return false;
      if (messageUserFilter !== 'all') return false;
      return true;
    });
  };

  const getFilteredFeedbacks = () => {
    return feedbacks.filter((feedback) => {
      if (feedbackKeywordSearch) {
        const kw = feedbackKeywordSearch.toLowerCase();
        const comment = (feedback.feedbackComment ?? '').toLowerCase();
        const content = (feedback.messageContent ?? '').toLowerCase();
        const title = (feedback.sessionTitle ?? '').toLowerCase();
        if (!comment.includes(kw) && !content.includes(kw) && !title.includes(kw)) return false;
      }
      if (feedbackAppFilter !== 'all' && (feedback.appId ?? '') !== feedbackAppFilter) return false;
      if (feedbackAgentFilter !== 'all' && (feedback.agentId ?? '') !== feedbackAgentFilter) return false;
      if (feedbackModelFilter !== 'all' && (feedback.modelId ?? '') !== feedbackModelFilter) return false;
      if (feedbackSessionFilter !== 'all' && (feedback.sessionId ?? '') !== feedbackSessionFilter) return false;
      if (feedbackUserFilter !== 'all') return false;
      return true;
    });
  };

  const getFilteredSessionMessages = () => {
    return sessionMessages.filter((message) => {
      if (sessionMessageSearch) {
        return (message.content ?? '').toLowerCase().includes(sessionMessageSearch.toLowerCase());
      }
      return true;
    });
  };

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

    const filteredMessages = getFilteredSessionMessages();
    const messagesPerPage = 10;
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
    const paginatedMessages = filteredMessages.slice(
      (sessionMessagePage - 1) * messagesPerPage,
      sessionMessagePage * messagesPerPage
    );

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
                    className="pl-10 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {paginatedMessages.map((message) => (
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
                          {(message.role ?? '').toUpperCase() === 'USER' ? ((message as { userName?: string }).userName ?? '-') : 'AI Assistant'}
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
              <div className="flex justify-center pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSessionMessagePage(prev => Math.max(1, prev - 1))}
                        className={sessionMessagePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setSessionMessagePage(page)}
                          isActive={sessionMessagePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setSessionMessagePage(prev => Math.min(totalPages, prev + 1))}
                        className={sessionMessagePage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
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
            onAppFilterChange={setSessionAppFilter}
            onAgentFilterChange={setSessionAgentFilter}
            onModelFilterChange={setSessionModelFilter}
            onUserFilterChange={setSessionUserFilter}
            appSearch={sessionAppSearch}
            agentSearch={sessionAgentSearch}
            modelSearch={sessionModelSearch}
            userSearch={sessionUserSearch}
            onAppSearchChange={setSessionAppSearch}
            onAgentSearchChange={setSessionAgentSearch}
            onModelSearchChange={setSessionModelSearch}
            onUserSearchChange={setSessionUserSearch}
            applications={applications}
            agents={agents}
            models={models}
            users={users}
            sessions={getFilteredSessions()}
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
            appFilter={messageAppFilter}
            agentFilter={messageAgentFilter}
            modelFilter={messageModelFilter}
            sessionFilter={messageSessionFilter}
            userFilter={messageUserFilter}
            onAppFilterChange={setMessageAppFilter}
            onAgentFilterChange={setMessageAgentFilter}
            onModelFilterChange={setMessageModelFilter}
            onSessionFilterChange={setMessageSessionFilter}
            onUserFilterChange={setMessageUserFilter}
            appSearch={messageAppSearch}
            agentSearch={messageAgentSearch}
            modelSearch={messageModelSearch}
            sessionSearch={messageSessionSearch}
            userSearch={messageUserSearch}
            onAppSearchChange={setMessageAppSearch}
            onAgentSearchChange={setMessageAgentSearch}
            onModelSearchChange={setMessageModelSearch}
            onSessionSearchChange={setMessageSessionSearch}
            onUserSearchChange={setMessageUserSearch}
            applications={applications}
            agents={agents}
            models={models}
            sessions={sessions}
            users={users}
            messages={getFilteredMessages()}
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
            keywordSearch={feedbackKeywordSearch}
            onKeywordSearchChange={setFeedbackKeywordSearch}
            appFilter={feedbackAppFilter}
            agentFilter={feedbackAgentFilter}
            modelFilter={feedbackModelFilter}
            sessionFilter={feedbackSessionFilter}
            userFilter={feedbackUserFilter}
            onAppFilterChange={setFeedbackAppFilter}
            onAgentFilterChange={setFeedbackAgentFilter}
            onModelFilterChange={setFeedbackModelFilter}
            onSessionFilterChange={setFeedbackSessionFilter}
            onUserFilterChange={setFeedbackUserFilter}
            appSearch={feedbackAppSearch}
            agentSearch={feedbackAgentSearch}
            modelSearch={feedbackModelSearch}
            sessionSearch={feedbackSessionSearch}
            userSearch={feedbackUserSearch}
            onAppSearchChange={setFeedbackAppSearch}
            onAgentSearchChange={setFeedbackAgentSearch}
            onModelSearchChange={setFeedbackModelSearch}
            onSessionSearchChange={setFeedbackSessionSearch}
            onUserSearchChange={setFeedbackUserSearch}
            applications={applications}
            agents={agents}
            models={models}
            sessions={sessions}
            users={users}
            feedbacks={getFilteredFeedbacks()}
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
