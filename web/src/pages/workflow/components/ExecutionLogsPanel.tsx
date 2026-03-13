/**
 * 执行日志面板 - 展示执行历史
 */
import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ExecutionLogVo } from '@/services/WorkflowsTypes';
import { cn } from '@/components/ui/utils';

interface ExecutionLogsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: ExecutionLogVo[];
  loading: boolean;
  onLoad: () => void;
}

function formatTime(s?: string): string {
  if (!s) return '--';
  try {
    const d = new Date(s);
    return d.toLocaleString('zh-CN');
  } catch {
    return s;
  }
}

function statusColor(status?: string): string {
  if (!status) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
  const s = status.toUpperCase();
  if (s.includes('SUCCESS') || s.includes('COMPLETED')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (s.includes('FAIL') || s.includes('ERROR')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (s.includes('RUNNING')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
}

export function ExecutionLogsPanel({ open, onOpenChange, logs, loading, onLoad }: ExecutionLogsPanelProps) {
  useEffect(() => {
    if (open) onLoad();
  }, [open, onLoad]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>执行日志</SheetTitle>
          <SheetDescription>工作流历史执行记录</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] pr-4 mt-4">
          {loading ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">加载中...</div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">暂无执行记录</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div
                  key={log.executionId ?? log.id ?? i}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                      {log.executionId ?? log.id ?? '-'}
                    </span>
                    <Badge className={cn('shrink-0', statusColor(log.status))}>{log.status ?? '未知'}</Badge>
                  </div>
                  {log.workflowName && (
                    <div className="mt-1 text-sm font-medium dark:text-gray-200 truncate">{log.workflowName}</div>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatTime(log.createdDate)}</span>
                    {log.executionTime != null && <span>{log.executionTime}ms</span>}
                  </div>
                  {log.activity && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">{log.activity}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
