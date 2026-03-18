import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import MonitorService from '@/services/Monitor';
import type { ChartDataPointVo, ChatMonitorOverviewVo } from '@/services/MonitorTypes';
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
  type Session,
  type Message,
  type Feedback,
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

interface SessionMessage {
  id: number;
  messageId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  userId: number;
  userName: string;
  feedbackType?: 'like' | 'dislike';
  feedbackComment?: string;
  createdAt: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
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
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionMessageSearch, setSessionMessageSearch] = useState('');
  const [sessionMessagePage, setSessionMessagePage] = useState(1);
  
  // Message detail
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Delete confirmation
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'session' | 'message' | 'feedback'; id: number } | null>(null);

  // Mock data - Applications
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

  // Mock data - Sessions
  const sessions: Session[] = [
    {
      id: 1,
      sessionId: 'sess_abc123',
      title: language === 'zh-CN' ? '产品咨询对话' : 'Product Inquiry',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 1,
      agentName: agents[0]?.name ?? '',
      modelId: 1,
      modelName: models[0]?.name ?? '',
      userId: 1,
      userName: 'Alice Chen',
      messageCount: 12,
      isStarred: true,
      isArchived: false,
      isPinned: true,
      createdAt: '2024-03-15 10:30:00',
      updatedAt: '2024-03-15 11:45:00',
    },
    {
      id: 2,
      sessionId: 'sess_def456',
      title: language === 'zh-CN' ? '技术支持会话' : 'Technical Support',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 2,
      agentName: agents[1]?.name ?? '',
      modelId: 2,
      modelName: models[1]?.name ?? '',
      userId: 2,
      userName: 'Bob Wang',
      messageCount: 8,
      isStarred: false,
      isArchived: false,
      isPinned: false,
      createdAt: '2024-03-15 09:15:00',
      updatedAt: '2024-03-15 10:20:00',
    },
    {
      id: 3,
      sessionId: 'sess_ghi789',
      title: language === 'zh-CN' ? '内容创作咨询' : 'Content Creation Inquiry',
      appId: 2,
      appName: applications[1]?.name ?? '',
      agentId: 3,
      agentName: agents[2]?.name ?? '',
      modelId: 3,
      modelName: models[2]?.name ?? '',
      userId: 3,
      userName: 'Charlie Liu',
      messageCount: 15,
      isStarred: true,
      isArchived: false,
      isPinned: false,
      createdAt: '2024-03-14 16:20:00',
      updatedAt: '2024-03-14 17:30:00',
    },
  ];

  // Mock data - Session Messages (for session detail page)
  const sessionMessages: SessionMessage[] = [
    {
      id: 1,
      messageId: 'msg_001',
      role: 'user',
      content: language === 'zh-CN' ? '你好，我想了解一下你们的产品功能' : 'Hello, I want to learn about your product features',
      userId: 1,
      userName: 'Alice Chen',
      createdAt: '2024-03-15 10:30:00',
      tokenUsage: { promptTokens: 15, completionTokens: 0, totalTokens: 15 },
    },
    {
      id: 2,
      messageId: 'msg_002',
      role: 'assistant',
      content: language === 'zh-CN' ? '您好！我很高兴为您介绍我们的产品。我们的产品具有以下主要功能：\n1. 智能对话能力\n2. 多语言支持\n3. 知识库集成\n4. 数据分析功能\n\n您对哪个功能特别感兴趣呢？' : 'Hello! I\'m glad to introduce our product. Our product has the following main features:\n1. Intelligent conversation capabilities\n2. Multi-language support\n3. Knowledge base integration\n4. Data analysis functionality\n\nWhich feature are you particularly interested in?',
      userId: 0,
      userName: 'AI Assistant',
      feedbackType: 'like',
      createdAt: '2024-03-15 10:30:15',
      tokenUsage: { promptTokens: 15, completionTokens: 120, totalTokens: 135 },
    },
    {
      id: 3,
      messageId: 'msg_003',
      role: 'user',
      content: language === 'zh-CN' ? '知识库集成这个功能很有意思，能详细说说吗？' : 'The knowledge base integration feature is interesting, can you tell me more?',
      userId: 1,
      userName: 'Alice Chen',
      createdAt: '2024-03-15 10:32:00',
      tokenUsage: { promptTokens: 25, completionTokens: 0, totalTokens: 25 },
    },
  ];

  // Mock data - Messages
  const messages: Message[] = [
    {
      id: 1,
      messageId: 'msg_001',
      sessionId: 'sess_abc123',
      sessionTitle: language === 'zh-CN' ? '产品咨询对话' : 'Product Inquiry',
      role: 'user',
      content: language === 'zh-CN' ? '你好，我想了解一下你们的产品功能' : 'Hello, I want to learn about your product features',
      userId: 1,
      userName: 'Alice Chen',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 1,
      agentName: agents[0]?.name ?? '',
      modelId: 1,
      modelName: models[0]?.name ?? '',
      createdAt: '2024-03-15 10:30:00',
      tokenUsage: { promptTokens: 15, completionTokens: 0, totalTokens: 15 },
    },
    {
      id: 2,
      messageId: 'msg_002',
      sessionId: 'sess_abc123',
      sessionTitle: language === 'zh-CN' ? '产品咨询对话' : 'Product Inquiry',
      role: 'assistant',
      content: language === 'zh-CN' ? '您好！我很高兴为您介绍我们的产品...' : 'Hello! I\'m glad to introduce our product...',
      userId: 0,
      userName: 'AI Assistant',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 1,
      agentName: agents[0]?.name ?? '',
      modelId: 1,
      modelName: models[0]?.name ?? '',
      feedbackType: 'like',
      createdAt: '2024-03-15 10:30:15',
      tokenUsage: { promptTokens: 15, completionTokens: 120, totalTokens: 135 },
    },
    {
      id: 3,
      messageId: 'msg_003',
      sessionId: 'sess_def456',
      sessionTitle: language === 'zh-CN' ? '技术支持会话' : 'Technical Support',
      role: 'user',
      content: language === 'zh-CN' ? '我遇到了一个技术问题需要帮助' : 'I encountered a technical issue and need help',
      userId: 2,
      userName: 'Bob Wang',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 2,
      agentName: agents[1]?.name ?? '',
      modelId: 2,
      modelName: models[1]?.name ?? '',
      createdAt: '2024-03-15 09:15:00',
      tokenUsage: { promptTokens: 12, completionTokens: 0, totalTokens: 12 },
    },
  ];

  // Mock data - Feedbacks
  const feedbacks: Feedback[] = [
    {
      id: 1,
      messageId: 'msg_002',
      sessionId: 'sess_abc123',
      sessionTitle: language === 'zh-CN' ? '产品咨询对话' : 'Product Inquiry',
      feedbackType: 'like',
      feedbackComment: language === 'zh-CN' ? '回答很详细，很有帮助' : 'Very detailed and helpful answer',
      userId: 1,
      userName: 'Alice Chen',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 1,
      agentName: agents[0]?.name ?? '',
      modelId: 1,
      modelName: models[0]?.name ?? '',
      messageContent: language === 'zh-CN' ? '您好！我很高兴为您介绍我们的产品...' : 'Hello! I\'m glad to introduce our product...',
      createdAt: '2024-03-15 10:31:00',
    },
    {
      id: 2,
      messageId: 'msg_005',
      sessionId: 'sess_def456',
      sessionTitle: language === 'zh-CN' ? '技术支持会话' : 'Technical Support',
      feedbackType: 'dislike',
      feedbackComment: language === 'zh-CN' ? '回答不够准确' : 'Answer is not accurate enough',
      userId: 2,
      userName: 'Bob Wang',
      appId: 1,
      appName: applications[0]?.name ?? '',
      agentId: 2,
      agentName: agents[1]?.name ?? '',
      modelId: 2,
      modelName: models[1]?.name ?? '',
      messageContent: language === 'zh-CN' ? '这个问题可能需要您提供更多信息...' : 'This issue may require more information...',
      createdAt: '2024-03-15 09:45:00',
    },
  ];

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

  // Filter functions
  const getFilteredSessions = () => {
    return sessions.filter(session => {
      if (sessionKeywordSearch) {
        const kw = sessionKeywordSearch.toLowerCase();
        if (!session.title.toLowerCase().includes(kw) && !session.sessionId.toLowerCase().includes(kw)) return false;
      }
      if (sessionAppFilter !== 'all' && session.appId !== parseInt(sessionAppFilter)) return false;
      if (sessionAgentFilter !== 'all' && session.agentId !== parseInt(sessionAgentFilter)) return false;
      if (sessionModelFilter !== 'all' && session.modelId !== parseInt(sessionModelFilter)) return false;
      if (sessionUserFilter !== 'all' && session.userId !== parseInt(sessionUserFilter)) return false;
      return true;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter(message => {
      if (messageKeywordSearch) {
        const kw = messageKeywordSearch.toLowerCase();
        if (!message.content.toLowerCase().includes(kw) && !message.sessionTitle.toLowerCase().includes(kw) && !message.messageId.toLowerCase().includes(kw)) return false;
      }
      if (messageAppFilter !== 'all' && message.appId !== parseInt(messageAppFilter)) return false;
      if (messageAgentFilter !== 'all' && message.agentId !== parseInt(messageAgentFilter)) return false;
      if (messageModelFilter !== 'all' && message.modelId !== parseInt(messageModelFilter)) return false;
      if (messageSessionFilter !== 'all' && message.sessionId !== messageSessionFilter) return false;
      if (messageUserFilter !== 'all' && message.userId !== parseInt(messageUserFilter)) return false;
      return true;
    });
  };

  const getFilteredFeedbacks = () => {
    return feedbacks.filter(feedback => {
      if (feedbackKeywordSearch) {
        const kw = feedbackKeywordSearch.toLowerCase();
        if (!feedback.feedbackComment?.toLowerCase().includes(kw) && !feedback.messageContent.toLowerCase().includes(kw) && !feedback.sessionTitle.toLowerCase().includes(kw)) return false;
      }
      if (feedbackAppFilter !== 'all' && feedback.appId !== parseInt(feedbackAppFilter)) return false;
      if (feedbackAgentFilter !== 'all' && feedback.agentId !== parseInt(feedbackAgentFilter)) return false;
      if (feedbackModelFilter !== 'all' && feedback.modelId !== parseInt(feedbackModelFilter)) return false;
      if (feedbackSessionFilter !== 'all' && feedback.sessionId !== feedbackSessionFilter) return false;
      if (feedbackUserFilter !== 'all' && feedback.userId !== parseInt(feedbackUserFilter)) return false;
      return true;
    });
  };

  const getFilteredSessionMessages = () => {
    return sessionMessages.filter(message => {
      if (sessionMessageSearch) {
        return message.content.toLowerCase().includes(sessionMessageSearch.toLowerCase());
      }
      return true;
    });
  };

  // Handlers
  const handleViewSessionDetail = (session: Session) => {
    setSelectedSession(session);
    setCurrentView('session-detail');
    setSessionMessagePage(1);
    setSessionMessageSearch('');
  };

  const handleViewMessageDetail = (message: Message) => {
    setSelectedMessage(message);
    setCurrentView('message-detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSession(null);
    setSelectedMessage(null);
  };

  const handleDeleteSession = (id: number) => {
    setDeleteTarget({ type: 'session', id });
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteMessage = (id: number) => {
    setDeleteTarget({ type: 'message', id });
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteFeedback = (id: number) => {
    setDeleteTarget({ type: 'feedback', id });
    setShowDeleteConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success(
        language === 'zh-CN' 
          ? `${deleteTarget.type === 'session' ? '会话' : deleteTarget.type === 'message' ? '消息' : '反馈'}已删除` 
          : `${deleteTarget.type} deleted successfully`
      );
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
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.userName}</p>
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
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.createdAt}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '更新时间' : 'Updated At'}
                </Label>
                <p className="text-sm font-medium dark:text-white mt-1">{selectedSession.updatedAt}</p>
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
                  key={message.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-purple-100 dark:bg-purple-900/30"
                    )}>
                      {message.role === 'user' ? (
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium dark:text-white">
                          {message.role === 'user' ? message.userName : 'AI Assistant'}
                        </span>
                        <Badge variant="secondary" className="text-xs font-mono">
                          {message.messageId}
                        </Badge>
                        {message.feedbackType && (
                          <Badge className={cn(
                            "text-xs border-0",
                            message.feedbackType === 'like'
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {message.feedbackType === 'like' ? (
                              <ThumbsUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ThumbsDown className="h-3 w-3 mr-1" />
                            )}
                            {message.feedbackType === 'like' 
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
                        <span>{message.createdAt}</span>
                        {message.tokenUsage && (
                          <span>
                            {language === 'zh-CN' ? 'Token: ' : 'Tokens: '}
                            {message.tokenUsage.totalTokens}
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
                selectedMessage.role === 'user' 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-purple-100 dark:bg-purple-900/30"
              )}>
                {selectedMessage.role === 'user' ? (
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold dark:text-white">
                    {selectedMessage.role === 'user' ? selectedMessage.userName : 'AI Assistant'}
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {selectedMessage.messageId}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    selectedMessage.role === 'user'
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                    "border-0"
                  )}>
                    {selectedMessage.role === 'user' 
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
                      const session = sessions.find(s => s.sessionId === selectedMessage.sessionId);
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
                <p className="text-sm font-medium dark:text-white mt-1">{selectedMessage.createdAt}</p>
              </div>
              {selectedMessage.tokenUsage && (
                <>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '输入Token' : 'Prompt Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.tokenUsage.promptTokens}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '输出Token' : 'Completion Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.tokenUsage.completionTokens}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '总Token' : 'Total Tokens'}
                    </Label>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {selectedMessage.tokenUsage.totalTokens}
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
