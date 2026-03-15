import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Check,
  Download,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import type { ReactNode } from 'react';
import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/components/ui/utils.ts';
import { toast } from 'sonner';
import { copyToClipboard } from '../../../lib/clipboard.ts';
import { detectContentFormat, type ContentFormat } from '../lib/messageFormat.ts';

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
}

/** Markdown 渲染时的自定义组件 */
const markdownComponents: Parameters<typeof ReactMarkdown>[0]['components'] = {
  p: ({ children }: { children?: ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  code: ({ className, children, ...props }: { className?: string; children?: ReactNode }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    const match = /language-(\w+)/.exec(className ?? '');
    const lang = match?.[1] ?? '';
    const code = String(children ?? '').replace(/\n$/, '');
    return (
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: '0.5rem' }}
        className="!my-3 !rounded-lg overflow-x-auto text-sm [&>code]:!p-4"
      >
        {code}
      </SyntaxHighlighter>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <div className="[&>div]:!mt-0 [&>div]:!mb-0">{children}</div>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="my-2 list-disc pl-5 space-y-1">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="my-2 list-decimal pl-5 space-y-1">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-2 text-left text-sm font-medium border-b dark:border-gray-700">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-2 text-sm border-b dark:border-gray-700">{children}</td>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => <tr className="border-b dark:border-gray-700">{children}</tr>,
};

const ChatMessageInner = ({ message, isLastAssistant, onRegenerate, onFeedback }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(() => {
    const ft = message.feedbackType;
    if (ft === 'like') return true;
    if (ft === 'dislike') return false;
    return null;
  });
  const [dislikeDialogOpen, setDislikeDialogOpen] = useState(false);
  const [dislikeComment, setDislikeComment] = useState('');

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

  const isUser = message.role === 'user';

  // 识别 → 解析 → 渲染管道
  const contentFormat = useMemo<ContentFormat>(
    () => detectContentFormat(message.content),
    [message.content]
  );

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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {normalizeMarkdownForStreaming(content)}
            </ReactMarkdown>
          </div>
        );
      case 'html':
        return (
          <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-64 overflow-y-auto rounded bg-gray-50 dark:bg-gray-900 p-3">
            {content}
          </pre>
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
          <>
            <AvatarImage src="https://images.unsplash.com/photo-1652795385761-7ac287d0cd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhdmF0YXIlMjBjYXJ0b29ufGVufDF8fHx8MTc2MTEwMTExNXww&ixlib=rb-4.1.0&q=80&w=1080" />
            <AvatarFallback className="bg-blue-500 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </>
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
          {!isUser && (
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleLike(true)}
              >
                <ThumbsUp
                  className={cn('w-3 h-3', liked === true && 'fill-green-500 text-green-500')}
                />
              </Button>
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
              {isLastAssistant && (
                <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleRegenerate}>
                  <RotateCw className="w-3 h-3" />
                  重新生成
                </Button>
              )}
            </div>
          )}

          {/* Streaming Indicator */}
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

