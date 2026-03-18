'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SelectOption } from './MonitorTypes';

const PAGE_SIZE = 10;

export type LazySelectFetcher = (params: {
  pageNo: number;
  pageSize: number;
  keyword?: string;
}) => Promise<{ list: SelectOption[]; total?: number }>;

export interface MonitorLazySelectProps {
  value: string;
  onValueChange: (v: string) => void;
  fetcher: LazySelectFetcher;
  placeholder: string;
  searchPlaceholder?: string;
  allOptionLabel?: string;
  className?: string;
}

export function MonitorLazySelect({
  value,
  onValueChange,
  fetcher,
  placeholder,
  searchPlaceholder,
  allOptionLabel,
  className,
}: MonitorLazySelectProps) {
  const { language } = useLanguage();
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchApplied, setSearchApplied] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);

  const loadOptions = useCallback(
    async (pageNo: number, append: boolean, keyword?: string) => {
      setLoading(true);
      try {
        const res = await fetcher({ pageNo, pageSize: PAGE_SIZE, keyword });
        const list = res.list ?? [];
        const tot = res.total ?? list.length;
        setTotal(tot);
        setOptions((prev) => (append ? [...prev, ...list] : list));
      } catch {
        if (!append) setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        if (!hasOpened) {
          setHasOpened(true);
          setPage(1);
          loadOptions(1, false, searchApplied || undefined);
        }
      }
    },
    [hasOpened, loadOptions, searchApplied]
  );

  // 仅当关键字变化时防抖触发加载，避免与 handleOpenChange 重复请求
  useEffect(() => {
    const t = setTimeout(() => {
      const kw = searchKeyword.trim();
      setSearchApplied(kw);
      setPage(1);
      if (hasOpened) {
        loadOptions(1, false, kw || undefined);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchKeyword, loadOptions]); // 移除 hasOpened，防止打开时重复请求

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadOptions(nextPage, true, searchApplied || undefined);
  }, [page, loadOptions, searchApplied]);

  const searchPh = searchPlaceholder ?? (language === 'zh-CN' ? '搜索...' : 'Search...');
  const allLabel = allOptionLabel ?? (language === 'zh-CN' ? '全部' : 'All');
  const hasMore = options.length < total;

  return (
    <Select value={value} onValueChange={onValueChange} onOpenChange={handleOpenChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="max-h-[300px] overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-lazy-select-search]')) e.preventDefault();
        }}
      >
        <div className="p-2 border-b dark:border-gray-700" data-lazy-select-search>
          <Input
            placeholder={searchPh}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="dark:bg-gray-900 dark:border-gray-700"
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
        <SelectItem value="all">{allLabel}</SelectItem>
        {loading && options.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {language === 'zh-CN' ? '加载中...' : 'Loading...'}
          </div>
        ) : (
          options.map((o) => (
            <SelectItem key={String(o.id)} value={String(o.id)}>
              {o.name}
            </SelectItem>
          ))
        )}
        {hasMore && options.length > 0 && (
          <div className="p-2 border-t dark:border-gray-700" onPointerDown={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={loading}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLoadMore();
              }}
            >
              {loading ? (language === 'zh-CN' ? '加载中...' : 'Loading...') : (language === 'zh-CN' ? '加载更多' : 'Load more')}
            </Button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
