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
  // 新增：智能体与应用类型
  { emoji: '🧠', label: '智能' },
  { emoji: '💡', label: '灵感' },
  { emoji: '🔮', label: '预测' },
  { emoji: '🌟', label: '星标' },
  { emoji: '🚀', label: '启动' },
  { emoji: '📱', label: '移动' },
  { emoji: '🎭', label: '角色' },
  { emoji: '📖', label: '阅读' },
  { emoji: '🔒', label: '安全' },
  { emoji: '🌈', label: '多元' },
  { emoji: '📧', label: '沟通' },
  { emoji: '🔍', label: '搜索' },
  { emoji: '💻', label: '技术' },
  { emoji: '🏆', label: '成就' },
  { emoji: '🎓', label: '学习' },
  { emoji: '🧩', label: '整合' },
  { emoji: '🤝', label: '协作' },
  { emoji: '🦉', label: '智慧' },
  { emoji: '⚙️', label: '配置' },
  { emoji: '🌱', label: '成长' },
  // 新增：行业
  { emoji: '🏥', label: '医疗' },
  { emoji: '🏦', label: '金融' },
  { emoji: '✈️', label: '旅游' },
  { emoji: '🛒', label: '零售' },
  { emoji: '🎮', label: '游戏' },
  { emoji: '🏫', label: '教育' },
  { emoji: '🏭', label: '制造' },
  { emoji: '🌾', label: '农业' },
  { emoji: '⚖️', label: '法律' },
  { emoji: '🎬', label: '传媒' },
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
