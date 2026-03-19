import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { useTheme } from '@/components/ThemeProvider.tsx';
import { toast } from 'sonner';
import { ChatSidebar } from './components/ChatSidebar.tsx';
import { ChatMainArea } from './components/ChatMainArea.tsx';
import { useChatSessions, type Message } from './hooks/useChatSessions';
import { PromptLibraryDialog } from './components/PromptLibraryDialog.tsx';
import { type ChatSwitcherSelection } from './components/ChatSwitcher.tsx';
import { clearChatSwitcherCacheForSession } from './hooks/useChatSwitcher.ts';
import { SettingsDialog } from './components/SettingsDialog.tsx';
import { MarkdownThemeLocaleSync } from './components/MarkdownThemeLocaleSync.tsx';
import { ThemeDialog, CHAT_TEMPLATES, type TemplateType } from './components/ThemeDialog.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import type { SessionConfig } from '@/services/SessionTypes';
import {
  DEFAULT_CHAT_SETTINGS,
  DEFAULT_SESSION_TITLE,
  DEFAULT_TIMEOUT_MS,
  MAX_CONCURRENT_CHATS,
  truncateForTitle,
} from './constants';
import SessionApi from '@/services/Session';
import MessageApi from '@/services/Message';
import { MarkdownProvider } from '@xcan-cloud/markdown';
import '@xcan-cloud/markdown/styles';

interface ChatProps {
  content?: string;
  onBack?: () => void;
}

