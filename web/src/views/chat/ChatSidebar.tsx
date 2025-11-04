import { MessageSquare, Plus, Trash2, MoreVertical, ChevronLeft, Search, Clock, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '../ui/utils';

interface Session {
  id: string;
  title: string;
  appId: string;
  modelId: string;
  messages: any[];
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
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {session.isStarred && (
        <Star className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
      )}
      {!session.isStarred && (
        <MessageSquare className="w-4 h-4 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
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
            className="h-7 text-sm"
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <>
            <p className="text-sm truncate">{session.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session.messages.length} 条消息
            </p>
          </>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              onToggleStar(session.id);
            }}
          >
            <Star className={cn("w-4 h-4 mr-2", session.isStarred && "fill-yellow-400 text-yellow-400")} />
            {session.isStarred ? '取消收藏' : '收藏'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              handleRename(session.id, session.title);
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400"
            onClick={e => {
              e.stopPropagation();
              onDeleteSession(session.id);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const SessionGroup = ({ title, sessions }: { title: string; sessions: Session[] }) => {
    if (sessions.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-xs text-gray-500 dark:text-gray-400 px-3 mb-2 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map(session => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewSession}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            对话列表
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索对话..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-750 dark:border-gray-600"
            />
          </div>
          <Button onClick={onNewSession} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <SessionGroup title="今天" sessions={groupedSessions.today} />
          <SessionGroup title="昨天" sessions={groupedSessions.yesterday} />
          <SessionGroup title="最近7天" sessions={groupedSessions.lastWeek} />
          <SessionGroup title="更早" sessions={groupedSessions.older} />

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? '未找到相关对话' : '暂无对话'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          共 {sessions.length} 个对话
        </div>
      </div>
    </div>
  );
}
