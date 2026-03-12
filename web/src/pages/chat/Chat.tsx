import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, StopCircle, MoreVertical, Sparkles, BookmarkPlus, Settings, Maximize2, ArrowLeft, Download, Share2, Palette, Check, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { refreshResourcesBadge } from '@/hooks/useResourcesBadge';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { useChatSessions, type Message } from './hooks/useChatSessions';
import { PromptLibrary } from './PromptLibrary';
import {
  ChatSwitcher,
  type ChatSwitcherSelection,
} from './ChatSwitcher';
import { AttachmentPreview } from './AttachmentPreview';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import { useNavigate } from 'react-router-dom';
import { AgentChatConfig } from '@/services/AgentChatTypes';
import {
  DEFAULT_CHAT_SETTINGS,
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_MAX_TOKENS,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
} from './constants';

type TemplateType = 'modern-blue' | 'minimal-gray' | 'elegant-purple' | 'warm-orange';

interface ChatProps {
  content?: string;
  onBack?: () => void;
}

export function Chat({ content = '', onBack }: ChatProps = {}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    sessionsLoading,
    createSession,
    deleteSession,
    renameSession,
    toggleStar,
    selectSession,
    appendMessages,
    updateSessionInList,
    clearSessionMessages,
    sessionKeyword,
    setSessionKeyword,
  } = useChatSessions();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    onBack ? onBack() : navigate('/dashboard');
  };

  // Settings state
  const [settings, setSettings] = useState<AgentChatConfig>(DEFAULT_CHAT_SETTINGS);

  // Theme templates
  const templates = [
    {
      id: 'modern-blue' as TemplateType,
      name: '现代蓝',
      description: '专业清新的蓝色主题',
      primaryColor: 'bg-blue-500',
      secondaryColor: 'bg-blue-50 dark:bg-blue-900/20',
      accentColor: 'border-blue-200 dark:border-blue-800',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    },
    {
      id: 'minimal-gray' as TemplateType,
      name: '简约灰',
      description: '简洁优雅的灰色主题',
      primaryColor: 'bg-gray-700',
      secondaryColor: 'bg-gray-50 dark:bg-gray-800',
      accentColor: 'border-gray-200 dark:border-gray-700',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-750',
    },
    {
      id: 'elegant-purple' as TemplateType,
      name: '优雅紫',
      description: '高雅精致的紫色主题',
      primaryColor: 'bg-purple-500',
      secondaryColor: 'bg-purple-50 dark:bg-purple-900/20',
      accentColor: 'border-purple-200 dark:border-purple-800',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    },
    {
      id: 'warm-orange' as TemplateType,
      name: '温暖橙',
      description: '活力温馨的橙色主题',
      primaryColor: 'bg-orange-500',
      secondaryColor: 'bg-orange-50 dark:bg-orange-900/20',
      accentColor: 'border-orange-200 dark:border-orange-800',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
    },
  ];

  const selectedTemplateObj = templates.find(t => t.id === selectedTemplate) || templates[0];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
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

    // Simulate AI response (实际应用中会调用 AI API)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '这是一个模拟的AI响应。在实际应用中，这里会调用真实的AI API。\n\n你可以使用 **Markdown** 格式化文本，包括：\n- 列表项\n- **粗体**和*斜体*\n- [链接](https://example.com)\n- `代码块`\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```',
        timestamp: new Date(),
        isStreaming: false,
      };
      appendMessages(currentSessionId, [aiMessage]);
    }, 1000);
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

  // 当前选中的智能体（优先用 selection.agent，否则从 app 中解析）
  const currentAgent =
    chatSelection.agent ??
    chatSelection.app?.agents?.find((a) => String(a?.id) === chatSelection.agentId) ??
    chatSelection.app?.defaultAgent;
  const welcomeMessage = currentAgent?.welcomeMessage?.trim() ?? '';
  const suggestedQuestions = (currentAgent?.suggestedQuestions ?? []).filter((q) => q?.trim());
  const hasAgentPlaceholder = welcomeMessage !== '' || suggestedQuestions.length > 0;

  // 当前智能体：优先用 selection.agent，否则从 app 解析
  const currentAgent =
    chatSelection.agent ??
    chatSelection.app?.agents?.find((a) => String(a?.id) === chatSelection.agentId) ??
    chatSelection.app?.defaultAgent;
  const welcomeMessage = currentAgent?.welcomeMessage?.trim() ?? '';
  const suggestedQuestions = (currentAgent?.suggestedQuestions ?? []).filter(Boolean) as string[];
  const hasAgentPlaceholder = welcomeMessage !== '' || suggestedQuestions.length > 0;

  const createNewSession = async () => {
    const sel = chatSelection;
    const appId = sel.appId ?? '';
    const newSession = await createSession(appId, sel.modelId || undefined, sel.agentId || undefined);
    if (newSession && appId) {
      setSessionSelections(prev => ({ ...prev, [newSession.sessionId]: sel }));
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
      {/* Chat Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={selectSession}
        onNewSession={createNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={renameSession}
        onToggleStar={toggleStar}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        searchKeyword={sessionKeyword}
        onSearchChange={setSessionKeyword}
      />

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Top Bar */}
        <div className='h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {(
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleBack}
                  className='hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <ArrowLeft className='w-5 h-5' />
                </Button>
                <div className='w-px h-6 bg-gray-200 dark:bg-gray-700' />
              </>
            )}
            <ChatSwitcher selection={chatSelection} onSelectionChange={updateSessionSelection} />
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm' onClick={() => setShowPromptLibrary(true)} className='gap-2'>
              <BookmarkPlus className='w-4 h-4' />
              提示词库
            </Button>
            <Button variant='ghost' size='icon' onClick={() => setShowThemeDialog(true)} title='外观设置'>
              <Palette className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='icon' onClick={() => setShowSettings(true)}>
              <Settings className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='icon' onClick={toggleFullscreen}>
              <Maximize2 className='w-4 h-4' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem onClick={exportChat}>
                  <Download className='w-4 h-4 mr-2' />
                  导出对话
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareChat}>
                  <Share2 className='w-4 h-4 mr-2' />
                  分享对话
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearCurrentChat} className='text-red-600 dark:text-red-400'>
                  清空当前对话
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto px-4 py-6'>
          <div className='max-w-4xl mx-auto space-y-6'>
            {currentMessages.length === 0 ? (
              (() => {
                const currentAgent =
                  chatSelection.agent ??
                  chatSelection.app?.agents?.find((a) => String(a?.id) === chatSelection.agentId) ??
                  chatSelection.app?.defaultAgent;
                const welcomeMsg = currentAgent?.welcomeMessage?.trim() ?? '';
                const suggestedQuestions = currentAgent?.suggestedQuestions?.filter(Boolean) ?? [];
                const hasAgentContent = welcomeMsg !== '' || suggestedQuestions.length > 0;

                return hasAgentContent ? (
                  <div className='flex flex-col items-center justify-center h-full text-center py-20'>
                    <div
                      className={cn(
                        'w-20 h-20 rounded-full flex items-center justify-center mb-4',
                        selectedTemplateObj?.secondaryColor
                      )}
                    >
                      <Sparkles className={cn('w-10 h-10', selectedTemplateObj?.primaryColor?.replace('bg-', 'text-'))} />
                    </div>
                    {welcomeMsg && (
                      <h3 className='text-xl mb-4 dark:text-white max-w-2xl'>{welcomeMsg}</h3>
                    )}
                    {suggestedQuestions.length > 0 && (
                      <div className='flex flex-wrap justify-center gap-2 mb-6'>
                        {suggestedQuestions.map((q, i) => (
                          <Button
                            key={i}
                            variant='outline'
                            size='sm'
                            className='rounded-full'
                            onClick={() => insertPrompt(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center h-full text-center py-20'>
                    <div
                      className={cn(
                        'w-20 h-20 rounded-full flex items-center justify-center mb-4',
                        selectedTemplateObj?.secondaryColor
                      )}
                    >
                      <Sparkles className={cn('w-10 h-10', selectedTemplateObj?.primaryColor?.replace('bg-', 'text-'))} />
                    </div>
                    <h3 className='text-xl mb-2 dark:text-white'>开始新对话</h3>
                    <p className='text-gray-500 dark:text-gray-400 mb-6'>输入你的问题，或使用提示词库快速开始</p>
                  </div>
                );
              })()
            ) : (
              <>
                {currentMessages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4'>
          <div className='max-w-4xl mx-auto'>
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className='mb-3 flex flex-wrap gap-2'>
                {attachments.map((file, index) => (
                  <AttachmentPreview key={index} file={file} onRemove={() => removeAttachment(index)} />
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className='flex-1 relative'>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='输入消息... (Shift + Enter 换行)'
                className='min-h-[80px] max-h-[240px] resize-none pr-32 py-4 px-4 dark:bg-gray-800 dark:border-gray-700 scrollbar-hide'
                rows={1}
              />
              <div className='absolute right-3 bottom-3 flex items-center gap-1'>
                <input ref={fileInputRef} type='file' multiple className='hidden' onChange={handleFileSelect} />
                <Button variant='ghost' size='icon' className='h-9 w-9' onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='icon' className='h-9 w-9' onClick={handleVoiceRecord}>
                  {isRecording ? <StopCircle className='w-4 h-4 text-red-500' /> : <Mic className='w-4 h-4' />}
                </Button>
                <Button
                  size='icon'
                  onClick={handleSendMessage}
                  disabled={!input.trim() && attachments.length === 0}
                  className={cn('h-9 w-9', selectedTemplateObj?.primaryColor ?? 'bg-blue-500', 'text-white')}
                >
                  <Send className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Library Dialog */}
      {showPromptLibrary && <PromptLibrary onClose={() => setShowPromptLibrary(false)} onSelectPrompt={insertPrompt} />}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>对话设置</DialogTitle>
            <DialogDescription>调整AI对话的参数配置</DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {/* Temperature */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>温度 (Temperature)</Label>
                <span className='text-sm text-gray-500'>{settings.temperature}</span>
              </div>
              <Slider
                value={[settings.temperature ?? DEFAULT_TEMPERATURE]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, temperature: value ?? prev.temperature ?? DEFAULT_TEMPERATURE }))}
                min={0}
                max={2}
                step={0.1}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>
                控制输出的随机性。较高的值使输出更随机，较低的值使输出更集中和确定。
              </p>
            </div>

            {/* Max Tokens */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>最大令牌数 (Max Tokens)</Label>
                <span className='text-sm text-gray-500'>{settings.maxTokens}</span>
              </div>
              <Slider
                value={[settings.maxTokens ?? DEFAULT_MAX_TOKENS]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, maxTokens: value ?? prev.maxTokens ?? DEFAULT_MAX_TOKENS }))}
                min={100}
                max={4000}
                step={100}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>限制生成响应的最大长度。</p>
            </div>

            {/* Top P */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>Top P</Label>
                <span className='text-sm text-gray-500'>{settings.topP}</span>
              </div>
              <Slider
                value={[settings.topP ?? DEFAULT_TOP_P]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, topP: value ?? prev.topP ?? DEFAULT_TOP_P }))}
                min={0}
                max={1}
                step={0.05}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>核心采样：考虑累积概率为 top_p 的标记结果。</p>
            </div>

            {/* Frequency Penalty */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>频率惩罚 (Frequency Penalty)</Label>
                <span className='text-sm text-gray-500'>{settings.frequencyPenalty}</span>
              </div>
              <Slider
                value={[settings.frequencyPenalty ?? DEFAULT_FREQUENCY_PENALTY]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, frequencyPenalty: value ?? prev.frequencyPenalty ?? DEFAULT_FREQUENCY_PENALTY }))}
                min={0}
                max={2}
                step={0.1}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>降低模型重复相同内容的可能性。</p>
            </div>

            {/* Presence Penalty */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>存在惩罚 (Presence Penalty)</Label>
                <span className='text-sm text-gray-500'>{settings.presencePenalty}</span>
              </div>
              <Slider
                value={[settings.presencePenalty ?? DEFAULT_PRESENCE_PENALTY]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, presencePenalty: value ?? prev.presencePenalty ?? DEFAULT_PRESENCE_PENALTY }))}
                min={0}
                max={2}
                step={0.1}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>增加模型谈论新话题的可能性。</p>
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setShowSettings(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                setShowSettings(false);
                toast.success('设置已保存');
              }}
            >
              保存设置
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Dialog */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Palette className='w-5 h-5' />
              外观主题设置
            </DialogTitle>
            <DialogDescription>选择你喜欢的对话界面外观主题</DialogDescription>
          </DialogHeader>

          <div className='space-y-2 py-2'>
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  toast.success(`已切换到${template.name}主题`);
                }}
                className={cn(
                  'p-3 border-2 rounded-lg cursor-pointer transition-all',
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                )}
              >
                <div className='flex items-center justify-between mb-2'>
                  <div>
                    <div className='dark:text-white'>{template.name}</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{template.description}</div>
                  </div>
                  {selectedTemplate === template.id && <Check className='w-4 h-4 text-blue-500' />}
                </div>
                <div className='flex gap-1.5'>
                  <div
                    className={cn('w-8 h-8 rounded border-2 border-white dark:border-gray-900', template.primaryColor)}
                  ></div>
                  <div className={cn('w-8 h-8 rounded border', template.secondaryColor, template.accentColor)}></div>
                  <div className={cn('w-8 h-8 rounded border', template.secondaryColor, template.accentColor)}></div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button variant='outline' onClick={() => setShowThemeDialog(false)}>
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
