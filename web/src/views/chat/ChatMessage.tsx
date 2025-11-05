import { User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCw, Check, Download } from 'lucide-react';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { useState, useMemo } from 'react';
import { cn } from '@/ui/utils';
import { toast } from 'sonner';
import { copyToClipboard } from '../../lib/clipboard';

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

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

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

  const handleLike = (isLike: boolean) => {
    setLiked(isLike);
    toast.success(isLike ? '感谢你的反馈' : '我们会改进');
  };

  const handleRegenerate = () => {
    toast.success('正在重新生成回答...');
  };

  const isUser = message.role === 'user';

  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    // Split by code blocks first
    const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      // Add code block
      parts.push({ type: 'code', content: match[2], language: match[1] || 'text' });
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="my-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                {part.language}
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono">{part.content}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Format inline text elements
      let formattedText = part.content;
      
      // Bold
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic
      formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Inline code
      formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
      
      // Links
      formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

      // Split by newlines and create paragraphs
      const lines = formattedText.split('\n');
      return lines.map((line, lineIdx) => {
        // Check for list items
        if (line.trim().match(/^[-*]\s/)) {
          const listContent = line.replace(/^[-*]\s/, '');
          return (
            <li key={`${idx}-${lineIdx}`} className="ml-4" dangerouslySetInnerHTML={{ __html: listContent }} />
          );
        }
        // Regular paragraph
        if (line.trim()) {
          return (
            <p key={`${idx}-${lineIdx}`} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
          );
        }
        return <br key={`${idx}-${lineIdx}`} />;
      });
    });
  };

  return (
    <div
      className={cn(
        'flex gap-4 group',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
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
      <div className={cn('flex-1 space-y-2', isUser && 'flex flex-col items-end')}>
        {/* Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="dark:text-white">
            {isUser ? '你' : 'AI 助手'}
          </span>
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
            'rounded-2xl px-4 py-3 max-w-3xl',
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="text-sm dark:text-gray-100">
              {formatContent(message.content)}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={handleCopy}
            >
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
                className={cn(
                  'w-3 h-3',
                  liked === true && 'fill-green-500 text-green-500'
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleLike(false)}
            >
              <ThumbsDown
                className={cn(
                  'w-3 h-3',
                  liked === false && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={handleRegenerate}
            >
              <RotateCw className="w-3 h-3" />
              重新生成
            </Button>
          </div>
        )}

        {/* Streaming Indicator */}
        {message.isStreaming && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            正在生成...
          </div>
        )}
      </div>
    </div>
  );
}
