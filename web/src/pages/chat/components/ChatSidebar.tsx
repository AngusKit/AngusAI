import { MessageSquare, Plus, Trash2, MoreVertical, ChevronLeft, Search, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu.tsx';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/components/ui/utils.ts';

interface Session {
  id: string;
  title: string;
  appId: string;
  agentId?: string;
  modelId: string;
  messages?: any[];
  messageCount?: number;
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
}

interface ChatSidebarProps {
  sessions: Session[];
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onToggleStar: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  searchKeyword?: string;
  onSearchChange?: (value: string) => void;
  /** 滚动到底部附近时加载更多会话 */
  onSessionListScroll?: () => void;
  sessionsLoadMore?: boolean;
  hasMoreSessions?: boolean;
  /** 分页返回的会话总数（用于标题展示） */
  sessionTotal?: number;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onToggleStar,
  isOpen,
  onToggle,
  searchKeyword = '',
  onSearchChange,
  onSessionListScroll,
  sessionsLoadMore,
  hasMoreSessions,
  sessionTotal = 0,
}: ChatSidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const sessionListRef = useRef<HTMLDivElement>(null);

  // 内容未超出时无法滚动，需在布局完成后检测并加载下一页
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = sessionListRef.current;
      if (!el || !onSessionListScroll || sessionsLoadMore || hasMoreSessions === false) return;
      if (el.scrollHeight <= el.clientHeight && sessions.length > 0) {
        onSessionListScroll();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [sessions.length, sessionsLoadMore, hasMoreSessions, onSessionListScroll]);

  const handleSessionListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!onSessionListScroll || sessionsLoadMore || hasMoreSessions === false) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      onSessionListScroll();
    }
  };

  const filteredSessions = sessions;

  const groupedSessions = {
    today: filteredSessions.filter(s => isToday(s.updatedAt)),
    yesterday: filteredSessions.filter(s => isYesterday(s.updatedAt)),
    lastWeek: filteredSessions.filter(s => isLastWeek(s.updatedAt)),
    older: filteredSessions.filter(s => !isToday(s.updatedAt) && !isYesterday(s.updatedAt) && !isLastWeek(s.updatedAt)),
  };

  function isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function isYesterday(date: Date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  function isLastWeek(date: Date) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date > weekAgo && date < yesterday;
  }

  const handleRename = (sessionId: string, currentTitle: string) => {
    setRenamingId(sessionId);
    setRenameValue(currentTitle);
  };

  const submitRename = (sessionId: string) => {
    if (renameValue.trim()) {
      onRenameSession(sessionId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const SessionItem = ({ session }: { session: Session }) => (
    <div
      onClick={() => !renamingId && onSessionSelect(session.id)}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
        currentSessionId === session.id
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
      )}
    >
      {session.isStarred && <Star className='w-4 h-4 flex-shrink-0 fill-yellow-400 text-yellow-400' />}
      {!session.isStarred && <MessageSquare className='w-4 h-4 flex-shrink-0' />}
      <div className='flex-1 min-w-0'>
        {renamingId === session.id ? (
          <Input
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submitRename(session.id);
              } else if (e.key === 'Escape') {
                setRenamingId(null);
              }
            }}
            onBlur={() => submitRename(session.id)}
            className='h-7 text-sm'
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <>
            <p className='text-sm truncate'>{session.title}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {(session.messageCount ?? session.messages?.length ?? 0)} 条消息
            </p>
          </>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 opacity-0 group-hover:opacity-100'
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              onToggleStar(session.id);
            }}
          >
            <Star className={cn('w-4 h-4 mr-2', session.isStarred && 'fill-yellow-400 text-yellow-400')} />
            {session.isStarred ? '取消收藏' : '收藏'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              handleRename(session.id, session.title);
            }}
          >
            <MessageSquare className='w-4 h-4 mr-2' />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-red-600 dark:text-red-400'
            onClick={e => {
              e.stopPropagation();
              onDeleteSession(session.id);
            }}
          >
            <Trash2 className='w-4 h-4 mr-2' />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const SessionGroup = ({ title, sessions }: { title: string; sessions: Session[] }) => {
    if (sessions.length === 0) return null;
    return (
      <div className='mb-4'>
        <h3 className='text-xs text-gray-500 dark:text-gray-400 px-3 mb-2 flex items-center gap-2'>
          <Clock className='w-2.5 h-2.5' />
          {title}
        </h3>
        <div className='space-y-1'>
          {sessions.map(session => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className='w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4'>
        <Button variant='ghost' size='icon' onClick={onToggle} className='mb-4'>
          <MessageSquare className='w-5 h-5' />
        </Button>
        <Button variant='ghost' size='icon' onClick={onNewSession}>
          <Plus className='w-5 h-5' />
        </Button>
      </div>
    );
  }

  return (
    <div className='w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col'>
      {/* Header - h-14 与右侧 ChatSwitcher 顶部栏对齐，border-b 与下方边框对齐 */}
      <div className='shrink-0'>
        <div className='h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-1xl dark:text-white flex items-center gap-2'>
            <MessageSquare className='w-6 h-6' />
            对话列表
            <div className='text-sm text-gray-500 dark:text-gray-400 text-center'>({Number(sessionTotal) > 0 ? Number(sessionTotal) : sessions.length})</div>
          </h2>
          <Button variant='ghost' size='icon' onClick={onToggle} className='h-8 w-8 shrink-0'>
            <ChevronLeft className='w-4 h-4' />
          </Button>
        </div>
        <div className='flex gap-2 p-3 mt-2'>
          <div className='flex-1 relative min-w-0'>
            <Search className='absolute ml-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
            <Input
              placeholder='搜索对话...'
              value={searchKeyword}
              onChange={e => onSearchChange?.(e.target.value)}
              className='h-8 pl-8 text-xs dark:bg-gray-800 dark:border-gray-700'
            />
          </div>
          <Button
            onClick={onNewSession}
            size='icon'
            className='h-8 w-8 shrink-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
          >
            <Plus className='w-4 h-4' />
          </Button>
        </div>
      </div>

      {/* Sessions List - 原生滚动+隐藏滚动条，支持滚动加载 */}
      {filteredSessions.length > 0 ? (
        <div
          ref={sessionListRef}
          className='flex-1 overflow-y-auto min-h-0 scrollbar-hide'
          onScroll={handleSessionListScroll}
        >
          <div className='p-4'>
            <SessionGroup title='今天' sessions={groupedSessions.today} />
            <SessionGroup title='昨天' sessions={groupedSessions.yesterday} />
            <SessionGroup title='最近7天' sessions={groupedSessions.lastWeek} />
            <SessionGroup title='更早' sessions={groupedSessions.older} />
            {sessionsLoadMore && (
              <div className='py-3 text-center text-xs text-gray-500 dark:text-gray-400'>加载中...</div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center p-4'>
          <MessageSquare className='w-12 h-12 mb-3 text-gray-300 dark:text-gray-600' />
          <p className='text-xs text-gray-500 dark:text-gray-400'>{searchKeyword ? '未找到相关对话' : '暂无对话'}</p>
        </div>
      )}
    </div>
  );
}
