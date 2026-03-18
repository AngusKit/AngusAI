import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Loader2,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { ChatMessage } from './ChatMessage.tsx';
import { ChatInputBar, type ChatInputBarHandle } from './ChatInputBar.tsx';
import { ChatSwitcher, type ChatSwitcherSelection } from './ChatSwitcher.tsx';
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
  /** 切换应用/智能体/模型时调用的 API（有 currentSessionId 时由 ChatSwitcher 调用） */
  onSwitchSession?: (
    type: 'app' | 'agent' | 'model',
    payload: { appId?: string; agentId?: string; modelId?: string }
  ) => Promise<{ data?: import('@/services/SessionTypes').SessionDetailVo } | null>;
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
  /** 消息列表加载中 */
  messagesLoading?: boolean;
  /** 当前会话 ID，用于进入/切换会话时滚动到底部 */
  currentSessionId?: string;
  hasAgentPlaceholder: boolean;
  welcomeMessage: string;
  suggestedQuestions: string[];
  selectedTemplateObj?: ThemeTemplate;
  onInsertPrompt: (prompt: string) => void;
  /** 输入区 ref，用于提示词库注入等 */
  inputBarRef?: React.RefObject<ChatInputBarHandle | null>;
  /** 初始输入内容（如分享链接预填） */
  initialContent?: string;
  /** 发送消息，由输入区调用并传入 content 和 attachments */
  onSend: (content: string, attachments: File[]) => void;
  onVoiceRecord?: () => void;
  isRecording?: boolean;
  /** IME 检测 */
  isComposingRef?: React.MutableRefObject<boolean>;
  lastCompositionEndRef?: React.MutableRefObject<number>;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
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
                               onSwitchSession,
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
                               messagesLoading = false,
                               currentSessionId,
                               hasAgentPlaceholder,
                               welcomeMessage,
                               suggestedQuestions,
                               selectedTemplateObj,
                               onInsertPrompt,
                               inputBarRef,
                               initialContent = '',
                               onSend,
                               onVoiceRecord,
                               isRecording = false,
                               isComposingRef,
                               lastCompositionEndRef,
                               onCompositionStart,
                               onCompositionEnd,
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
  /** 消息数超过此阈值时启用虚拟列表，只渲染可见区域以提升性能 */
  const VIRTUAL_THRESHOLD = 6;

  const useVirtual = currentMessages.length > VIRTUAL_THRESHOLD;
  const virtualizer = useVirtualizer({
    count: currentMessages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 180,
    gap: 24,
    overscan: 5,
    getItemKey: (i) => currentMessages[i]?.id ?? String(i),
  });
  const virtualItems = useVirtual ? virtualizer.getVirtualItems() : [];
  const totalSize = useVirtual ? virtualizer.getTotalSize() : 0;

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
            <ChatSwitcher
              selection={chatSelection}
              onSelectionChange={onSelectionChange}
              sessionId={currentSessionId}
              onSwitch={currentSessionId ? onSwitchSession : undefined}
            />
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
          {messagesLoading && currentMessages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <Loader2 className='w-10 h-10 animate-spin text-blue-500 dark:text-blue-400 mb-4' />
              <p className='text-gray-500 dark:text-gray-400'>加载中...</p>
            </div>
          ) : currentMessages.length === 0 ? (
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
          ) : useVirtual ? (
            <>
              <div
                className="relative w-full"
                style={{ height: `${totalSize}px` }}
              >
                {virtualItems.map((virtualRow) => {
                  const message = currentMessages[virtualRow.index];
                  if (!message) return null;
                  return (
                    <div
                      key={message.id}
                      ref={virtualizer.measureElement}
                      data-index={virtualRow.index}
                      className="absolute left-0 right-0 pb-6"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <ChatMessage
                        message={message}
                        isLastAssistant={
                          virtualRow.index === currentMessages.length - 1 &&
                          message.role === 'assistant'
                        }
                        onRegenerate={onRegenerate}
                        onFeedback={onFeedback}
                      />
                    </div>
                  );
                })}
              </div>
              <div ref={messagesEndRef} />
            </>
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

      {/* Input Area - 独立组件，输入时仅重渲染自身，解决延迟问题 */}
      <ChatInputBar
        ref={inputBarRef}
        initialContent={initialContent}
        onSend={onSend}
        isSending={isSending}
        enableFileUpload={enableFileUpload}
        enableImageInput={enableImageInput}
        enableVoiceInput={enableVoiceInput}
        selectedTemplateObj={selectedTemplateObj}
        onVoiceRecord={onVoiceRecord}
        isRecording={isRecording}
        isComposingRef={isComposingRef}
        lastCompositionEndRef={lastCompositionEndRef}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    </div>
  );
}
