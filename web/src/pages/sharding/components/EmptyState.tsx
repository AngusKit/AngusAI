import { Share2 } from 'lucide-react';

/** 空状态展示 */
export function EmptyState() {
  return (
    <div className="p-12 text-center">
      <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg mb-2 dark:text-white">未找到共享资源</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        尝试调整搜索条件或筛选器
      </p>
    </div>
  );
}
