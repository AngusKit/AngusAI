import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function Pagination ({ currentPage, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  const { t } = useLanguage();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t('common.pagination.showingItems', {
          start: String(startItem),
          end: String(endItem),
          total: String(totalItems)
        } as Record<string, string>)}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4"/>
        </Button>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t('common.pagination.pageInfo', {
            current: String(currentPage),
            total: String(totalPages)
          } as Record<string, string>)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  );
}
