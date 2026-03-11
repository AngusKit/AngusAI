import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Check, Search, Inbox, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce.ts';
import Models from '@/services/Models.ts';
import { ModelStatusEnum, ModelTypeEnum } from '@/enums/enums.ts';

/** 模型选择弹窗每页条数 */
const PAGE_SIZE = 10;
/** 弹窗最小高度 */
const DIALOG_MIN_HEIGHT = 480;
/** 选中态配色（橙色系） */
const ACCENT = {
  selected: 'text-blue-500',
  border: 'border-blue-500',
  hover: 'hover:border-blue-200 dark:hover:border-blue-800',
  bg: 'bg-blue-50 dark:bg-blue-900/20',
};

interface ModelSelectDialogProps {
  open: boolean;
  onClose: () => void;
  selectedModelId: string | null | undefined;
  selectedModelName?: string | null;
  onSelect: (modelId: string | null, modelName?: string) => void;
}

export function ModelSelectDialog({
  open,
  onClose,
  selectedModelId,
  selectedModelName,
  onSelect,
}: ModelSelectDialogProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [items, setItems] = useState<{ id: string; name?: string; description?: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (p: number, append: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (append) setLoadMore(true);
      else setLoading(true);
      try {
        const res = await Models.getModelList({
          type: ModelTypeEnum.CHAT,
          status: ModelStatusEnum.ACTIVE,
          pageNo: p,
          pageSize: PAGE_SIZE,
          keyword: debouncedSearch.trim() || undefined,
        });
        const data = (res as any)?.data;
        const list = ((data?.list ?? []) as { id?: string; name?: string; description?: string }[])
          .filter((i): i is { id: string; name?: string; description?: string } => i != null && i.id != null && i.id !== '')
          .map((i) => ({ id: String(i.id), name: i.name, description: i.description }));
        const t = data?.total ?? 0;
        if (append) {
          setItems((prev) => {
            const seen = new Set(prev.map((i) => i.id));
            return [...prev, ...list.filter((i) => !seen.has(i.id))];
          });
        } else {
          setItems(list);
        }
        setTotal(t);
      } catch (e) {
        console.error('Failed to load models:', e);
        toast.error('加载失败');
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadMore(false);
      }
    },
    [debouncedSearch]
  );

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!open) return;
    setPageNo(1);
    loadRef.current(1, false);
  }, [open, debouncedSearch]);

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  const loadMoreIfNeeded = useCallback(() => {
    if (loading || loadMore || items.length >= total) return;
    const nextPage = pageNo + 1;
    setPageNo(nextPage);
    load(nextPage, true);
  }, [loading, loadMore, items.length, total, pageNo, load]);

  useEffect(() => {
    if (!open || !scrollRef.current || !sentinelRef.current) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreIfNeeded();
      },
      { root: scrollRef.current, rootMargin: '100px', threshold: 0 }
    );
    ob.observe(sentinelRef.current);
    return () => ob.disconnect();
  }, [open, loadMoreIfNeeded]);

  const handleToggle = (id: string, name?: string) => {
    if (selectedModelId === id) {
      onSelect(null);
    } else {
      onSelect(id, name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col"
        style={{ minHeight: DIALOG_MIN_HEIGHT, height: DIALOG_MIN_HEIGHT }}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <Cpu className={ACCENT.selected} />
            选择默认模型
            {selectedModelId && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">（已选 1 个）</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="relative shrink-0 mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索模型名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 dark:bg-gray-900 dark:border-gray-700"
          />
        </div>
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto pr-2 -mx-2 mt-2"
          style={{ height: 320 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              {debouncedSearch.trim() ? (
                <>
                  <SearchX className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">无匹配结果</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">尝试更换关键词搜索</p>
                </>
              ) : (
                <>
                  <Inbox className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">暂无可用模型</p>
                  <Link
                    to="/models"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    去添加
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2 pr-2 pb-4">
              {items.map((item) => {
                const isSelected = selectedModelId === item.id;
                return (
                  <Card
                    key={item.id}
                    onClick={() => handleToggle(item.id, item.name)}
                    className={`p-3 cursor-pointer transition-all select-none hover:shadow-sm ${
                      isSelected
                        ? `border-2 ${ACCENT.border} ${ACCENT.bg}`
                        : `border border-gray-200 dark:border-gray-700 ${ACCENT.hover}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="dark:text-white truncate">{item.name ?? item.id ?? '--'}</span>
                      {isSelected && <Check className={`w-4 h-4 ${ACCENT.selected} shrink-0`} />}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </Card>
                );
              })}
              <div ref={sentinelRef} className="h-1" />
              {loadMore && <p className="text-sm text-gray-500 dark:text-gray-400 py-2">加载更多...</p>}
            </div>
          )}
        </div>
        <DialogFooter className="shrink-0">
          <Button onClick={onClose}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