export function Chat({ content = '', onBack }: ChatProps = {}) {
  const { language } = useLanguage();
  const { theme: appTheme } = useTheme();
  const navigate = useNavigate();
  const { sessionId: sessionIdFromUrl } = useParams<{ sessionId?: string }>();
  const {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    messagesLoading,
    sessionsLoading,
    sessionsLoadMore,
    hasMoreSessions,
    loadMoreSessions,
    sessionTotal,
    createSession,
    deleteSession,
    renameSession,
    toggleStar,
    selectSession,
    ensureSessionLoaded,
    addSessionFromChat,
    sessionMessages,
    appendMessages,
    removeLastAssistantMessage,
    updateMessage,
    updateSessionInList,
    updateSessionConfig,
    clearSessionMessages,
    setSessionMessages,
    setCurrentSessionId,
    sessionKeyword,
    setSessionKeyword,
  } = useChatSessions(undefined, undefined, sessionIdFromUrl);
  const [sessionSelections, setSessionSelections] = useState<Record<string, ChatSwitcherSelection>>({});
  const defaultContent = content || sessionStorage.getItem('chatContent') || '';
  sessionStorage.removeItem('chatContent');
  const [isRecording, setIsRecording] = useState(false);
  const inputBarRef = useRef<{ insertText: (text: string) => void; focus: () => void } | null>(null);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-blue');
  const isComposingRef = useRef(false);
  const lastCompositionEndRef = useRef(0);
  const scrollAfterSendRef = useRef(false);
  const lastDeleteRef = useRef<{ id: string; t: number }>({ id: '', t: 0 });

  const handleBack = () => {
    onBack ? onBack() : navigate('/dashboard');
  };

  // Settings state：切换会话时从 currentSession.config 同步，保存时调用 updateSessionConfig
  const [settings, setSettings] = useState<SessionConfig>(DEFAULT_CHAT_SETTINGS);
  useEffect(() => {
    if (!currentSessionId) return;
    const c = currentSession?.config;
    setSettings({
      ...DEFAULT_CHAT_SETTINGS,
      temperature: c?.temperature ?? DEFAULT_CHAT_SETTINGS.temperature,
      maxTokens: c?.maxTokens ?? DEFAULT_CHAT_SETTINGS.maxTokens,
      topP: c?.topP ?? DEFAULT_CHAT_SETTINGS.topP,
      frequencyPenalty: c?.frequencyPenalty ?? DEFAULT_CHAT_SETTINGS.frequencyPenalty,
      presencePenalty: c?.presencePenalty ?? DEFAULT_CHAT_SETTINGS.presencePenalty,
      timeoutMs: c?.timeoutMs ?? DEFAULT_CHAT_SETTINGS.timeoutMs,
    });
  }, [currentSessionId, currentSession?.config]);

  const selectedTemplateObj = CHAT_TEMPLATES.find(t => t.id === selectedTemplate) || CHAT_TEMPLATES[0];

  // 用 ref 存储最新回调，避免 ensureSessionLoaded/selectSession 变化导致 effect 反复执行
  const ensureSessionLoadedRef = useRef(ensureSessionLoaded);
  const selectSessionRef = useRef(selectSession);
  ensureSessionLoadedRef.current = ensureSessionLoaded;
  selectSessionRef.current = selectSession;

  // URL -> state: 根据 URL 中的 sessionId 加载并选中会话
  useEffect(() => {
    if (!sessionIdFromUrl || sessionIdFromUrl === currentSessionId) return;
    let cancelled = false;
    ensureSessionLoadedRef.current(sessionIdFromUrl).then((session) => {
      if (cancelled) return;
      if (session) selectSessionRef.current(session.sessionId);
      else navigate('/chat', { replace: true });
    });
    return () => { cancelled = true; };
  }, [sessionIdFromUrl, currentSessionId, navigate]);

  // State -> URL: 仅当有选中会话且 URL 无 sessionId 时同步（避免覆盖点击切换时的 navigate）
  useEffect(() => {
    if (!currentSessionId) return;
    if (sessionIdFromUrl) return; // URL 已有 sessionId，可能正在从 URL 同步，不覆盖
    navigate(`/chat/${currentSessionId}`, { replace: true });
  }, [currentSessionId, sessionIdFromUrl, navigate]);

  const handleSessionSelect = useCallback((sessionId: string) => {
    selectSession(sessionId);
    navigate(`/chat/${sessionId}`);
  }, [selectSession, navigate]);

  // 统计正在流式生成的会话数（支持多会话并发）
  const streamingSessionCount = Object.values(sessionMessages).filter((msgs) =>
    (msgs ?? []).some((m) => m.isStreaming)
  ).length;
  // 最大并发数：优先从当前会话的应用配置读取
  const maxConcurrentChats =
    (sessionSelections[currentSessionId ?? ''] ?? { app: undefined })?.app?.features?.maxConcurrentChats ??
    MAX_CONCURRENT_CHATS;

  const handleSendMessage = async (userContent: string, files: File[]) => {
    if (!userContent.trim() && files.length === 0) return;
    // 当前会话已有流式消息时不再发送
    if (currentMessages.some((m) => m.isStreaming)) {
      toast.error('请等待当前消息发送完成');
      return;
    }
    // 达到最大并发数时不再发送
    if (streamingSessionCount >= maxConcurrentChats) {
      toast.error(`最多同时进行 ${maxConcurrentChats} 个对话，请等待其他对话完成`);
      return;
    }

    const hasSession = !!currentSessionId;
    const appId = chatSelection.appId ?? chatSelection.app?.id ?? '';
    const hasAppForNewSession = !!appId;
    if (!hasSession && !hasAppForNewSession) {
      toast.error('请先选择应用或创建对话');
      return;
    }

    scrollAfterSendRef.current = true; // 发送后自动定位到底部

    const attachments = files;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
      attachments: attachments.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      })),
    };

    const displayKey = hasSession ? currentSessionId : `pending-${Date.now()}`;
    if (!hasSession) {
      setSessionMessages((prev) => ({ ...prev, [displayKey]: [newMessage] }));
      setCurrentSessionId(displayKey);
    } else {
      appendMessages(displayKey, [newMessage]);
    }

    const assistantId = `assistant-${Date.now()}`;
    const aiPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    appendMessages(displayKey, [aiPlaceholder]);

    const configPayload = {
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      topP: settings.topP,
      frequencyPenalty: settings.frequencyPenalty,
      presencePenalty: settings.presencePenalty,
    };

    // 只提交最后一条用户消息，上下文由后端根据 sessionId 从会话历史中获取
    const messages = [{ role: 'user' as const, content: userContent }];

    const effectiveKeyRef = { current: displayKey };

    try {
      // 已有会话且为默认名称时，先重命名再发送
      if (hasSession && (currentSession?.title?.trim() ?? '') === DEFAULT_SESSION_TITLE) {
        const titleFromContent = truncateForTitle(userContent);
        if (titleFromContent) {
          await renameSession(currentSessionId!, titleFromContent);
        }
      }

      const { chatStream } = await import('@/pages/chat/hooks/useChatStream.ts');
      let accumulated = '';
      const chatPayload: import('@/services/AgentChatTypes').AgentChatRequestDto = {
        messages,
        config: configPayload,
      };
      if (hasSession) {
        chatPayload.sessionId = currentSessionId;
      } else {
        chatPayload.appId = String(appId);
        if (chatSelection.modelId) chatPayload.modelId = String(chatSelection.modelId);
        const aid = chatSelection.agentId ?? chatSelection.app?.defaultAgent?.id;
        if (aid) chatPayload.agentId = String(aid);
      }

      const streamMsgIdRef = { current: null as string | null };
      await chatStream(chatPayload, {
        onMessageId: (msgId) => {
          streamMsgIdRef.current = msgId;
          updateMessage(effectiveKeyRef.current, assistantId, { id: msgId });
        },
        onSessionId: (sessionId) => {
          if (displayKey.startsWith('pending-')) {
            effectiveKeyRef.current = sessionId;
            addSessionFromChat(sessionId, displayKey, {
              appId,
              agentId: String(chatSelection.agentId ?? chatSelection.app?.defaultAgent?.id ?? ''),
              modelId: String(chatSelection.modelId ?? ''),
            });
            setSessionSelections((p) => ({ ...p, [sessionId]: chatSelection }));
            navigate(`/chat/${sessionId}`);
            // 新会话默认名为「新对话」，用首条消息重命名
            const titleFromContent = truncateForTitle(userContent);
            if (titleFromContent) {
              renameSession(sessionId, titleFromContent).catch(() => {});
            }
          }
        },
        onToken: (() => {
          let lastFlush = 0;
          const STREAM_THROTTLE_MS = 60;
          return (token: string) => {
            accumulated += token;
            const now = Date.now();
            if (now - lastFlush >= STREAM_THROTTLE_MS) {
              lastFlush = now;
              const idForUpdate = streamMsgIdRef.current ?? assistantId;
              updateMessage(effectiveKeyRef.current, idForUpdate, { content: accumulated });
            }
          };
        })(),
      });
      const idForFinal = streamMsgIdRef.current ?? assistantId;
      updateMessage(effectiveKeyRef.current, idForFinal, { content: accumulated, isStreaming: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '请求失败';
      updateMessage(effectiveKeyRef.current, assistantId, {
        content: `请求出错：${msg}`,
        isStreaming: false,
      });
      toast.error(msg);
    }
  };

  const handleRegenerate = useCallback(async () => {
    if (!currentSessionId || !currentSession) return;
    const msgs = currentMessages;
    if (msgs.length < 2) return;
    const lastMsg = msgs[msgs.length - 1];
    const lastUserMsg = msgs[msgs.length - 2];
    if (!lastMsg || lastMsg.role !== 'assistant') return;
    if (!lastUserMsg || lastUserMsg.role !== 'user') return;
    const userContent = lastUserMsg.content?.trim();
    if (!userContent) return;

    // 达到最大并发数时不再重新生成
    const streamingCount = Object.values(sessionMessages).filter((m) =>
      (m ?? []).some((msg) => msg.isStreaming)
    ).length;
    if (streamingCount >= maxConcurrentChats) {
      toast.error(`最多同时进行 ${maxConcurrentChats} 个对话，请等待其他对话完成`);
      return;
    }

    scrollAfterSendRef.current = true;
    removeLastAssistantMessage(currentSessionId);
    const assistantId = `assistant-${Date.now()}`;
    const aiPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    appendMessages(currentSessionId, [aiPlaceholder]);
    const configPayload = {
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      topP: settings.topP,
      frequencyPenalty: settings.frequencyPenalty,
      presencePenalty: settings.presencePenalty,
    };
    // 只提交最后一条用户消息，上下文由后端根据 sessionId 从会话历史中获取
    const messages = [{ role: 'user' as const, content: userContent }];
    try {
      const { chatStream } = await import('@/pages/chat/hooks/useChatStream.ts');
      let accumulated = '';
      let lastFlush = 0;
      const STREAM_THROTTLE_MS = 60;
      const regenMsgIdRef = { current: null as string | null };
      await chatStream(
        {
          sessionId: currentSessionId,
          messages,
          config: configPayload,
        },
        {
          onMessageId: (msgId) => {
            regenMsgIdRef.current = msgId;
            updateMessage(currentSessionId, assistantId, { id: msgId });
          },
          onToken: (token) => {
            accumulated += token;
            const now = Date.now();
            if (now - lastFlush >= STREAM_THROTTLE_MS) {
              lastFlush = now;
              const idForUpdate = regenMsgIdRef.current ?? assistantId;
              updateMessage(currentSessionId, idForUpdate, { content: accumulated });
            }
          },
        }
      );
      const idForFinal = regenMsgIdRef.current ?? assistantId;
      updateMessage(currentSessionId, idForFinal, { content: accumulated, isStreaming: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '请求失败';
      updateMessage(currentSessionId, assistantId, {
        content: `请求出错：${msg}`,
        isStreaming: false,
      });
      toast.error(msg);
    }
  }, [
    currentSessionId,
    currentSession,
    currentMessages,
    sessionMessages,
    removeLastAssistantMessage,
    appendMessages,
    updateMessage,
    settings,
    maxConcurrentChats,
  ]);

  const handleStopGenerate = useCallback(async (messageId: string) => {
    try {
      const res = await MessageApi.stopGeneration(messageId);
      const data = (res as { data?: { content?: string; isStreaming?: boolean } })?.data;
      if (data && currentSessionId) {
        updateMessage(currentSessionId, messageId, {
          content: data.content ?? '',
          isStreaming: false,
        });
      }
    } catch (e) {
      console.error('Stop generation failed:', e);
      toast.error('停止生成失败');
    }
  }, [currentSessionId, updateMessage]);

  /** SSE 断开后轮询：若最后一条助手消息在流式生成中，每 3 秒拉取详情直到完成 */
  const POLL_INTERVAL_MS = 3000;
  useEffect(() => {
    if (!currentSessionId || messagesLoading) return;
    const last = currentMessages[currentMessages.length - 1];
    if (!last || last.role !== 'assistant' || !last.isStreaming || !last.id) return;
    const timer = setInterval(async () => {
      try {
        const res = await MessageApi.getMessage(last.id!);
        const data = (res as { data?: { isStreaming?: boolean; content?: string } })?.data;
        if (data && !data.isStreaming) {
          updateMessage(currentSessionId, last.id, {
            content: data.content ?? '',
            isStreaming: false,
          });
          clearInterval(timer);
        }
      } catch {
        /* 忽略轮询错误 */
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [currentMessages, currentSessionId, messagesLoading, updateMessage]);

  const handleFeedback = useCallback(async (messageId: string, feedbackType: 'like' | 'dislike', comment?: string) => {
    if (!currentSessionId) return;
    try {
      await MessageApi.feedbackMessage(messageId, {
        feedbackType,
        ...(comment ? { comment } : {}),
      });
      toast.success(feedbackType === 'like' ? '感谢你的反馈' : '我们会改进');
      updateMessage(currentSessionId, messageId, { feedbackType });
    } catch (e) {
      console.error('Feedback failed:', e);
      toast.error('反馈提交失败');
    }
  }, [currentSessionId, updateMessage]);

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    lastCompositionEndRef.current = Date.now();
    // compositionend 后 keydown 可能延迟触发（部分 IME/浏览器），延迟 120ms 再置为 false
    setTimeout(() => {
      isComposingRef.current = false;
    }, 120);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('开始录音...');
    } else {
      toast.success('录音已停止');
    }
  };

  const baseSelection: ChatSwitcherSelection = {
    appId: currentSession?.appId ?? '',
    agentId: currentSession?.agentId ?? '',
    modelId: currentSession?.modelId ?? '',
    app: undefined,
    agent: undefined,
    model: undefined,
  };
  const chatSelection = sessionSelections[currentSessionId ?? ''] ?? baseSelection;

  // 应用功能配置（来自应用列表 app.features，undefined 时默认全部展示）
  const appFeatures = chatSelection.app?.features;
  const enableSessionList = appFeatures?.enableSessionList !== false;
  const enablePromptLibrary = appFeatures?.enablePromptLibrary !== false;
  const enableSwitchApp = appFeatures?.enableSwitchApp !== false;
  const enableFileUpload = appFeatures?.enableFileUpload !== false;
  const enableVoiceInput = appFeatures?.enableVoiceInput !== false;
  const enableImageInput = appFeatures?.enableImageInput !== false;
  const enableSessionSettings = appFeatures?.enableSessionSettings !== false;
  const enableAppearanceSettings = appFeatures?.enableAppearanceSettings !== false;

  // 当前选中的智能体（优先用 selection.agent，否则从 app 中解析）
  const currentAgent =
    chatSelection.agent ??
    chatSelection.app?.agents?.find((a) => String(a?.id) === chatSelection.agentId) ??
    chatSelection.app?.defaultAgent;
  const welcomeMessage = currentAgent?.welcomeMessage?.trim() ?? '';
  const suggestedQuestions = (currentAgent?.suggestedQuestions ?? []).filter((q) => q?.trim());
  const hasAgentPlaceholder = welcomeMessage !== '' || suggestedQuestions.length > 0;

  const createNewSession = async () => {
    const sel = chatSelection;
    const appId = sel.appId ?? '';
    const newSession = await createSession(appId, sel.modelId || undefined, sel.agentId || undefined);
    if (newSession && appId) {
      setSessionSelections(prev => ({ ...prev, [newSession.sessionId]: sel }));
      navigate(`/chat/${newSession.sessionId}`);
    }
  };

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      if (sessions.length <= 1) {
        toast.error('至少需要保留一个对话');
        return;
      }
      const now = Date.now();
      if (lastDeleteRef.current.id === sessionId && now - lastDeleteRef.current.t < 1500) return;
      lastDeleteRef.current = { id: sessionId, t: now };
      // 若删除的是当前会话，必须先更新 URL 再执行删除，否则 deleteSession 的 setState 会先触发重渲染，
      // effect 仍读取到旧的 sessionIdFromUrl，从而调用 ensureSessionLoaded(已删id) -> getSessionDetail
      const isDeletingCurrent = sessionId === currentSessionId;
      const nextSessionId = isDeletingCurrent
        ? sessions.filter(s => s.sessionId !== sessionId && s.id !== sessionId)[0]?.sessionId
        : null;
      if (isDeletingCurrent) {
        navigate(nextSessionId ? `/chat/${nextSessionId}` : '/chat', { replace: true });
      }
      await deleteSession(sessionId);
      clearChatSwitcherCacheForSession(sessionId);
    },
    [sessions, currentSessionId, deleteSession, navigate]
  );

  const onSwitchSession = useCallback(
    async (type: 'app' | 'agent' | 'model', payload: { appId?: string; agentId?: string; modelId?: string }) => {
      if (!currentSessionId) return null;
      try {
        if (type === 'app' && payload.appId) {
          return (await SessionApi.switchApp(currentSessionId, { appId: payload.appId })) as { data?: import('@/services/SessionTypes').SessionDetailVo };
        }
        if (type === 'agent' && payload.agentId) {
          return (await SessionApi.switchAgent(currentSessionId, { agentId: payload.agentId })) as { data?: import('@/services/SessionTypes').SessionDetailVo };
        }
        if (type === 'model' && payload.modelId) {
          return (await SessionApi.switchModel(currentSessionId, { modelId: payload.modelId })) as { data?: import('@/services/SessionTypes').SessionDetailVo };
        }
      } catch (e) {
        console.error('Switch session failed:', e);
        toast.error('切换失败');
      }
      return null;
    },
    [currentSessionId]
  );

  const updateSessionSelection = (s: ChatSwitcherSelection) => {
    // 仅当会话列表已加载完毕且确认为空时，才自动创建会话（避免 loadApps 先于 loadSessions 完成时误创建）
    if (!sessionsLoading && sessions.length === 0 && s.appId) {
      createSession(s.appId, s.modelId || undefined, s.agentId || undefined).then((newSession) => {
        if (newSession) {
          setSessionSelections((prev) => ({ ...prev, [newSession.sessionId]: s }));
          navigate(`/chat/${newSession.sessionId}`);
        }
      });
      return;
    }
    setSessionSelections((prev) => ({ ...prev, [currentSessionId]: s }));
    updateSessionInList(currentSessionId, { appId: s.appId, agentId: s.agentId, modelId: s.modelId });
  };

  const insertPrompt = (prompt: string) => {
    inputBarRef.current?.insertText(prompt);
    setShowPromptLibrary(false);
  };

  const exportChat = () => {
    if (!currentSession) return;
    const content = currentMessages.map(m => `[${m.role}] ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title}.txt`;
    a.click();
    toast.success('对话已导出');
  };

  const shareChat = () => {
    toast.success('分享链接已复制到剪贴板');
  };

  const clearCurrentChat = () => {
    clearSessionMessages(currentSessionId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
      toast.success('已进入全屏模式');
    } else {
      document.exitFullscreen?.();
      toast.success('已退出全屏模式');
    }
  };

  return (
    <MarkdownProvider defaultTheme={appTheme} defaultLocale={language}>
    <MarkdownThemeLocaleSync />
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Chat Sidebar（enableSessionList 关闭时不展示） */}
      {enableSessionList && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={createNewSession}
          onDeleteSession={handleDeleteSession}
          onRenameSession={renameSession}
          onToggleStar={toggleStar}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          searchKeyword={sessionKeyword}
          onSearchChange={setSessionKeyword}
          onSessionListScroll={loadMoreSessions}
          sessionsLoadMore={sessionsLoadMore}
          hasMoreSessions={hasMoreSessions}
          sessionTotal={sessionTotal}
        />
      )}

      {/* Main Chat Area */}
      <ChatMainArea
        onBack={handleBack}
        chatSelection={chatSelection}
        onSelectionChange={updateSessionSelection}
        onSwitchSession={onSwitchSession}
        enablePromptLibrary={enablePromptLibrary}
        enableSwitchApp={enableSwitchApp}
        enableFileUpload={enableFileUpload}
        enableVoiceInput={enableVoiceInput}
        enableImageInput={enableImageInput}
        enableSessionSettings={enableSessionSettings}
        enableAppearanceSettings={enableAppearanceSettings}
        onShowPromptLibrary={() => setShowPromptLibrary(true)}
        onShowThemeDialog={() => setShowThemeDialog(true)}
        onNewSession={!enableSessionList ? createNewSession : undefined}
        onShowSettings={() => setShowSettings(true)}
        onToggleFullscreen={toggleFullscreen}
        onExportChat={exportChat}
        onShareChat={shareChat}
        onClearChat={clearCurrentChat}
        currentMessages={currentMessages}
        messagesLoading={messagesLoading}
        currentSessionId={currentSessionId ?? undefined}
        hasAgentPlaceholder={hasAgentPlaceholder}
        welcomeMessage={welcomeMessage}
        suggestedQuestions={suggestedQuestions}
        selectedTemplateObj={selectedTemplateObj}
        onInsertPrompt={insertPrompt}
        inputBarRef={inputBarRef}
        initialContent={defaultContent}
        onSend={handleSendMessage}
        onVoiceRecord={handleVoiceRecord}
        isRecording={isRecording}
        isComposingRef={isComposingRef}
        lastCompositionEndRef={lastCompositionEndRef}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        isSending={currentMessages.some((m) => m.isStreaming)}
        scrollAfterSendRef={scrollAfterSendRef}
        onRegenerate={handleRegenerate}
        onFeedback={handleFeedback}
        onStopGenerate={handleStopGenerate}
      />

      {/* Prompt Library Dialog（enablePromptLibrary 关闭时仍允许通过其他入口打开，此处按配置控制） */}
      {enablePromptLibrary && showPromptLibrary &&
        <PromptLibraryDialog
          onClose={() => setShowPromptLibrary(false)}
          onSelectPrompt={insertPrompt}
        />
      }

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={setSettings}
        onSave={async (s) => {
          if (!currentSessionId) return false;
          const ok = await updateSessionConfig(currentSessionId, {
            temperature: s.temperature,
            maxTokens: s.maxTokens,
            topP: s.topP,
            frequencyPenalty: s.frequencyPenalty,
            presencePenalty: s.presencePenalty,
            timeoutMs: s.timeoutMs ?? DEFAULT_TIMEOUT_MS,
          });
          if (ok) setSettings(s);
          return ok;
        }}
      />

      {/* Theme Dialog */}
      <ThemeDialog
        open={showThemeDialog}
        onOpenChange={setShowThemeDialog}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />
    </div>
    </MarkdownProvider>
  );
}
