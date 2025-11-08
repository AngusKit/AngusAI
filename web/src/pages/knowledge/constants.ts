/**
 * 知识库相关常量
 */

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

// 向量存储源配置
export const VECTOR_STORES = [
  {
    id: '1',
    name: 'Production Pinecone',
    type: 'PINECONE',
    status: 'connected',
    icon: '🌲',
  },
  {
    id: '2',
    name: 'Dev Chroma DB',
    type: 'CHROMA',
    status: 'connected',
    icon: '🎨',
  },
  {
    id: '3',
    name: 'Azure OpenSearch',
    type: 'OPENSEARCH',
    status: 'disconnected',
    icon: '🔎',
  },
  {
    id: '4',
    name: 'Qdrant Cluster',
    type: 'QDRANT',
    status: 'connected',
    icon: '⚡',
  },
  {
    id: '5',
    name: 'MongoDB Atlas Vector',
    type: 'MONGODB_ATLAS',
    status: 'connected',
    icon: '🍃',
  },
] as const;

// 配置参数常量
export const CONFIG_CONSTANTS = {
  CHUNK_SIZE: {
    MIN: 100,
    MAX: 2000,
    DEFAULT: 512,
  },
  CHUNK_OVERLAP: {
    MIN: 0,
    MAX: 200,
    DEFAULT: 50,
  },
  TAG: {
    MAX_LENGTH: 10,
    MAX_COUNT: 5,
  },
} as const;

// 步骤配置
export const FORM_STEPS = [
  { number: 1, title: '基本信息' },
  { number: 2, title: '配置处理' },
] as const;

