import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { refreshResourcesBadge } from '@/hooks/useResourcesBadge';
import { ChatSidebar } from './components/ChatSidebar.tsx';
import { ChatMainArea } from './components/ChatMainArea.tsx';
import { useChatSessions, type Message } from './hooks/useChatSessions';
import { PromptLibraryDialog } from './components/PromptLibraryDialog.tsx';
import { type ChatSwitcherSelection } from './components/ChatSwitcher.tsx';
import { SettingsDialog } from './components/SettingsDialog.tsx';
import { ThemeDialog, CHAT_TEMPLATES, type TemplateType } from './components/ThemeDialog.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { AgentChatConfig } from '@/services/AgentChatTypes';
import { DEFAULT_CHAT_SETTINGS } from './constants';

interface ChatProps {
  content?: string;
  onBack?: () => void;
}

export function Chat({ content = '', onBack }: ChatProps = {}) {
  useLanguage();
  const navigate = useNavigate();
  const { sessionId: sessionIdFromUrl } = useParams<{ sessionId?: string }>();
  const {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
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
    appendMessages,
    updateMessage,
    updateSessionInList,
    updateSessionConfig,
    clearSessionMessages,
    sessionKeyword,
    setSessionKeyword,
  } = useChatSessions(undefined, undefined, sessionIdFromUrl);
  const [sessionSelections, setSessionSelections] = useState<Record<string, ChatSwitcherSelection>>({});
  const defaultContent = content || sessionStorage.getItem('chatContent') || '';
  const [input, setInput] = useState(defaultContent);
  sessionStorage.removeItem('chatContent');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-blue');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    onBack ? onBack() : navigate('/dashboard');
  };

  // Settings state：切换会话时从 currentSession.config 同步，保存时调用 updateSessionConfig
  const [settings, setSettings] = useState<AgentChatConfig>(DEFAULT_CHAT_SETTINGS);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSessionSelect = (sessionId: string) => {
    selectSession(sessionId);
    navigate(`/chat/${sessionId}`);
  };

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!currentSessionId) {
      toast.error('请先选择或创建对话');
      return;
    }

    const agentId = chatSelection.agentId ?? chatSelection.app?.defaultAgent?.id ?? currentSession?.agentId;
    if (!agentId) {
      toast.error('请先选择智能体');
      return;
    }

    const userContent = input.trim();
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

    appendMessages(currentSessionId, [newMessage]);
    setInput('');
    setAttachments([]);

    const assistantId = `assistant-${Date.now()}`;
    const aiPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    appendMessages(currentSessionId, [aiPlaceholder]);

    setIsSending(true);

    try {
      const { chatStream } = await import('@/pages/chat/hooks/useChatStream.ts');
      let accumulated = '';
      await chatStream(
        {
          agentId: String(agentId),
          sessionId: currentSessionId,
          message: userContent,
          config: {
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            topP: settings.topP,
            frequencyPenalty: settings.frequencyPenalty,
            presencePenalty: settings.presencePenalty,
          },
        },
        {
          onToken: (token) => {
            accumulated += token;
            updateMessage(currentSessionId, assistantId, { content: accumulated });
          },
        }
      );
      updateMessage(currentSessionId, assistantId, { isStreaming: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '请求失败';
      updateMessage(currentSessionId, assistantId, {
        content: `请求出错：${msg}`,
        isStreaming: false,
      });
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    toast.success(`已添加 ${files.length} 个附件`);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      toast.error('至少需要保留一个对话');
      return;
    }
    deleteSession(sessionId);
    refreshResourcesBadge();
  };

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
    setInput(prev => prev + prompt);
    setShowPromptLibrary(false);
    textareaRef.current?.focus();
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
        currentSessionId={currentSessionId}
        sessionConfig={settings}
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
        hasAgentPlaceholder={hasAgentPlaceholder}
        welcomeMessage={welcomeMessage}
        suggestedQuestions={suggestedQuestions}
        selectedTemplateObj={selectedTemplateObj}
        onInsertPrompt={insertPrompt}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        input={input}
        onInputChange={setInput}
        onKeyDown={handleKeyDown}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
        onVoiceRecord={handleVoiceRecord}
        isRecording={isRecording}
        onSendMessage={handleSendMessage}
        textareaRef={textareaRef}
        isSending={isSending}
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
  );
}
