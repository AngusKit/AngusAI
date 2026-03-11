import { Skeleton } from '@/components/ui/skeleton.tsx';

/** 表格加载骨架 */
export function ResourceTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400"
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-24 dark:bg-gray-700" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-14 rounded dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-12 rounded dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-14 dark:bg-gray-700" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-12 dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-8 h-8 rounded dark:bg-gray-700" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
