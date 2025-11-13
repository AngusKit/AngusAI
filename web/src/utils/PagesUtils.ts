/**
 * 页面工具函数
 */

import { EnabledStatusEnum } from "@/enums/enums";

/**
 * 标签颜色映射
 * 根据标签内容生成一个稳定的颜色索引
 * @param tag 标签文本
 * @returns Tailwind CSS 类名
 */
export const getTagColor = (tag: string): string => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  ];

  // 根据标签内容生成一个稳定的索引
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index]!;
};

/**
 * 格式化日期，只显示日期部分（YYYY-MM-DD）
 * @param dateString 日期时间字符串，格式如 "2025-11-07 23:16:03"
 * @returns 只包含日期部分的字符串，格式如 "2025-11-07"
 */
export const formatDateOnly = (dateString?: string): string => {
  if (!dateString) return '';
  const date = dateString.trim();
  // 如果包含时间部分（有空格），则只取日期部分
  const spaceIndex = date.indexOf(' ');
  if (spaceIndex > 0) {
    return date.substring(0, spaceIndex);
  }
  // 如果已经是日期格式，直接返回
  return date;
};

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串，如 "1.5 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};


/**
 * 格式化记录数显示
 */
export function formatToHumanString(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}


/**
 * 启用/禁用状态颜色映射
 */
export const DATASET_STATUS_COLORS: Record<EnabledStatusEnum, string> = {
  [EnabledStatusEnum.ENABLED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [EnabledStatusEnum.DISABLED]: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

// 图标选项配置 - 优化为更贴近知识库场景的图标
export const ICON_OPTIONS = [
  // 文档和书籍类
  { emoji: '📘', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '书籍' },
  { emoji: '📚', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '图书馆' },
  { emoji: '📖', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '打开的书' },
  { emoji: '📝', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '笔记' },
  { emoji: '📄', bg: 'bg-gray-100 dark:bg-gray-700/30', label: '文档' },
  { emoji: '📋', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '列表' },
  { emoji: '📑', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '书签' },
  { emoji: '📁', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '文件夹' },
  { emoji: '🗂️', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '文件分类' },
  { emoji: '📰', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '新闻' },

  // 学习和教育类
  { emoji: '🎓', bg: 'bg-green-100 dark:bg-green-900/30', label: '学术' },
  { emoji: '🧠', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '大脑' },
  { emoji: '💡', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '想法' },
  { emoji: '🔍', bg: 'bg-slate-100 dark:bg-slate-700/30', label: '搜索' },
  { emoji: '🔬', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '科研' },
  { emoji: '⚗️', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '化学' },
  { emoji: '📐', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '测量' },
  { emoji: '🧪', bg: 'bg-green-100 dark:bg-green-900/30', label: '实验' },

  // 工作和专业类
  { emoji: '💼', bg: 'bg-gray-100 dark:bg-gray-700/30', label: '公文包' },
  { emoji: '🏢', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '办公室' },
  { emoji: '📊', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '数据' },
  { emoji: '📈', bg: 'bg-green-100 dark:bg-green-900/30', label: '图表' },
  { emoji: '💻', bg: 'bg-slate-100 dark:bg-slate-700/30', label: '电脑' },
  { emoji: '💾', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '存储' },

  // 安全和权限类
  { emoji: '🔒', bg: 'bg-red-100 dark:bg-red-900/30', label: '安全' },
  { emoji: '🔑', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '钥匙' },
  { emoji: '🛡️', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '盾牌' },

  // 其他知识相关
  { emoji: '🌐', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '网络' },
  { emoji: '📌', bg: 'bg-red-100 dark:bg-red-900/30', label: '图钉' },
  { emoji: '✨', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '灵感' },
  { emoji: '🎯', bg: 'bg-red-100 dark:bg-red-900/30', label: '目标' },
] as const;
