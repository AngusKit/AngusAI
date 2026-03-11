/**
 * 格式化相对时间
 * @param dateString 日期字符串或时间戳（数字）
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 格式化后的相对时间字符串
 */
export const formatRelativeTime = (
  dateString: string | number | undefined,
  language: string
): string => {
  if (!dateString) return language === 'zh-CN' ? '未知' : 'Unknown';
  
  // 处理字符串或数字类型的日期
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return language === 'zh-CN' ? '未知' : 'Unknown';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return language === 'zh-CN' ? '刚刚' : 'Just now';
  if (diffMins < 60)
    return language === 'zh-CN'
      ? `${diffMins}分钟前`
      : `${diffMins} minutes ago`;
  if (diffHours < 24)
    return language === 'zh-CN'
      ? `${diffHours}小时前`
      : `${diffHours} hours ago`;
  if (diffDays < 30)
    return language === 'zh-CN' ? `${diffDays}天前` : `${diffDays} days ago`;
  if (diffMonths < 12)
    return language === 'zh-CN'
      ? `${diffMonths}个月前`
      : `${diffMonths} months ago`;
  if (diffYears >= 1)
    return language === 'zh-CN' ? `${diffYears}年前` : `${diffYears} years ago`;
  return date.toLocaleDateString();
};

/**
 * 简化版相对时间（中文，无语言参数）
 * @param dateStr 日期字符串
 * @returns 如 "刚刚"、"2分钟前"、"3小时前"、"5天前"，空返回 '-'
 */
export const formatRelativeTimeShort = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString();
};

/**
 * 格式化日期为 YYYY-MM-DD
 * @param dateStr 日期字符串
 * @returns 日期字符串或 '-'
 */
export const formatDateShort = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toISOString().split('T')[0] ?? '-';
  } catch {
    return '-';
  }
};

/**
 * 获取名字首字母作为头像 fallback
 * @param name 姓名
 * @param email 邮箱（name 为空时使用）
 * @returns 1-2 个字符
 */
export const getInitials = (name?: string, email?: string): string => {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const a = parts[0]?.[0] ?? '';
      const b = parts[parts.length - 1]?.[0] ?? '';
      return (a + b).toUpperCase() || '?';
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email?.[0]) return email[0].toUpperCase();
  return '?';
};

/**
 * 格式化数值（添加千位分隔符）
 * @param value 数值
 * @returns 格式化后的字符串
 */
export const formatValue = (value: number | undefined): string => {
  if (!value) return '0';
  return value.toLocaleString();
};

/**
 * 格式化变化百分比
 * @param change 变化值
 * @returns 格式化后的百分比字符串
 */
export const formatChange = (change: string | undefined): string => {
  if (!change) return '0%';
  // 确保有 % 符号
  const changeStr = change.includes('%') ? change : `${change}%`;
  // 确保有 +/- 符号
  return changeStr.startsWith('-') || changeStr.startsWith('+')
    ? changeStr
    : `+${changeStr}`;
};

/**
 * 安全地将字符串转换为数字
 * @param value 可能是字符串或数字的值
 * @param defaultValue 默认值
 * @returns 数字值
 */
export const safeParseInt = (
  value: string | number | undefined,
  defaultValue: number = 0
): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseInt(value, 10) || defaultValue;
  return defaultValue;
};

/**
 * 安全地将字符串转换为浮点数
 * @param value 可能是字符串或数字的值
 * @param defaultValue 默认值
 * @returns 浮点数值
 */
export const safeParseFloat = (
  value: string | number | undefined,
  defaultValue: number = 0
): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || defaultValue;
  return defaultValue;
};

/**
 * 将前端时间范围转换为 API 格式
 * @param range 前端时间范围 ('7days' | '30days' | '90days' | '1year')
 * @returns API 时间范围格式 ('week' | 'month' | 'quarter' | 'year')
 */
export const convertTimeRangeToAPI = (range: string): string => {
  const mapping: Record<string, string> = {
    '7days': 'week',
    '30days': 'month',
    '90days': 'quarter',
    '1year': 'year',
  };
  return mapping[range] || 'month';
};

/**
 * 月份名称映射（英文简写 -> 数字 1-12）
 */
export const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

