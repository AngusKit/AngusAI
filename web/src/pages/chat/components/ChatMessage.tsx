import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Check,
  Download,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { MarkdownRenderer } from '@xcan-cloud/markdown';
import { cn } from '@/components/ui/utils.ts';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/clipboard.ts';
import { detectContentFormat, type ContentFormat } from '../utils.ts';
import { HtmlPreviewDialog } from './HtmlPreviewDialog.tsx';

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
  /** 反馈类型：like或dislike */
  feedbackType?: string;
}

interface ChatMessageProps {
  message: Message;
  /** 是否为最后一条助手消息，仅最后一条显示重新生成按钮 */
  isLastAssistant?: boolean;
  /** 重新生成回调 */
  onRegenerate?: () => void;
  /** 消息反馈回调（点赞/点踩），点踩时需填写 comment */
  onFeedback?: (messageId: string, feedbackType: 'like' | 'dislike', comment?: string) => void;
  /** 停止生成回调 */
  onStopGenerate?: (messageId: string) => void;
}

const ChatMessageInner = ({ message, isLastAssistant, onRegenerate, onFeedback, onStopGenerate }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(() => {
    const ft = message.feedbackType;
    if (ft === 'like') return true;
    if (ft === 'dislike') return false;
    return null;
  });
  const [dislikeDialogOpen, setDislikeDialogOpen] = useState(false);
  const [dislikeComment, setDislikeComment] = useState('');
  const [htmlPreviewOpen, setHtmlPreviewOpen] = useState(false);

  useEffect(() => {
    const ft = message.feedbackType;
    setLiked(ft === 'like' ? true : ft === 'dislike' ? false : null);
  }, [message.feedbackType]);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('复制失败');
    }
  };

  const handleLike = async (isLike: boolean) => {
    if (!onFeedback || !message.id) return;
    if (isLike) {
      try {
        await onFeedback(message.id, 'like');
        setLiked(true);
      } catch {
        // 错误时由父组件 handleFeedback 统一 toast
      }
    } else {
      setDislikeDialogOpen(true);
    }
  };

  const handleDislikeSubmit = async () => {
    if (!onFeedback || !message.id) return;
    try {
      await onFeedback(message.id, 'dislike', dislikeComment.trim() || undefined);
      setLiked(false);
      setDislikeDialogOpen(false);
      setDislikeComment('');
    } catch {
      // 错误时由父组件 handleFeedback 统一 toast
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) onRegenerate();
    else toast.success('正在重新生成回答...');
  };

  const handleDownloadMessage = () => {
    const ext = contentFormat === 'html' ? 'html' : contentFormat === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([message.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `消息_${message.timestamp.toISOString().slice(0, 19).replace(/[-:T]/g, '')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('已下载');
  };

  const isUser = message.role === 'user';

  // 流式时锁定格式：一旦识别为 markdown 即保持，避免 plain↔markdown 切换导致 remount 闪烁
  const formatLockRef = useRef<ContentFormat | null>(null);
  const contentFormat = useMemo<ContentFormat>(() => {
    const detected = detectContentFormat(message.content);
    if (message.isStreaming) {
      if (detected === 'markdown') formatLockRef.current = 'markdown';
      return formatLockRef.current ?? detected;
    }
    formatLockRef.current = null;
    return detected;
  }, [message.content, message.isStreaming]);

  /** 主消息区：按格式渲染 */
  const renderMainContent = () => {
    const content = message.content || '';
    const wrapClass =
      'text-sm dark:text-gray-100 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1.5 [&>:first-child]:mt-2 [&>:last-child]:mb-2 prose-pre:mt-2 prose-pre:mb-2 prose-blockquote:mt-2 prose-blockquote:mb-2';

    if (isUser) {
      return <p className="whitespace-pre-wrap break-words">{content}</p>;
    }

    switch (contentFormat) {
      case 'markdown':
        return (
          <div className={wrapClass}>
            <MarkdownRenderer
              source={normalizeMarkdownForStreaming(content)}
              streaming={!!message.isStreaming}
              showToc={false}
              theme="auto"
              debounceMs={message.isStreaming ? 80 : 150}
              className="markdown-chat-message"
            />
          </div>
        );
      case 'html':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => setHtmlPreviewOpen(true)}
              >
                <Eye className="w-3 h-3" />
                预览 HTML
              </Button>
            </div>
            <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-64 overflow-y-auto rounded bg-gray-50 dark:bg-gray-900 p-3">
              {content}
            </pre>
            <HtmlPreviewDialog
              open={htmlPreviewOpen}
              onOpenChange={setHtmlPreviewOpen}
              html={content}
              title="HTML 预览"
            />
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap break-words">{content}</p>;
    }
  };

  return (
    <div className={cn('flex gap-4 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <Avatar className={cn('w-8 h-8 flex-shrink-0', isUser && 'ring-2 ring-blue-500')}>
        {isUser ? (
          <AvatarFallback className="bg-blue-500 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 flex gap-3 min-w-0',
          isUser && 'flex-row-reverse'
        )}
      >
        {/* 主消息区 */}
        <div className={cn('flex-1 space-y-2 min-w-0', isUser && 'flex flex-col items-end')}>
          {/* Header */}
          <div className="flex items-center gap-2 text-sm">
            <span className="dark:text-white">{isUser ? '你' : 'AI 助手'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-750 rounded-lg group/attachment"
                >
                  {attachment.type.startsWith('image/') ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm dark:text-white truncate max-w-[200px]">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover/attachment:opacity-100"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Message Text */}
          <div
            className={cn(
              'max-w-3xl',
              isUser
                ? 'bg-transparent px-0 py-2 text-gray-900 dark:text-gray-100'
                : 'rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            )}
          >
            <div
              className={cn(
                'flex items-start gap-3 min-h-[1.5em]',
                isUser ? 'px-0 py-2' : 'px-6 py-6'
              )}
            >
              <div className="flex-1 min-w-0">{renderMainContent()}</div>
            </div>
          </div>

          {/* Actions */}
          {!message.isStreaming && !isUser && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    复制
                  </>
                )}
              </Button>
              {isLastAssistant && (
                <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleRegenerate}>
                  <RotateCw className="w-3 h-3" />
                  重新生成
                </Button>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleDownloadMessage}>
                    <Download className="w-3 h-3" />
                    下载
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">下载消息</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-4"
                    onClick={() => handleLike(true)}
                  >
                    <ThumbsUp
                      className={cn('w-3 h-3', liked === true && 'fill-green-500 text-green-500')}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">点赞</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleLike(false)}
                  >
                    <ThumbsDown
                      className={cn('w-3 h-3', liked === false && 'fill-red-500 text-red-500')}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">点踩</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Streaming Indicator + 停止按钮 */}
          {message.isStreaming && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              正在生成...
              {onStopGenerate && message.id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onStopGenerate(message.id!)}
                >
                  停止
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 点踩反馈弹窗：需填写 800 字内说明 */}
        <Dialog open={dislikeDialogOpen} onOpenChange={setDislikeDialogOpen}>
          <DialogContent className="!max-w-[500px] w-full">
            <DialogHeader>
              <DialogTitle>反馈说明</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              请告诉我们哪里需要改进（选填，最多 800 字）
            </p>
            <Textarea
              value={dislikeComment}
              onChange={e => setDislikeComment(e.target.value)}
              placeholder="输入您的反馈..."
              className="min-h-[120px] resize-y"
              rows={5}
              maxLength={800}
            />
            <p className="text-xs text-gray-500">
              {dislikeComment.length}/800
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDislikeDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleDislikeSubmit}>
                提交反馈
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

/** 使用 React.memo 避免输入时重渲染所有消息，减轻输入延迟 */
export const ChatMessage = React.memo(ChatMessageInner);

/**
 * 流式输出时补齐未闭合的 Markdown 结构，避免解析失败导致格式错乱
 */
function normalizeMarkdownForStreaming(content: string): string {
  if (!content?.trim()) return content;
  const openCount = (content.match(/```/g) || []).length;
  if (openCount % 2 !== 0) {
    const trimmed = content.trimEnd();
    return trimmed.endsWith('```') ? trimmed : trimmed + '\n```';
  }
  return content;
}

