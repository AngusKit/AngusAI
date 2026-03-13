/**
 * 消息内容格式识别
 * 支持 Markdown、HTML、Plain 三种格式，用于对话消息的解析与渲染管道
 */
export type ContentFormat = 'markdown' | 'html' | 'plain';

/** HTML 标签正则，匹配常见块级/行内标签 */
const HTML_TAG_REGEX =
  /<\/?(?:div|p|span|h[1-6]|ul|ol|li|table|tr|td|th|a|strong|em|b|i|u|img|script|style|html|body|head|br|hr|pre|code|blockquote|form|input|button)[^>]*>/i;

/** Markdown 特征正则 */
const MARKDOWN_PATTERNS = [
  /^#{1,6}\s+.+/m, // 标题 # ## ###
  /\*\*[^*]+\*\*|\*[^*]+\*/, // 粗体/斜体
  /`[^`]+`/, // 行内代码
  /^[-*+]\s+/m, // 无序列表
  /^\d+\.\s+/m, // 有序列表
  /\[.+?\]\(.+?\)/, // 链接 [text](url)
  /^```[\s\S]*?```/m, // 代码块
  /^>\s+/m, // 引用
  /\|\s*.+\s*\|/, // 表格
  /^---+$/m, // 分隔线
];

/**
 * 识别消息内容的格式类型
 * @param content 原始消息文本
 * @returns 'markdown' | 'html' | 'plain'
 */
export function detectContentFormat(content: string): ContentFormat {
  const trimmed = content.trim();
  if (!trimmed) return 'plain';

  // 优先检测 HTML：包含完整标签结构
  if (HTML_TAG_REGEX.test(trimmed)) {
    return 'html';
  }

  // 检测 Markdown 特征
  for (const pattern of MARKDOWN_PATTERNS) {
    if (pattern.test(trimmed)) {
      return 'markdown';
    }
  }

  return 'plain';
}
