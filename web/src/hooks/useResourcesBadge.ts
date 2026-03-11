import { useState, useEffect, useCallback } from 'react';
import Analytics from '@/services/Analytics';
import type { ResourcesBadgeVo } from '@/services/AnalyticsTypes';

/**
 * 关键资源badge统计 Hook
 * 获取对话Session数、我的应用数、未读通知数，用于侧边栏菜单badge展示
 */
export function useResourcesBadge() {
  const [badge, setBadge] = useState<ResourcesBadgeVo>({
    sessionCount: 0,
    applicationCount: 0,
    notificationCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBadge = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await Analytics.getResourcesBadge();
      const data = (response as { data?: ResourcesBadgeVo })?.data;
      if (data) {
        setBadge({
          sessionCount: data.sessionCount ?? 0,
          applicationCount: data.applicationCount ?? 0,
          notificationCount: data.notificationCount ?? 0,
        });
      }
    } catch {
      setBadge({ sessionCount: 0, applicationCount: 0, notificationCount: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBadge();
  }, [fetchBadge]);

  /** 格式化badge显示：>99 显示 99+ */
  const formatBadge = (count?: number): string | undefined => {
    const n = count ?? 0;
    if (n <= 0) return undefined;
    return n > 99 ? '99+' : String(n);
  };

  return {
    sessionCount: badge.sessionCount,
    applicationCount: badge.applicationCount,
    notificationCount: badge.notificationCount,
    formatBadge,
    isLoading,
    refresh: fetchBadge,
  };
}
