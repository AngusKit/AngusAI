import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import Chat from '@/services/Chat';
import type { SessionListVo, SessionDetailVo, MessageVo } from '@/services/ChatTypes';
import { MessageRoleEnum } from '@/enums/enums';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  isStreaming?: boolean;
}

export interface Session {
  /** UI 用主键，与 sessionId 相同，便于 ChatSidebar 等使用 */
  id: string;
  /** 会话 UUID，用于消息 API、star API */
  sessionId: string;
  /** 实体 ID，用于 delete/update API */
  entityId: string;
  title: string;
  appId: string;
  agentId: string;
  modelId: string;
  messages: Message[];
  messageCount?: number;
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
}

function voToSession(vo: SessionListVo | SessionDetailVo): Session {
  const sid = vo.sessionId ?? vo.id ?? '';
  const entityId = String(vo.id ?? sid);
  const created = (vo as any).createdDate || (vo as any).createdAt ? new Date((vo as any).createdDate ?? (vo as any).createdAt ?? '') : new Date();
  const updated = (vo as any).modifiedDate || (vo as any).updatedAt ? new Date((vo as any).modifiedDate ?? (vo as any).updatedAt ?? '') : new Date();
  return {
    id: String(sid),
    sessionId: String(sid),
    entityId,
    title: vo.title ?? '新对话',
    appId: vo.appId != null ? String(vo.appId) : '',
    agentId: vo.agentId != null ? String(vo.agentId) : '',
    modelId: vo.modelId != null ? String(vo.modelId) : '',
    messages: [],
    messageCount: vo.messageCount,
    createdAt: created,
    updatedAt: updated,
    isStarred: vo.isStarred,
  };
}

function messageVoToMessage(vo: MessageVo): Message {
  const role = vo.role === MessageRoleEnum.USER ? 'user' : 'assistant';
  return {
    id: vo.id ?? '',
    role,
    content: vo.content ?? '',
    timestamp: vo.datetime ? new Date(vo.datetime) : new Date(),
    attachments: vo.attachments?.map((a) => ({
      id: a.id ?? '',
      name: a.name ?? '',
      type: a.type ?? '',
      size: a.size ?? 0,
      url: a.url ?? '',
    })),
    isStreaming: vo.isStreaming,
  };
}

const SESSION_PAGE_SIZE = 10;

