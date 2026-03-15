import { useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  StopCircle,
  MoreVertical,
  Sparkles,
  BookmarkPlus,
  Settings,
  Maximize2,
  ArrowLeft,
  Download,
  Share2,
  Palette,
  Trash2,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { ChatMessage } from './ChatMessage.tsx';
import { ChatSwitcher, type ChatSwitcherSelection } from './ChatSwitcher.tsx';
import { AttachmentPreview } from './AttachmentPreview.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { cn } from '@/components/ui/utils.ts';
import type { ThemeTemplate } from './ThemeDialog.tsx';
import type { Message } from '../hooks/useChatSessions.ts';

export interface ChatMainAreaProps {
  onBack: () => void;
  chatSelection: ChatSwitcherSelection;
  onSelectionChange: (s: ChatSwitcherSelection) => void;
  /** 是否显示提示词库入口，默认 true */
  enablePromptLibrary?: boolean;
  /** 是否显示应用切换器，默认 true */
  enableSwitchApp?: boolean;
  /** 是否启用文件上传，默认 true */
  enableFileUpload?: boolean;
  /** 是否启用语音输入，默认 true */
  enableVoiceInput?: boolean;
  /** 是否启用图片输入，默认 false */
  enableImageInput?: boolean;
  /** 是否显示会话设置（温度、maxToken等），默认 true */
  enableSessionSettings?: boolean;
  /** 是否显示外观设置，默认 true */
  enableAppearanceSettings?: boolean;
  /** 新对话回调（会话列表隐藏时用于下拉菜单中的新对话） */
  onNewSession?: () => void;
  onShowPromptLibrary: () => void;
  onShowThemeDialog: () => void;
  onShowSettings: () => void;
  onToggleFullscreen: () => void;
  onExportChat: () => void;
  onShareChat: () => void;
  onClearChat: () => void;
  currentMessages: Message[];
  /** 当前会话 ID，用于进入/切换会话时滚动到底部 */
  currentSessionId?: string;
  hasAgentPlaceholder: boolean;
  welcomeMessage: string;
  suggestedQuestions: string[];
  selectedTemplateObj?: ThemeTemplate;
  onInsertPrompt: (prompt: string) => void;
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  input: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVoiceRecord: () => void;
  isRecording: boolean;
  onSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** 是否正在发送（流式生成中），用于禁用发送按钮 */
  isSending?: boolean;
  /** 点击发送后需滚动到底部的 ref，由父组件在发送时设为 true */
  scrollAfterSendRef?: React.MutableRefObject<boolean>;
  /** 重新生成最后一条 AI 回复 */
  onRegenerate?: () => void;
  /** 消息反馈（点赞/点踩），点踩时需填写 comment */
  onFeedback?: (messageId: string, feedbackType: 'like' | 'dislike', comment?: string) => void;
}

export function ChatMainArea({
                               onBack,
                               chatSelection,
                               onSelectionChange,
                               enablePromptLibrary = true,
                               enableSwitchApp = true,
                               enableFileUpload = true,
                               enableVoiceInput = true,
                               enableImageInput = false,
                               enableSessionSettings = true,
                               enableAppearanceSettings = true,
                               onNewSession,
                               onShowPromptLibrary,
                               onShowThemeDialog,
                               onShowSettings,
                               onToggleFullscreen,
                               onExportChat,
                               onShareChat,
                               onClearChat,
                               currentMessages,
                               currentSessionId,
                               hasAgentPlaceholder,
                               welcomeMessage,
                               suggestedQuestions,
                               selectedTemplateObj,
                               onInsertPrompt,
                               attachments,
                               onRemoveAttachment,
                               input,
                               onInputChange,
                               onKeyDown,
                               onCompositionStart,
                               onCompositionEnd,
                               fileInputRef,
                               onFileSelect,
                               onVoiceRecord,
                               isRecording,
                               onSendMessage,
                               textareaRef,
                               isSending = false,
                               scrollAfterSendRef,
                               onRegenerate,
                               onFeedback,
                             }: ChatMainAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const prevSessionIdRef = useRef<string | undefined>(undefined);
  const needInitialScrollRef = useRef(true);
  const SCROLL_THROTTLE_MS = 200;
  /** 距底部小于此像素视为「在底部」，才自动滚动；否则用户已向上查看历史，不打断 */
  const BOTTOM_THRESHOLD_PX = 350;

  // 切换会话时，下次有消息时需滚动到底部
  if (currentSessionId !== prevSessionIdRef.current) {
    prevSessionIdRef.current = currentSessionId;
    needInitialScrollRef.current = true;
  }

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 进入对话页或切换会话时，有消息则定位到底部
    if (needInitialScrollRef.current && currentMessages.length > 0) {
      needInitialScrollRef.current = false;
      lastScrollTimeRef.current = Date.now();
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      return;
    }

    // 点击发送后需定位到底部
    if (scrollAfterSendRef?.current && currentMessages.length > 0) {
      scrollAfterSendRef.current = false;
      lastScrollTimeRef.current = Date.now();
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < BOTTOM_THRESHOLD_PX;
    if (!isNearBottom) return; // 用户已向上滚动，保持当前视口

    const last = currentMessages[currentMessages.length - 1];
    const isStreaming = last?.isStreaming === true;
    const now = Date.now();
    // 流式输出时对滚动做节流，避免每次 token 更新都触发导致页面抖动
    if (isStreaming && now - lastScrollTimeRef.current < SCROLL_THROTTLE_MS) return;
    lastScrollTimeRef.current = now;
    messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
  }, [currentMessages, currentSessionId]);

  const appDisplayName = chatSelection.app?.name ?? '应用';

  return (
    <div className='flex-1 flex flex-col'>
      {/* Top Bar */}
      <div className='h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onBack}
            className='hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div className='w-px h-6 bg-gray-200 dark:bg-gray-700' />
          {enableSwitchApp ? (
            <ChatSwitcher selection={chatSelection} onSelectionChange={onSelectionChange} />
          ) : (
            <span className='text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[180px]'>
              {appDisplayName}
            </span>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {enablePromptLibrary && (
            <Button variant='ghost' size='sm' onClick={onShowPromptLibrary} className='gap-2'>
              <BookmarkPlus className='w-4 h-4' />
              提示词库
            </Button>
          )}
          {enableAppearanceSettings && (
            <Button variant='ghost' size='icon' onClick={onShowThemeDialog} title='外观设置'>
              <Palette className='w-4 h-4' />
            </Button>
          )}
          {enableSessionSettings && (
            <Button variant='ghost' size='icon' onClick={onShowSettings}>
              <Settings className='w-4 h-4' />
            </Button>
          )}
          <Button variant='ghost' size='icon' onClick={onToggleFullscreen}>
            <Maximize2 className='w-4 h-4' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              {onNewSession && (
                <>
                  <DropdownMenuItem onClick={onNewSession}>
                    <Plus className='w-4 h-4 mr-2' />
                    新对话
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={onExportChat}>
                <Download className='w-4 h-4 mr-2' />
                导出对话
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShareChat}>
                <Share2 className='w-4 h-4 mr-2' />
                分享对话
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClearChat} className='text-red-600 dark:text-red-400'>
                <Trash2 className='w-4 h-4 mr-2' />
                清空对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto px-4 py-10'>
        <div className='max-w-4xl mx-auto pt-6 pb-6 space-y-6'>
          {currentMessages.length === 0 ? (
            hasAgentPlaceholder ? (
              <div className='flex flex-col items-center justify-center h-full text-center py-20'>
                <div
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mb-8',
                    selectedTemplateObj?.secondaryColor
                  )}
                >
                  <Sparkles
                    className={cn('w-10 h-10', selectedTemplateObj?.primaryColor?.replace('bg-', 'text-'))}
                  />
                </div>
                {welcomeMessage && (
                  <h3 className='text-xl mb-8 text-gray-800 dark:text-gray-100 max-w-2xl leading-relaxed'>
                    {welcomeMessage}
                  </h3>
                )}
                {suggestedQuestions.length > 0 && (
                  <div className='flex flex-wrap justify-center gap-2 mb-6'>
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant='outline'
                        size='sm'
                        className={cn(
                          'rounded-full',
                          'text-gray-700 dark:text-gray-300',
                          'border-gray-300 dark:border-gray-600',
                          'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
                          'dark:hover:bg-blue-500/10 dark:hover:border-blue-500/50 dark:hover:text-blue-400'
                        )}
                        onClick={() => onInsertPrompt(q)}
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
                  <Sparkles
                    className={cn('w-10 h-10', selectedTemplateObj?.primaryColor?.replace('bg-', 'text-'))}
                  />
                </div>
                <h3 className='text-xl mb-2 dark:text-white'>开始新对话</h3>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>输入你的问题，或使用提示词库快速开始</p>
              </div>
            )
          ) : (
            <>
              {currentMessages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLastAssistant={index === currentMessages.length - 1 && message.role === 'assistant'}
                  onRegenerate={onRegenerate}
                  onFeedback={onFeedback}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4'>
        <div className='max-w-4xl mx-auto'>
          {attachments.length > 0 && (
            <div className='mb-3 flex flex-wrap gap-2'>
              {attachments.map((file, index) => (
                <AttachmentPreview key={index} file={file} onRemove={() => onRemoveAttachment(index)} />
              ))}
            </div>
          )}

          <div className='flex-1 relative'>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              placeholder='输入消息... (Shift + Enter 换行)'
              className='min-h-[80px] max-h-[240px] resize-none pr-32 py-4 px-4 dark:bg-gray-800 dark:border-gray-700 scrollbar-hide'
              rows={1}
            />
            <div className='absolute right-3 bottom-3 flex items-center gap-1'>
              <input ref={fileInputRef} type='file' multiple className='hidden' onChange={onFileSelect} />
              {enableFileUpload && (
                <Button variant='ghost' size='icon' className='h-9 w-9' onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = '*'; fileInputRef.current.click(); } }} title='上传文件'>
                  <Paperclip className='w-4 h-4' />
                </Button>
              )}
              {enableImageInput && (
                <Button variant='ghost' size='icon' className='h-9 w-9' onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = 'image/*'; fileInputRef.current.click(); } }} title='上传图片'>
                  <ImageIcon className='w-4 h-4' />
                </Button>
              )}
              {enableVoiceInput && (
                <Button variant='ghost' size='icon' className='h-9 w-9' onClick={onVoiceRecord}>
                  {isRecording ? <StopCircle className='w-4 h-4 text-red-500' /> : <Mic className='w-4 h-4' />}
                </Button>
              )}
              <Button
                size='icon'
                onClick={onSendMessage}
                disabled={isSending || (!input.trim() && attachments.length === 0)}
                className={cn('h-9 w-9', selectedTemplateObj?.primaryColor ?? 'bg-blue-500', 'text-white')}
              >
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
