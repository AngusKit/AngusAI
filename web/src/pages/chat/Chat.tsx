import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, StopCircle, MoreVertical, Sparkles, BookmarkPlus, Settings, Maximize2, ArrowLeft, Download, Share2, Palette, Check, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { refreshResourcesBadge } from '@/hooks/useResourcesBadge';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { PromptLibrary } from './PromptLibrary';
import {
  ChatSwitcher,
  type ChatSwitcherSelection,
} from './ChatSwitcher';
import { AttachmentPreview } from './AttachmentPreview';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import { useNavigate } from 'react-router-dom';

type TemplateType = 'modern-blue' | 'minimal-gray' | 'elegant-purple' | 'warm-orange';

interface Message {
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

interface Session {
  id: string;
  title: string;
  appId: string;
  agentId: string;
  modelId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
}

interface ChatProps {
  content?: string;
  onBack?: () => void;
}

export function Chat({ content = '', onBack }: ChatProps = {}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: '新对话',
      appId: '',
      agentId: '',
      modelId: '',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');
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
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    streamResponse: true,
    saveHistory: true,
  });

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

  const currentSession = sessions.find(s => s.id === currentSessionId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

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

    // Add user message
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: [...s.messages, newMessage],
              updatedAt: new Date(),
            }
          : s
      )
    );

    setInput('');
    setAttachments([]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '这是一个模拟的AI响应。在实际应用中，这里会调用真实的AI API。\n\n你可以使用 **Markdown** 格式化文本，包括：\n- 列表项\n- **粗体**和*斜体*\n- [链接](https://example.com)\n- `代码块`\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```',
        timestamp: new Date(),
        isStreaming: false,
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: [...s.messages, aiMessage],
                updatedAt: new Date(),
              }
            : s
        )
      );
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

  const createNewSession = () => {
    const currentSel = currentSessionId ? sessionSelections[currentSessionId] : undefined;
    const newSession: Session = {
      id: Date.now().toString(),
      title: '新对话',
      appId: currentSel?.appId ?? currentSession?.appId ?? '',
      agentId: currentSel?.agentId ?? currentSession?.agentId ?? '',
      modelId: currentSel?.modelId ?? currentSession?.modelId ?? '',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    if (currentSel) {
      setSessionSelections(prev => ({ ...prev, [newSession.id]: currentSel }));
    }
    toast.success('已创建新对话');
  };

  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) {
      toast.error('至少需要保留一个对话');
      return;
    }
    const remaining = sessions.filter(s => s.id !== sessionId);
    setSessions(() => remaining);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(remaining[0]?.id ?? '');
    }
    toast.success('对话已删除');
    refreshResourcesBadge();
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

  const updateSessionSelection = (s: ChatSwitcherSelection) => {
    setSessionSelections((prev) => ({ ...prev, [currentSessionId]: s }));
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              appId: s.appId,
              agentId: s.agentId,
              modelId: s.modelId,
              updatedAt: new Date(),
            }
          : session
      )
    );
  };

  const insertPrompt = (prompt: string) => {
    setInput(prev => prev + prompt);
    setShowPromptLibrary(false);
    textareaRef.current?.focus();
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, title: newTitle, updatedAt: new Date() } : s)));
    toast.success('对话已重命名');
  };

  const toggleSessionStar = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, isStarred: !s.isStarred, updatedAt: new Date() } : s))
    );
  };

  const exportChat = () => {
    if (!currentSession) return;
    const content = currentSession.messages.map(m => `[${m.role}] ${m.content}`).join('\n\n');
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
    setSessions(prev => prev.map(s => (s.id === currentSessionId ? { ...s, messages: [], updatedAt: new Date() } : s)));
    toast.success('对话已清空');
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
        onSessionSelect={setCurrentSessionId}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        onToggleStar={toggleSessionStar}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
            {currentSession?.messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center py-20'>
                <div
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mb-4',
                    selectedTemplateObj.secondaryColor
                  )}
                >
                  <Sparkles className={cn('w-10 h-10', selectedTemplateObj.primaryColor.replace('bg-', 'text-'))} />
                </div>
                <h3 className='text-xl mb-2 dark:text-white'>开始新对话</h3>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>输入你的问题，或使用提示词库快速开始</p>
              </div>
            ) : (
              <>
                {currentSession?.messages.map(message => (
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
                className='min-h-[80px] max-h-[240px] resize-none pr-32 py-4 px-4 dark:bg-gray-750 dark:border-gray-600 scrollbar-hide'
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
                  className={cn('h-9 w-9', selectedTemplateObj.primaryColor, 'text-white')}
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
                value={[settings.temperature]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, temperature: value }))}
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
                value={[settings.maxTokens]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, maxTokens: value }))}
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
                value={[settings.topP]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, topP: value }))}
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
                value={[settings.frequencyPenalty]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, frequencyPenalty: value }))}
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
                value={[settings.presencePenalty]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, presencePenalty: value }))}
                min={0}
                max={2}
                step={0.1}
                className='w-full'
              />
              <p className='text-xs text-gray-500'>增加模型谈论新话题的可能性。</p>
            </div>

            {/* Stream Response */}
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>流式响应</Label>
                <p className='text-xs text-gray-500'>启用后将实时显示AI的回复内容</p>
              </div>
              <Switch
                checked={settings.streamResponse}
                onCheckedChange={checked => setSettings(prev => ({ ...prev, streamResponse: checked }))}
              />
            </div>

            {/* Save History */}
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>保存历史记录</Label>
                <p className='text-xs text-gray-500'>自动保存对话历史</p>
              </div>
              <Switch
                checked={settings.saveHistory}
                onCheckedChange={checked => setSettings(prev => ({ ...prev, saveHistory: checked }))}
              />
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