export function useChatSessions(initialAppId?: string, initialModelId?: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessionMessages, setSessionMessages] = useState<Record<string, Message[]>>({});
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sessionKeyword, setSessionKeyword] = useState('');
  const debouncedSessionKeyword = useDebounce(sessionKeyword, 500);
  const loadedMessagesRef = useRef<Set<string>>(new Set());

  const [sessionPage, setSessionPage] = useState(1);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionsLoadMore, setSessionsLoadMore] = useState(false);
  const sessionsLoadingRef = useRef(false);
  const initialSelectedRef = useRef(false);

  const loadSessions = useCallback(
    async (page: number, append: boolean) => {
      if (sessionsLoadingRef.current && !append) return;
      sessionsLoadingRef.current = true;
      if (append) setSessionsLoadMore(true);
      else setSessionsLoading(true);
      try {
        const res = await Chat.getSessionList({
          pageNo: page,
          pageSize: SESSION_PAGE_SIZE,
          keyword: debouncedSessionKeyword.trim() || undefined,
        } as any);
        const data = (res as any)?.data;
        const list: SessionListVo[] = data?.list ?? [];
        const total = Number(data?.total ?? list.length) || list.length;
        const mapped = list.map(voToSession).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        setSessionTotal(total);
        if (append) {
          setSessions(prev => {
            const seen = new Set(prev.map(s => s.sessionId));
            const merged = [...prev, ...mapped.filter(s => !seen.has(s.sessionId))];
            return merged.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          });
        } else {
          setSessions(mapped);
          setSessionPage(1);
          if (mapped.length > 0 && !initialSelectedRef.current) {
            initialSelectedRef.current = true;
            const first = mapped[0];
            if (first) setCurrentSessionId(first.sessionId);
          }
        }
        setSessionPage(page);
      } catch (e) {
        console.error('Load sessions failed:', e);
        toast.error('加载会话列表失败');
      } finally {
        sessionsLoadingRef.current = false;
        setSessionsLoading(false);
        setSessionsLoadMore(false);
      }
    },
    [debouncedSessionKeyword]
  );

  const loadMoreSessions = useCallback(() => {
    const totalLoaded = sessions.length;
    if (sessionsLoadMore || sessionsLoading || totalLoaded >= sessionTotal) return;
    loadSessions(sessionPage + 1, true);
  }, [sessions.length, sessionTotal, sessionPage, sessionsLoadMore, sessionsLoading, loadSessions]);

  const loadMessages = useCallback(async (sessionId: string) => {
    if (loadedMessagesRef.current.has(sessionId)) return;
    loadedMessagesRef.current.add(sessionId);
    setMessagesLoading(true);
    try {
      const res = await Chat.getMessageHistory(sessionId, { pageNo: 1, pageSize: 100 });
      const data = (res as any)?.data;
      const list: MessageVo[] = data?.list ?? [];
      const msgs = list.map(messageVoToMessage);
      setSessionMessages((prev) => ({ ...prev, [sessionId]: msgs }));
    } catch (e) {
      loadedMessagesRef.current.delete(sessionId);
      console.error('Load messages failed:', e);
      toast.error('加载消息历史失败');
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions(1, false);
  }, [loadSessions]);

  const currentSession = sessions.find((s) => s.sessionId === currentSessionId);
  const currentMessages = currentSessionId ? sessionMessages[currentSessionId] ?? [] : [];

  const createSession = useCallback(
    async (appId: string, modelId?: string, agentId?: string) => {
      if (!appId?.trim()) {
        toast.error('请先选择应用');
        return null;
      }
      try {
        const res = await Chat.createSession({
          appId,
          modelId: modelId?.trim() || undefined,
          agentId: agentId?.trim() || undefined,
          title: '新对话',
        });
        const data = (res as any)?.data as SessionDetailVo;
        if (!data) {
          toast.error('创建会话失败');
          return null;
        }
        const session = voToSession(data);
        setSessions((prev) => [session, ...prev]);
        setSessionTotal((prev) => Number(prev) + 1);
        setCurrentSessionId(session.sessionId);
        loadedMessagesRef.current.add(session.sessionId);
        setSessionMessages((prev) => ({ ...prev, [session.sessionId]: [] }));
        toast.success('已创建新对话');
        return session;
      } catch (e) {
        console.error('Create session failed:', e);
        toast.error('创建会话失败');
        return null;
      }
    },
    []
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const sid = session?.sessionId ?? sessionId;
      try {
        await Chat.deleteSession(sid);
        setSessions((prev) => prev.filter((s) => s.sessionId !== sid && s.id !== sid));
        if (currentSessionId === sid) {
          const remaining = sessions.filter((s) => s.sessionId !== sid);
          setCurrentSessionId(remaining[0]?.sessionId ?? '');
        }
        setSessionTotal((prev) => Math.max(0, Number(prev) - 1));
        loadedMessagesRef.current.delete(sid);
        setSessionMessages((prev) => {
          const next = { ...prev };
          delete next[sid];
          return next;
        });
        toast.success('对话已删除');
      } catch (e) {
        console.error('Delete session failed:', e);
        toast.error('删除会话失败');
      }
    },
    [sessions, currentSessionId]
  );

  const renameSession = useCallback(
    async (sessionId: string, newTitle: string) => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const sid = session?.sessionId ?? sessionId;
      try {
        await Chat.updateSession(sid, { title: newTitle });
        setSessions((prev) =>
          prev.map((s) =>
            (s.sessionId === sessionId || s.id === sessionId)
              ? { ...s, title: newTitle, updatedAt: new Date() }
              : s
          )
        );
        toast.success('对话已重命名');
      } catch (e) {
        console.error('Rename session failed:', e);
        toast.error('重命名失败');
      }
    },
    [sessions]
  );

  const toggleStar = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const idToUse = session?.sessionId ?? sessionId;
      const nextStarred = !session?.isStarred;
      try {
        await Chat.starSession(idToUse, { isStarred: nextStarred });
        setSessions((prev) =>
          prev.map((s) =>
            (s.sessionId === sessionId || s.id === sessionId)
              ? { ...s, isStarred: nextStarred, updatedAt: new Date() }
              : s
          )
        );
        toast.success(nextStarred ? '已收藏' : '已取消收藏');
      } catch (e) {
        console.error('Star session failed:', e);
        toast.error('操作失败');
      }
    },
    [sessions]
  );

  const selectSession = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId);
      loadMessages(sessionId);
    },
    [loadMessages]
  );

  const appendMessages = useCallback((sessionId: string, newMessages: Message[]) => {
    setSessionMessages((prev) => {
      const current = prev[sessionId] ?? [];
      return { ...prev, [sessionId]: [...current, ...newMessages] };
    });
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === sessionId ? { ...s, updatedAt: new Date() } : s
      )
    );
  }, []);

  const updateSessionInList = useCallback(
    (sessionId: string, patch: Partial<Pick<Session, 'appId' | 'agentId' | 'modelId'>>) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId ? { ...s, ...patch, updatedAt: new Date() } : s
        )
      );
    },
    []
  );

  const hasMoreSessions = sessions.length < sessionTotal;

  const refreshSessions = useCallback(() => {
    loadSessions(1, false);
  }, [loadSessions]);

  const clearSessionMessages = useCallback(async (sessionId: string) => {
    try {
      await Chat.clearMessages(sessionId);
      setSessionMessages((prev) => ({ ...prev, [sessionId]: [] }));
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sessionId ? { ...s, messageCount: 0, updatedAt: new Date() } : s))
      );
      toast.success('对话已清空');
    } catch (e) {
      console.error('Clear messages failed:', e);
      toast.error('清空对话失败');
    }
  }, []);

  return {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    sessionMessages,
    sessionsLoading,
    messagesLoading,
    sessionsLoadMore,
    hasMoreSessions,
    loadMoreSessions,
    sessionTotal,
    setCurrentSessionId,
    createSession,
    deleteSession,
    renameSession,
    toggleStar,
    selectSession,
    loadMessages,
    appendMessages,
    updateSessionInList,
    refreshSessions,
    clearSessionMessages,
    sessionKeyword,
    setSessionKeyword,
  };
}