/**
 * 月份名称映射（英文简写 -> 数字 0-11，用于 Date 对象）
 */
export const MONTH_NAME_TO_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/**
 * 英文简写月份数组
 */
export const MONTH_ABBREVIATIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * 获取月份名称数组（根据语言）
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 月份名称数组
 */
export const getMonthNames = (language: string): string[] => {
  if (language === 'zh-CN') {
    return [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
  }
  return MONTH_ABBREVIATIONS;
};

/**
 * 获取星期标签数组（根据语言）
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 星期标签数组（周日到周六）
 */
export const getDayLabels = (language: string): string[] => {
  if (language === 'zh-CN') {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * 格式化日期为显示字符串
 * @param date 日期对象或日期相关数据
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 格式化后的日期字符串
 */
export const formatDateDisplay = (
  date:
    | Date
    | { year?: number | string; month?: string; dayOfMonth?: number | string },
  language: string
): string => {
  let year: number;
  let month: number;
  let dayOfMonth: number;

  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dayOfMonth = date.getDate();
  } else {
    year =
      typeof date.year === 'number'
        ? date.year
        : parseInt(String(date.year || ''), 10);
    month = date.month ? MONTH_NAME_TO_NUMBER[date.month] || 1 : 1;
    dayOfMonth =
      typeof date.dayOfMonth === 'number'
        ? date.dayOfMonth
        : parseInt(String(date.dayOfMonth || ''), 10);
  }

  if (!year || !month || !dayOfMonth) {
    return '';
  }

  if (language === 'zh-CN') {
    return `${year}年${month}月${dayOfMonth}日`;
  } else {
    const dateObj =
      date instanceof Date ? date : new Date(year, month - 1, dayOfMonth);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/** 标签预设颜色（用于 API 返回无 color 时由前端分配） */
export const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
] as const;

/**
 * 根据标签文本获取颜色类名（前端处理标签配色）
 */
export const getTagColor = (label: string): string => {
  const hash = (label ?? '')
    .split('')
    .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const idx = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[Math.max(0, idx)] ?? TAG_COLORS[0];
};

/**
 * 格式化最后使用时间显示
 * - 若为 ISO 日期字符串则转为相对时间（如 2小时前）
 * - 若已是格式化文本则原样返回
 */
export const formatLastUsedDisplay = (value?: string): string => {
  if (!value) return '-';
  const trimmed = value.trim();
  if (!trimmed) return '-';
  // ISO 格式包含 T 或为纯数字时间戳
  const isIso = /^\d{4}-\d{2}-\d{2}(T|\s)/.test(trimmed) || /^\d+$/.test(trimmed);
  if (isIso) return formatRelativeTimeShort(trimmed);
  return trimmed;
};

/**
 * 根据活动级别获取颜色类名
 * @param level 活动级别（0-4）
 * @returns Tailwind CSS 颜色类名
 */
export const getLevelColor = (level: number): string => {
  if (level === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (level === 1) return 'bg-green-200 dark:bg-green-900';
  if (level === 2) return 'bg-green-400 dark:bg-green-700';
  if (level === 3) return 'bg-green-600 dark:bg-green-500';
  if (level === 4) return 'bg-green-800 dark:bg-green-400';
  return 'bg-gray-100 dark:bg-gray-800';
};

/**
 * 获取当前时间问候语
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 问候语字符串
 */
export const getGreeting = (language: string): string => {
  const hour = new Date().getHours();
  if (language === 'zh-CN') {
    if (hour >= 0 && hour < 6) return '凌晨好';
    if (hour >= 6 && hour < 9) return '早上好';
    if (hour >= 9 && hour < 12) return '上午好';
    if (hour >= 12 && hour < 14) return '中午好';
    if (hour >= 14 && hour < 18) return '下午好';
    return '晚上好';
  } else {
    if (hour >= 0 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
};

/**
 * 格式化当前日期
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 格式化后的日期字符串
 */
export const getFormattedDate = (language: string): string => {
  const now = new Date();
  if (language === 'zh-CN') {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    const weekday = weekdays[now.getDay()];
    return `今天是 ${year}年${month}月${day}日${weekday}`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return `Today is ${now.toLocaleDateString('en-US', options)}`;
  }
};
