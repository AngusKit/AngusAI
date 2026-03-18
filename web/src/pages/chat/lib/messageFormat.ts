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

/** 移除 Markdown 代码块内容，避免代码块内的 HTML 被误判为 HTML 格式 */
function stripCodeBlocks(text: string): string {
  return text.replace(/```[\w]*\n?[\s\S]*?```/g, '\n');
}

/**
 * 识别消息内容的格式类型
 * @param content 原始消息文本
 * @returns 'markdown' | 'html' | 'plain'
 */
export function detectContentFormat(content: string): ContentFormat {
  const trimmed = content.trim();
  if (!trimmed) return 'plain';

  // 若包含 Markdown 代码块（```...```），优先判为 Markdown，避免代码块内的 HTML 被误判为整条消息为 HTML
  if (/```[\s\S]*?```/.test(trimmed)) {
    return 'markdown';
  }

  // 流式输出时代码块可能未闭合，若出现 ```lang 形式也视为 Markdown
  if (/^```[\w]*\s*\n/m.test(trimmed)) {
    return 'markdown';
  }

  // 移除代码块后再检测：仅当非代码块区域包含 HTML 标签时判为 HTML
  const withoutCodeBlocks = stripCodeBlocks(trimmed);
  if (withoutCodeBlocks && HTML_TAG_REGEX.test(withoutCodeBlocks)) {
    return 'html';
  }

  // 检测其他 Markdown 特征
  for (const pattern of MARKDOWN_PATTERNS) {
    if (pattern.test(trimmed)) {
      return 'markdown';
    }
  }

  return 'plain';
}
