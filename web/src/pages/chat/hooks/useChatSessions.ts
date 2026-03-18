import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import Session from '@/services/Session';
import Message from '@/services/Message';
import type { SessionListVo, SessionDetailVo, SessionConfig } from '@/services/SessionTypes';
import type { MessageVo } from '@/services/MessageTypes';
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
  /** 反馈类型：like或dislike */
  feedbackType?: string;
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
  /** 会话配置 */
  config?: SessionConfig;
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
    config: vo.config,
  };
}

function messageVoToMessage(vo: MessageVo): Message {
  const role = vo.role === MessageRoleEnum.USER ? 'user' : 'assistant';
  return {
    id: String(vo.id ?? ''),
    role,
    content: vo.content ?? '',
    timestamp: vo.datetime ? new Date(vo.datetime) : new Date(),
    attachments: vo.attachments?.map((a) => ({
      id: String(a.id ?? ''),
      name: a.name ?? '',
      type: a.type ?? '',
      size: a.size ?? 0,
      url: a.url ?? '',
    })),
    isStreaming: vo.isStreaming,
    feedbackType: vo.feedbackType,
  };
}

const SESSION_PAGE_SIZE = 10;

export function useChatSessions(initialAppId?: string, initialModelId?: string, initialSessionId?: string) {
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
  const initialSessionIdRef = useRef(initialSessionId);
  initialSessionIdRef.current = initialSessionId; // 仅用于首次加载时优先选中，避免 URL 变化触发 loadSessions 重建导致重复请求

  const loadSessions = useCallback(
    async (page: number, append: boolean) => {
      if (sessionsLoadingRef.current && !append) return;
      sessionsLoadingRef.current = true;
      if (append) setSessionsLoadMore(true);
      else setSessionsLoading(true);
      try {
        const res = await Session.getSessionList({
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
            const sid = initialSessionIdRef.current;
            const target = sid
              ? mapped.find((s) => s.sessionId === sid || s.id === sid)
              : null;
            const first = mapped[0];
            if (target) setCurrentSessionId(target.sessionId);
            else if (!sid && first) setCurrentSessionId(first.sessionId);
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

  /** 按 sessionId 内存缓存消息（sessionMessages + loadedMessagesRef），切换会话时优先用缓存，避免重复请求 */
  const loadMessages = useCallback(async (sessionId: string) => {
    if (loadedMessagesRef.current.has(sessionId)) return;
    loadedMessagesRef.current.add(sessionId);
    setMessagesLoading(true);
    try {
      const res = await Message.getMessageList({ sessionId, pageNo: 1, pageSize: 200 });
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

  // 进入对话页后，当前选中的会话需自动加载消息到内容区展示
  useEffect(() => {
    if (!currentSessionId) return;
    loadMessages(currentSessionId);
  }, [currentSessionId, loadMessages]);

  const currentSession = sessions.find((s) => s.sessionId === currentSessionId);
  const currentMessages = currentSessionId ? sessionMessages[currentSessionId] ?? [] : [];

  const createSession = useCallback(
    async (appId: string, modelId?: string, agentId?: string) => {
      if (!appId?.trim()) {
        toast.error('请先选择应用');
        return null;
      }
      try {
        const res = await Session.createSession({
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

  const deletingRef = useRef<Set<string>>(new Set());
  /** 刚删除的会话 id，用于 ensureSessionLoaded 跳过 getSessionDetail，避免删除后 effect 用旧 URL 请求已删会话 */
  const recentlyDeletedRef = useRef<Set<string>>(new Set());

  const deleteSession = useCallback(
    async (sessionId: string) => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const sid = session?.sessionId ?? sessionId;
      if (deletingRef.current.has(sid)) return;
      deletingRef.current.add(sid);
      recentlyDeletedRef.current.add(sid);
      try {
        await Session.deleteSession(sid);
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
      } finally {
        deletingRef.current.delete(sid);
      }
    },
    [sessions, currentSessionId]
  );

  const renameSession = useCallback(
    async (sessionId: string, newTitle: string) => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const sid = session?.sessionId ?? sessionId;
      const trimmed = newTitle.trim();
      if (!trimmed || trimmed === (session?.title ?? '').trim()) return;
      try {
        await Session.updateSession(sid, { title: trimmed });
        setSessions((prev) =>
          prev.map((s) =>
            (s.sessionId === sessionId || s.id === sessionId)
              ? { ...s, title: trimmed, updatedAt: new Date() }
              : s
          )
        );
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
        await Session.starSession(idToUse, { isStarred: nextStarred });
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

  /** 移除最后一条助手消息（用于重新生成前清理） */
  const removeLastAssistantMessage = useCallback((sessionId: string) => {
    setSessionMessages((prev) => {
      const current = prev[sessionId] ?? [];
      const lastIdx = current.length - 1;
      if (lastIdx < 0) return prev;
      const last = current[lastIdx];
      if (last?.role !== 'assistant') return prev;
      return {
        ...prev,
        [sessionId]: current.slice(0, lastIdx),
      };
    });
  }, []);

  /** 更新指定消息内容（用于流式响应、反馈等）；流式生成期间仅更新 sessionMessages，避免频繁更新 sessions 导致侧边栏闪动 */
  const updateMessage = useCallback(
    (sessionId: string, messageId: string, patch: Partial<Pick<Message, 'content' | 'isStreaming' | 'feedbackType'>>) => {
      setSessionMessages((prev) => {
        const current = prev[sessionId] ?? [];
        return {
          ...prev,
          [sessionId]: current.map((m) =>
            m.id === messageId ? { ...m, ...patch } : m
          ),
        };
      });
      // 仅当流式结束或反馈变更时更新 sessions.updatedAt，避免流式期间每 token 都触发侧边栏重渲染
      if (patch.feedbackType != null || patch.isStreaming === false) {
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionId === sessionId ? { ...s, updatedAt: new Date() } : s
          )
        );
      }
    },
    []
  );

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

  /** 更新会话配置（温度、maxTokens 等），持久化到后端 */
  const updateSessionConfig = useCallback(
    async (sessionId: string, config: Partial<SessionConfig>): Promise<boolean> => {
      const session = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      const sid = session?.sessionId ?? sessionId;
      try {
        const mergedConfig: SessionConfig = {
          ...(session?.config ?? {}),
          ...config,
          systemPrompt: (session?.config as any)?.systemPrompt ?? '',
        };
        await Session.updateSession(sid, { config: mergedConfig });
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionId === sessionId || s.id === sessionId
              ? { ...s, config: mergedConfig, updatedAt: new Date() }
              : s
          )
        );
        return true;
      } catch (e) {
        console.error('Update session config failed:', e);
        toast.error('保存配置失败');
        return false;
      }
    },
    [sessions]
  );

  const hasMoreSessions = sessions.length < sessionTotal;

  const refreshSessions = useCallback(() => {
    loadSessions(1, false);
  }, [loadSessions]);

  const clearSessionMessages = useCallback(async (sessionId: string) => {
    try {
      await Message.clearMessages(sessionId);
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

  /** 通过 URL 直接进入会话时，若会话不在列表中则拉取详情并加入列表 */
  const ensureSessionLoaded = useCallback(
    async (sessionId: string): Promise<Session | null> => {
      if (recentlyDeletedRef.current.has(sessionId)) {
        recentlyDeletedRef.current.delete(sessionId);
        return null;
      }
      const existing = sessions.find((s) => s.sessionId === sessionId || s.id === sessionId);
      if (existing) return existing;
      try {
        const res = await Session.getSessionDetail(sessionId);
        const data = (res as any)?.data as SessionDetailVo;
        if (!data) return null;
        const session = voToSession(data);
        setSessions((prev) => {
          const seen = new Set(prev.map((s) => s.sessionId));
          if (seen.has(session.sessionId)) return prev;
          return [session, ...prev].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        });
        setSessionTotal((prev) => Math.max(prev, sessions.length + 1));
        return session;
      } catch (e) {
        console.error('Fetch session detail failed:', e);
        toast.error('会话不存在或已删除');
        return null;
      }
    },
    [sessions]
  );

  /**
   * 对话接口无会话模式下，收到 sessionId 后将会话加入列表并迁移消息
   *
   * @param sessionId 后端返回的会话ID
   * @param pendingKey 临时 key，其下的消息将迁移到 sessionId
   * @param selection 应用/模型/智能体选择信息
   */
  const addSessionFromChat = useCallback(
    (sessionId: string, pendingKey: string, selection: { appId?: string; agentId?: string; modelId?: string }) => {
      const now = new Date();
      const session: Session = {
        id: sessionId,
        sessionId,
        entityId: sessionId,
        title: '新对话',
        appId: selection.appId ?? '',
        agentId: selection.agentId ?? '',
        modelId: selection.modelId ?? '',
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      setSessions((prev) => {
        const seen = new Set(prev.map((s) => s.sessionId));
        if (seen.has(sessionId)) return prev;
        return [session, ...prev].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      });
      setSessionMessages((prev) => {
        const msgs = prev[pendingKey] ?? [];
        const next = { ...prev };
        delete next[pendingKey];
        next[sessionId] = msgs;
        return next;
      });
      setSessionTotal((prev) => prev + 1);
      setCurrentSessionId(sessionId);
      loadedMessagesRef.current.add(sessionId);
    },
    []
  );

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
    setSessionMessages,
    createSession,
    deleteSession,
    renameSession,
    toggleStar,
    selectSession,
    loadMessages,
    appendMessages,
    removeLastAssistantMessage,
    updateMessage,
    updateSessionInList,
    updateSessionConfig,
    refreshSessions,
    clearSessionMessages,
    ensureSessionLoaded,
    addSessionFromChat,
    sessionKeyword,
    setSessionKeyword,
  };
}
