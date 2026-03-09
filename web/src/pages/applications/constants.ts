/**
 * 应用模块常量
 */

/** 应用图标选项（emoji + 标签） */
export const ICON_OPTIONS = [
  { emoji: '🤖', label: '机器人' },
  { emoji: '💬', label: '对话' },
  { emoji: '✨', label: '创意' },
  { emoji: '📚', label: '知识' },
  { emoji: '⚡', label: '闪电' },
  { emoji: '🎯', label: '目标' },
  { emoji: '📊', label: '分析' },
  { emoji: '💼', label: '办公' },
  { emoji: '🌐', label: '全球' },
  { emoji: '🔧', label: '工具' },
  { emoji: '📝', label: '文档' },
  { emoji: '🎨', label: '设计' },
] as const;

/** 标签最大数量 */
export const TAG_MAX_COUNT = 5;
/** 单个标签最大字符数 */
export const TAG_MAX_LENGTH = 40;
/** 应用名称最大字符数 */
export const NAME_MAX_LENGTH = 100;
/** 应用描述最大字符数 */
export const DESC_MAX_LENGTH = 800;

/** 应用列表每页条数 */
export const ITEMS_PER_PAGE = 12;
