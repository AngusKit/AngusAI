import { useState, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { 
  Activity, 
  Search, 
  Filter,
  MessageSquare,
  Users,
  Brain,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Database,
  FileText,
  X,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  Zap,
  Cpu,
  TrendingDown,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface StatCard {
  title: string;
  value: number;
  trend?: number;
  icon: any;
  color: string;
}

interface Session {
  id: number;
  sessionId: string;
  title: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  userId: number;
  userName: string;
  messageCount: number;
  isStarred: boolean;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
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

interface Message {
  id: number;
  messageId: string;
  sessionId: string;
  sessionTitle: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  userId: number;
  userName: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  feedbackType?: 'like' | 'dislike';
  feedbackComment?: string;
  createdAt: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface Feedback {
  id: number;
  messageId: string;
  sessionId: string;
  sessionTitle: string;
  feedbackType: 'like' | 'dislike';
  feedbackComment?: string;
  userId: number;
  userName: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  messageContent: string;
  createdAt: string;
}

interface ChartDataPoint {
  id: string;
  date: string;
  value: number;
}

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
  
  // Session filters
  const [sessionAppFilter, setSessionAppFilter] = useState('all');
  const [sessionUserFilter, setSessionUserFilter] = useState('all');
  const [sessionAgentFilter, setSessionAgentFilter] = useState('all');
  const [sessionAppSearch, setSessionAppSearch] = useState('');
  const [sessionUserSearch, setSessionUserSearch] = useState('');
  const [sessionAgentSearch, setSessionAgentSearch] = useState('');
  
  // Message filters
  const [messageAppFilter, setMessageAppFilter] = useState('all');
  const [messageUserFilter, setMessageUserFilter] = useState('all');
  const [messageAgentFilter, setMessageAgentFilter] = useState('all');
  const [messageAppSearch, setMessageAppSearch] = useState('');
  const [messageUserSearch, setMessageUserSearch] = useState('');
  const [messageAgentSearch, setMessageAgentSearch] = useState('');
  
  // Feedback filters
  const [feedbackAppFilter, setFeedbackAppFilter] = useState('all');
  const [feedbackUserFilter, setFeedbackUserFilter] = useState('all');
  const [feedbackAgentFilter, setFeedbackAgentFilter] = useState('all');
  const [feedbackSessionFilter, setFeedbackSessionFilter] = useState('all');
  const [feedbackAppSearch, setFeedbackAppSearch] = useState('');
  const [feedbackUserSearch, setFeedbackUserSearch] = useState('');
  const [feedbackAgentSearch, setFeedbackAgentSearch] = useState('');
  const [feedbackSessionSearch, setFeedbackSessionSearch] = useState('');
  
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

  // Mock data - Sessions
  const sessions: Session[] = [
    {
      id: 1,
      sessionId: 'sess_abc123',
      title: language === 'zh-CN' ? '产品咨询对话' : 'Product Inquiry',
      appId: 1,
      appName: applications[0].name,
      agentId: 1,
      agentName: agents[0].name,
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
      appName: applications[0].name,
      agentId: 2,
      agentName: agents[1].name,
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
      appName: applications[1].name,
      agentId: 3,
      agentName: agents[2].name,
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
      appName: applications[0].name,
      agentId: 1,
      agentName: agents[0].name,
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
      appName: applications[0].name,
      agentId: 1,
      agentName: agents[0].name,
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
      appName: applications[0].name,
      agentId: 2,
      agentName: agents[1].name,
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
      appName: applications[0].name,
      agentId: 1,
      agentName: agents[0].name,
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
      appName: applications[0].name,
      agentId: 2,
      agentName: agents[1].name,
      messageContent: language === 'zh-CN' ? '这个问题可能需要您提供更多信息...' : 'This issue may require more information...',
      createdAt: '2024-03-15 09:45:00',
    },
  ];

  // Mock overview statistics
  const overviewStats: OverviewStats = {
    throughput: {
      current: 45.2,
      min: 12.5,
      max: 89.3,
      average: 52.8,
    },
    sessions: {
      active: 156,
      total: 1248,
    },
    messages: {
      active: 892,
      total: 8934,
    },
    users: {
      active: 89,
      total: 342,
    },
    feedback: {
      like: 423,
      dislike: 144,
      total: 567,
    },
    applications: {
      active: 3,
      total: 8,
    },
    agents: {
      active: 5,
      total: 12,
    },
    models: {
      active: 4,
      total: 10,
    },
  };

  // Mock chart data
  const sessionsChartData = useMemo(() => {
    const range = sessionsChartRange;
    if (range === 'year') {
      return [
        { id: 'sess-y-1', date: language === 'zh-CN' ? '1月' : 'Jan', value: 850 },
        { id: 'sess-y-2', date: language === 'zh-CN' ? '2月' : 'Feb', value: 920 },
        { id: 'sess-y-3', date: language === 'zh-CN' ? '3月' : 'Mar', value: 1100 },
        { id: 'sess-y-4', date: language === 'zh-CN' ? '4月' : 'Apr', value: 980 },
        { id: 'sess-y-5', date: language === 'zh-CN' ? '5月' : 'May', value: 1250 },
        { id: 'sess-y-6', date: language === 'zh-CN' ? '6月' : 'Jun', value: 1400 },
        { id: 'sess-y-7', date: language === 'zh-CN' ? '7月' : 'Jul', value: 1350 },
        { id: 'sess-y-8', date: language === 'zh-CN' ? '8月' : 'Aug', value: 1550 },
        { id: 'sess-y-9', date: language === 'zh-CN' ? '9月' : 'Sep', value: 1680 },
        { id: 'sess-y-10', date: language === 'zh-CN' ? '10月' : 'Oct', value: 1820 },
        { id: 'sess-y-11', date: language === 'zh-CN' ? '11月' : 'Nov', value: 1950 },
        { id: 'sess-y-12', date: language === 'zh-CN' ? '12月' : 'Dec', value: 2100 },
      ];
    } else if (range === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        id: `sess-m-${i}`,
        date: `${i + 1}${language === 'zh-CN' ? '日' : ''}`,
        value: Math.floor(Math.random() * 100) + 50,
      }));
    } else {
      return Array.from({ length: 24 }, (_, i) => ({
        id: `sess-d-${i}`,
        date: `${i}:00`,
        value: Math.floor(Math.random() * 50) + 10,
      }));
    }
  }, [sessionsChartRange, language]);

  const messagesChartData = useMemo(() => {
    const range = messagesChartRange;
    if (range === 'year') {
      return [
        { id: 'msg-y-1', date: language === 'zh-CN' ? '1月' : 'Jan', value: 3200 },
        { id: 'msg-y-2', date: language === 'zh-CN' ? '2月' : 'Feb', value: 3800 },
        { id: 'msg-y-3', date: language === 'zh-CN' ? '3月' : 'Mar', value: 4500 },
        { id: 'msg-y-4', date: language === 'zh-CN' ? '4月' : 'Apr', value: 4200 },
        { id: 'msg-y-5', date: language === 'zh-CN' ? '5月' : 'May', value: 5100 },
        { id: 'msg-y-6', date: language === 'zh-CN' ? '6月' : 'Jun', value: 5800 },
        { id: 'msg-y-7', date: language === 'zh-CN' ? '7月' : 'Jul', value: 5500 },
        { id: 'msg-y-8', date: language === 'zh-CN' ? '8月' : 'Aug', value: 6300 },
        { id: 'msg-y-9', date: language === 'zh-CN' ? '9月' : 'Sep', value: 6900 },
        { id: 'msg-y-10', date: language === 'zh-CN' ? '10月' : 'Oct', value: 7400 },
        { id: 'msg-y-11', date: language === 'zh-CN' ? '11月' : 'Nov', value: 8100 },
        { id: 'msg-y-12', date: language === 'zh-CN' ? '12月' : 'Dec', value: 8934 },
      ];
    } else if (range === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        id: `msg-m-${i}`,
        date: `${i + 1}${language === 'zh-CN' ? '日' : ''}`,
        value: Math.floor(Math.random() * 400) + 200,
      }));
    } else {
      return Array.from({ length: 24 }, (_, i) => ({
        id: `msg-d-${i}`,
        date: `${i}:00`,
        value: Math.floor(Math.random() * 200) + 50,
      }));
    }
  }, [messagesChartRange, language]);

  const feedbackChartData = useMemo(() => {
    const range = feedbackChartRange;
    if (range === 'year') {
      return [
        { id: 'fb-y-1', date: language === 'zh-CN' ? '1月' : 'Jan', value: 25 },
        { id: 'fb-y-2', date: language === 'zh-CN' ? '2月' : 'Feb', value: 32 },
        { id: 'fb-y-3', date: language === 'zh-CN' ? '3月' : 'Mar', value: 45 },
        { id: 'fb-y-4', date: language === 'zh-CN' ? '4月' : 'Apr', value: 38 },
        { id: 'fb-y-5', date: language === 'zh-CN' ? '5月' : 'May', value: 52 },
        { id: 'fb-y-6', date: language === 'zh-CN' ? '6月' : 'Jun', value: 61 },
        { id: 'fb-y-7', date: language === 'zh-CN' ? '7月' : 'Jul', value: 58 },
        { id: 'fb-y-8', date: language === 'zh-CN' ? '8月' : 'Aug', value: 68 },
        { id: 'fb-y-9', date: language === 'zh-CN' ? '9月' : 'Sep', value: 75 },
        { id: 'fb-y-10', date: language === 'zh-CN' ? '10月' : 'Oct', value: 82 },
        { id: 'fb-y-11', date: language === 'zh-CN' ? '11月' : 'Nov', value: 89 },
        { id: 'fb-y-12', date: language === 'zh-CN' ? '12月' : 'Dec', value: 95 },
      ];
    } else if (range === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        id: `fb-m-${i}`,
        date: `${i + 1}${language === 'zh-CN' ? '日' : ''}`,
        value: Math.floor(Math.random() * 20) + 5,
      }));
    } else {
      return Array.from({ length: 24 }, (_, i) => ({
        id: `fb-d-${i}`,
        date: `${i}:00`,
        value: Math.floor(Math.random() * 10) + 1,
      }));
    }
  }, [feedbackChartRange, language]);

  // Filter functions
  const getFilteredSessions = () => {
    return sessions.filter(session => {
      if (sessionAppFilter !== 'all' && session.appId !== parseInt(sessionAppFilter)) return false;
      if (sessionUserFilter !== 'all' && session.userId !== parseInt(sessionUserFilter)) return false;
      if (sessionAgentFilter !== 'all' && session.agentId !== parseInt(sessionAgentFilter)) return false;
      return true;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter(message => {
      if (messageAppFilter !== 'all' && message.appId !== parseInt(messageAppFilter)) return false;
      if (messageUserFilter !== 'all' && message.userId !== parseInt(messageUserFilter)) return false;
      if (messageAgentFilter !== 'all' && message.agentId !== parseInt(messageAgentFilter)) return false;
      return true;
    });
  };

  const getFilteredFeedbacks = () => {
    return feedbacks.filter(feedback => {
      if (feedbackAppFilter !== 'all' && feedback.appId !== parseInt(feedbackAppFilter)) return false;
      if (feedbackUserFilter !== 'all' && feedback.userId !== parseInt(feedbackUserFilter)) return false;
      if (feedbackAgentFilter !== 'all' && feedback.agentId !== parseInt(feedbackAgentFilter)) return false;
      if (feedbackSessionFilter !== 'all' && feedback.sessionId !== feedbackSessionFilter) return false;
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
          {/* Stats Cards */}
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
                    {overviewStats.throughput.current}
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
                      <p className="text-sm font-semibold dark:text-gray-300">{overviewStats.throughput.min}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {language === 'zh-CN' ? '平均' : 'Avg'}
                      </p>
                      <p className="text-sm font-semibold dark:text-gray-300">{overviewStats.throughput.average}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {language === 'zh-CN' ? '最大' : 'Max'}
                      </p>
                      <p className="text-sm font-semibold dark:text-gray-300">{overviewStats.throughput.max}</p>
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
                    {overviewStats.sessions.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.sessions.total}
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
                    {overviewStats.messages.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.messages.total}
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
                    {overviewStats.users.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.users.total}
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
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{overviewStats.feedback.like}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{overviewStats.feedback.dislike}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? `总计: ${overviewStats.feedback.total} 条反馈` : `Total: ${overviewStats.feedback.total} feedbacks`}
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
                    {overviewStats.applications.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.applications.total}
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
                    {overviewStats.agents.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.agents.total}
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
                    {overviewStats.models.active}
                  </span>
                  <span className="text-xl text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                    {overviewStats.models.total}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh-CN' ? '对话中 / 总模型' : 'Active / Total Models'}
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          {/* Chart */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold dark:text-white">
                  {language === 'zh-CN' ? '会话趋势' : 'Session Trends'}
                </h3>
                
                {/* Time Range and Date Selectors */}
                <div className="flex items-center gap-3">
                  <Select value={sessionsChartRange} onValueChange={(v: any) => setSessionsChartRange(v)}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="year">{language === 'zh-CN' ? '按年' : 'Yearly'}</SelectItem>
                      <SelectItem value="month">{language === 'zh-CN' ? '按月' : 'Monthly'}</SelectItem>
                      <SelectItem value="day">{language === 'zh-CN' ? '按天' : 'Daily'}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Year Selector - always shown */}
                  <Select value={sessionsSelectedYear} onValueChange={setSessionsSelectedYear}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue placeholder={language === 'zh-CN' ? '年份' : 'Year'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Month Selector - shown for month and day */}
                  {(sessionsChartRange === 'month' || sessionsChartRange === 'day') && (
                    <Select value={sessionsSelectedMonth} onValueChange={setSessionsSelectedMonth}>
                      <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                        <SelectValue placeholder={language === 'zh-CN' ? '月份' : 'Month'} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {language === 'zh-CN' ? `${month}月` : new Date(2000, month - 1).toLocaleString('en', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* Day Selector - only shown for day */}
                  {sessionsChartRange === 'day' && (
                    <Select value={sessionsSelectedDay} onValueChange={setSessionsSelectedDay}>
                      <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                        <SelectValue placeholder={language === 'zh-CN' ? '日期' : 'Day'} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <SelectItem key={day} value={day.toString()}>
                            {language === 'zh-CN' ? `${day}日` : day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300} key={`sessions-container-${sessionsChartRange}-${language}`}>
              <LineChart data={sessionsChartData}>
                <CartesianGrid key="sessions-grid" strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis 
                  key="sessions-xaxis"
                  dataKey="date" 
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <YAxis 
                  key="sessions-yaxis"
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <Tooltip 
                  key="sessions-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelClassName="dark:text-white"
                />
                <Legend key="sessions-legend" />
                <Line 
                  key="sessions-line"
                  type="monotone" 
                  dataKey="value" 
                  name={language === 'zh-CN' ? '会话数' : 'Sessions'}
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Filters */}
          <div className="flex items-center justify-end gap-3">
            {/* App Filter */}
            <Select value={sessionAppFilter} onValueChange={setSessionAppFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '应用筛选' : 'Application Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索应用...' : 'Search app...'}
                    value={sessionAppSearch}
                    onChange={(e) => setSessionAppSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部应用' : 'All Applications'}
                </SelectItem>
                {applications
                  .filter(app => app.name.toLowerCase().includes(sessionAppSearch.toLowerCase()))
                  .map(app => (
                    <SelectItem key={app.id} value={app.id.toString()}>
                      {app.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={sessionUserFilter} onValueChange={setSessionUserFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '用户筛选' : 'User Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索用户...' : 'Search user...'}
                    value={sessionUserSearch}
                    onChange={(e) => setSessionUserSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部用户' : 'All Users'}
                </SelectItem>
                {users
                  .filter(user => user.name.toLowerCase().includes(sessionUserSearch.toLowerCase()))
                  .map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* Agent Filter */}
            <Select value={sessionAgentFilter} onValueChange={setSessionAgentFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '智能体筛选' : 'Agent Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索智能体...' : 'Search agent...'}
                    value={sessionAgentSearch}
                    onChange={(e) => setSessionAgentSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部智能体' : 'All Agents'}
                </SelectItem>
                {agents
                  .filter(agent => agent.name.toLowerCase().includes(sessionAgentSearch.toLowerCase()))
                  .map(agent => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Sessions List */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
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
                  {getFilteredSessions().map((session) => (
                    <tr 
                      key={session.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewSessionDetail(session)}
                          className="text-left"
                        >
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
                      <td className="px-4 py-3 text-sm dark:text-gray-300">{session.appName}</td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">{session.userName}</td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">{session.agentName}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{session.messageCount}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {session.createdAt}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSessionDetail(session)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
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
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          {/* Chart */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {language === 'zh-CN' ? '消息趋势' : 'Message Trends'}
              </h3>
              
              {/* Time Range and Date Selectors */}
              <div className="flex items-center gap-3">
                <Select value={messagesChartRange} onValueChange={(v: any) => setMessagesChartRange(v)}>
                  <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="year">{language === 'zh-CN' ? '按年' : 'Yearly'}</SelectItem>
                    <SelectItem value="month">{language === 'zh-CN' ? '按月' : 'Monthly'}</SelectItem>
                    <SelectItem value="day">{language === 'zh-CN' ? '按天' : 'Daily'}</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Year Selector - always shown */}
                <Select value={messagesSelectedYear} onValueChange={setMessagesSelectedYear}>
                  <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                    <SelectValue placeholder={language === 'zh-CN' ? '年份' : 'Year'} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Month Selector - shown for month and day */}
                {(messagesChartRange === 'month' || messagesChartRange === 'day') && (
                  <Select value={messagesSelectedMonth} onValueChange={setMessagesSelectedMonth}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue placeholder={language === 'zh-CN' ? '月份' : 'Month'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                          {language === 'zh-CN' ? `${month}月` : new Date(2000, month - 1).toLocaleString('en', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Day Selector - only shown for day */}
                {messagesChartRange === 'day' && (
                  <Select value={messagesSelectedDay} onValueChange={setMessagesSelectedDay}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue placeholder={language === 'zh-CN' ? '日期' : 'Day'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {language === 'zh-CN' ? `${day}日` : day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300} key={`messages-container-${messagesChartRange}-${language}`}>
              <LineChart data={messagesChartData}>
                <CartesianGrid key="messages-grid" strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis 
                  key="messages-xaxis"
                  dataKey="date" 
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <YAxis 
                  key="messages-yaxis"
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <Tooltip 
                  key="messages-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelClassName="dark:text-white"
                />
                <Legend key="messages-legend" />
                <Line 
                  key="messages-line"
                  type="monotone" 
                  dataKey="value" 
                  name={language === 'zh-CN' ? '消息数' : 'Messages'}
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Filters */}
          <div className="flex items-center justify-end gap-3">
            {/* App Filter */}
            <Select value={messageAppFilter} onValueChange={setMessageAppFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '应用筛选' : 'Application Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索应用...' : 'Search app...'}
                    value={messageAppSearch}
                    onChange={(e) => setMessageAppSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部应用' : 'All Applications'}
                </SelectItem>
                {applications
                  .filter(app => app.name.toLowerCase().includes(messageAppSearch.toLowerCase()))
                  .map(app => (
                    <SelectItem key={app.id} value={app.id.toString()}>
                      {app.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={messageUserFilter} onValueChange={setMessageUserFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '用户筛选' : 'User Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索用户...' : 'Search user...'}
                    value={messageUserSearch}
                    onChange={(e) => setMessageUserSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部用户' : 'All Users'}
                </SelectItem>
                {users
                  .filter(user => user.name.toLowerCase().includes(messageUserSearch.toLowerCase()))
                  .map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* Agent Filter */}
            <Select value={messageAgentFilter} onValueChange={setMessageAgentFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '智能体筛选' : 'Agent Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索智能体...' : 'Search agent...'}
                    value={messageAgentSearch}
                    onChange={(e) => setMessageAgentSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部智能体' : 'All Agents'}
                </SelectItem>
                {agents
                  .filter(agent => agent.name.toLowerCase().includes(messageAgentSearch.toLowerCase()))
                  .map(agent => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
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
                  {getFilteredMessages().map((message) => (
                    <tr 
                      key={message.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                          {message.messageId}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const session = sessions.find(s => s.sessionId === message.sessionId);
                            if (session) handleViewSessionDetail(session);
                          }}
                          className="text-left"
                        >
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {message.sessionTitle}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {message.sessionId}
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn(
                          "border-0",
                          message.role === 'user'
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        )}>
                          {message.role === 'user' 
                            ? (language === 'zh-CN' ? '用户' : 'User')
                            : (language === 'zh-CN' ? '助手' : 'Assistant')
                          }
                        </Badge>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {message.content}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {message.feedbackType ? (
                          <Badge className={cn(
                            "border-0",
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
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {message.createdAt}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewMessageDetail(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMessage(message.id)}
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
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {/* Chart */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {language === 'zh-CN' ? '反馈趋势' : 'Feedback Trends'}
              </h3>
              
              {/* Time Range and Date Selectors */}
              <div className="flex items-center gap-3">
                <Select value={feedbackChartRange} onValueChange={(v: any) => setFeedbackChartRange(v)}>
                  <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="year">{language === 'zh-CN' ? '按年' : 'Yearly'}</SelectItem>
                    <SelectItem value="month">{language === 'zh-CN' ? '按月' : 'Monthly'}</SelectItem>
                    <SelectItem value="day">{language === 'zh-CN' ? '按天' : 'Daily'}</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Year Selector - always shown */}
                <Select value={feedbackSelectedYear} onValueChange={setFeedbackSelectedYear}>
                  <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                    <SelectValue placeholder={language === 'zh-CN' ? '年份' : 'Year'} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Month Selector - shown for month and day */}
                {(feedbackChartRange === 'month' || feedbackChartRange === 'day') && (
                  <Select value={feedbackSelectedMonth} onValueChange={setFeedbackSelectedMonth}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue placeholder={language === 'zh-CN' ? '月份' : 'Month'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                          {language === 'zh-CN' ? `${month}月` : new Date(2000, month - 1).toLocaleString('en', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Day Selector - only shown for day */}
                {feedbackChartRange === 'day' && (
                  <Select value={feedbackSelectedDay} onValueChange={setFeedbackSelectedDay}>
                    <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-gray-700">
                      <SelectValue placeholder={language === 'zh-CN' ? '日期' : 'Day'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {language === 'zh-CN' ? `${day}日` : day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300} key={`feedback-container-${feedbackChartRange}-${language}`}>
              <LineChart data={feedbackChartData}>
                <CartesianGrid key="feedback-grid" strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis 
                  key="feedback-xaxis"
                  dataKey="date" 
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <YAxis 
                  key="feedback-yaxis"
                  className="text-xs dark:text-gray-400"
                  stroke="currentColor"
                />
                <Tooltip 
                  key="feedback-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelClassName="dark:text-white"
                />
                <Legend key="feedback-legend" />
                <Line 
                  key="feedback-line"
                  type="monotone" 
                  dataKey="value" 
                  name={language === 'zh-CN' ? '反馈数' : 'Feedbacks'}
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Filters */}
          <div className="flex items-center justify-end gap-3">
            {/* App Filter */}
            <Select value={feedbackAppFilter} onValueChange={setFeedbackAppFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '应用筛选' : 'Application Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索应用...' : 'Search app...'}
                    value={feedbackAppSearch}
                    onChange={(e) => setFeedbackAppSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部应用' : 'All Applications'}
                </SelectItem>
                {applications
                  .filter(app => app.name.toLowerCase().includes(feedbackAppSearch.toLowerCase()))
                  .map(app => (
                    <SelectItem key={app.id} value={app.id.toString()}>
                      {app.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={feedbackUserFilter} onValueChange={setFeedbackUserFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '用户筛选' : 'User Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索用户...' : 'Search user...'}
                    value={feedbackUserSearch}
                    onChange={(e) => setFeedbackUserSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部用户' : 'All Users'}
                </SelectItem>
                {users
                  .filter(user => user.name.toLowerCase().includes(feedbackUserSearch.toLowerCase()))
                  .map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* Agent Filter */}
            <Select value={feedbackAgentFilter} onValueChange={setFeedbackAgentFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '智能体筛选' : 'Agent Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索智能体...' : 'Search agent...'}
                    value={feedbackAgentSearch}
                    onChange={(e) => setFeedbackAgentSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部智能体' : 'All Agents'}
                </SelectItem>
                {agents
                  .filter(agent => agent.name.toLowerCase().includes(feedbackAgentSearch.toLowerCase()))
                  .map(agent => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* Session Filter */}
            <Select value={feedbackSessionFilter} onValueChange={setFeedbackSessionFilter}>
              <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder={language === 'zh-CN' ? '会话筛选' : 'Session Filter'} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2">
                  <Input
                    placeholder={language === 'zh-CN' ? '搜索会话...' : 'Search session...'}
                    value={feedbackSessionSearch}
                    onChange={(e) => setFeedbackSessionSearch(e.target.value)}
                    className="mb-2 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <SelectItem value="all">
                  {language === 'zh-CN' ? '全部会话' : 'All Sessions'}
                </SelectItem>
                {sessions
                  .filter(session => 
                    session.title.toLowerCase().includes(feedbackSessionSearch.toLowerCase()) ||
                    session.sessionId.toLowerCase().includes(feedbackSessionSearch.toLowerCase())
                  )
                  .map(session => (
                    <SelectItem key={session.sessionId} value={session.sessionId}>
                      {session.title}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Feedbacks List */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
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
                  {getFilteredFeedbacks().map((feedback) => (
                    <tr 
                      key={feedback.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const message = messages.find(m => m.messageId === feedback.messageId);
                            if (message) handleViewMessageDetail(message);
                          }}
                          className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          {feedback.messageId}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const session = sessions.find(s => s.sessionId === feedback.sessionId);
                            if (session) handleViewSessionDetail(session);
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
                        <Badge className={cn(
                          "border-0",
                          feedback.feedbackType === 'like'
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {feedback.feedbackType === 'like' ? (
                            <ThumbsUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ThumbsDown className="h-3 w-3 mr-1" />
                          )}
                          {feedback.feedbackType === 'like' 
                            ? (language === 'zh-CN' ? '好评' : 'Like')
                            : (language === 'zh-CN' ? '差评' : 'Dislike')
                          }
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">
                        {feedback.userName}
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {feedback.feedbackComment || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {feedback.createdAt}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFeedback(feedback.id)}
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
          </Card>
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
