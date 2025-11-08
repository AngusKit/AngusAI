/**
 * 页面工具函数
 */

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
