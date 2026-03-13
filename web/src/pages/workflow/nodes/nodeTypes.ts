/**
 * 工作流节点类型定义
 * 与后端 NodeType / WorkflowSpecRegistry 对应
 */
import {
  Play,
  Square,
  Brain,
  Bot,
  Wrench,
  Globe,
  Code2,
  GitBranch,
  GitMerge,
  Repeat,
  RotateCw,
  Clock,
  Workflow,
  Variable,
  Library,
  type LucideIcon,
} from 'lucide-react';

export type NodeCategory = 'flow' | 'ai' | 'integration';

/** 端口数据类型（预留，用于未来类型兼容校验） */
export type PortDataType = 'any' | 'string' | 'json' | 'number' | 'boolean' | 'image';

export interface NodeTypeHandle {
  id: string;
  label: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  /** 端口数据类型，默认 any 表示兼容所有类型 */
  dataType?: PortDataType;
}

export interface NodeTypeDef {
  type: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  /** 输入 Handle：默认左侧单点 */
  inputHandles?: NodeTypeHandle[];
  /** 输出 Handle：默认右侧单点；CONDITION 为 true/false；SWITCH/PARALLEL 为多分支 */
  outputHandles?: NodeTypeHandle[];
  /** 默认 config 模板 */
  defaultConfig?: Record<string, unknown>;
  /** 是否在节点面板中隐藏（未来支持等） */
  hidden?: boolean;
}

/** 节点类型按分类分组 */
export const NODE_CATEGORIES: { key: NodeCategory; label: string }[] = [
  { key: 'flow', label: '流程控制' },
  { key: 'ai', label: 'AI/智能' },
  { key: 'integration', label: '集成' },
];

export const NODE_TYPES: NodeTypeDef[] = [
  {
    type: 'START',
    label: '开始',
    description: '工作流入口节点',
    category: 'flow',
    icon: Play,
    color: '#3b82f6',
    borderColor: '#2563eb',
    inputHandles: [],
    outputHandles: [{ id: 'output', label: '输出', position: 'right' }],
  },
  {
    type: 'END',
    label: '结束',
    description: '工作流终止节点',
    category: 'flow',
    icon: Square,
    color: '#ef4444',
    borderColor: '#dc2626',
    inputHandles: [{ id: 'input', label: '输入', position: 'left' }],
    outputHandles: [],
  },
  {
    type: 'LLM',
    label: '大模型',
    description: '调用大语言模型生成文本',
    category: 'ai',
    icon: Brain,
    color: '#8b5cf6',
    borderColor: '#7c3aed',
    defaultConfig: { prompt: '', model: '' },
  },
  {
    type: 'AGENT',
    label: '智能体',
    description: '调用已注册的 Agent',
    category: 'ai',
    icon: Bot,
    color: '#0ea5e9',
    borderColor: '#0284c7',
    defaultConfig: { agentId: '', message: '' },
  },
  {
    type: 'KNOWLEDGE_RETRIEVAL',
    label: '知识库检索',
    description: '从知识库检索相关内容',
    category: 'ai',
    icon: Library,
    color: '#6366f1',
    borderColor: '#4f46e5',
    defaultConfig: { query: '', topK: 5 },
  },
  {
    type: 'CONDITION',
    label: '条件分支',
    description: '根据表达式选择路径',
    category: 'flow',
    icon: GitBranch,
    color: '#f59e0b',
    borderColor: '#d97706',
    outputHandles: [
      { id: 'true', label: '是', position: 'right' },
      { id: 'false', label: '否', position: 'right' },
    ],
    defaultConfig: { expression: '', ifTrue: '', ifFalse: '' },
  },
  {
    type: 'SWITCH',
    label: '多路分支',
    description: '根据值匹配多个分支',
    category: 'flow',
    icon: GitMerge,
    color: '#f97316',
    borderColor: '#ea580c',
    outputHandles: [{ id: 'output', label: '输出', position: 'right' }],
    defaultConfig: { expression: '', cases: {}, default: '' },
  },
  {
    type: 'LOOP',
    label: '循环',
    description: 'for-each 遍历',
    category: 'flow',
    icon: Repeat,
    color: '#14b8a6',
    borderColor: '#0d9488',
    defaultConfig: { items: '', itemVariable: 'item', body: '' },
  },
  {
    type: 'WHILE',
    label: '条件循环',
    description: 'while 条件循环',
    category: 'flow',
    icon: RotateCw,
    color: '#06b6d4',
    borderColor: '#0891b2',
    defaultConfig: { condition: '', body: '', maxIterations: 100 },
  },
  {
    type: 'PARALLEL',
    label: '并行',
    description: '并行执行多个分支',
    category: 'flow',
    icon: GitMerge,
    color: '#ec4899',
    borderColor: '#db2777',
    outputHandles: [{ id: 'output', label: '输出', position: 'right' }],
    defaultConfig: { branches: [], joinStrategy: 'ALL' },
  },
  {
    type: 'WAIT',
    label: '等待',
    description: '人工审批或延时',
    category: 'flow',
    icon: Clock,
    color: '#a855f7',
    borderColor: '#9333ea',
    defaultConfig: { waitType: 'DELAY', delaySeconds: 0 },
  },
  {
    type: 'HTTP',
    label: 'HTTP 请求',
    description: '发起 HTTP 请求',
    category: 'integration',
    icon: Globe,
    color: '#22c55e',
    borderColor: '#16a34a',
    defaultConfig: { url: '', method: 'GET' },
  },
  {
    type: 'TOOL',
    label: '工具',
    description: '调用注册的工具',
    category: 'integration',
    icon: Wrench,
    color: '#eab308',
    borderColor: '#ca8a04',
    defaultConfig: { toolId: '', params: {} },
  },
  {
    type: 'CODE',
    label: '代码',
    description: '执行代码片段',
    category: 'integration',
    icon: Code2,
    color: '#64748b',
    borderColor: '#475569',
    defaultConfig: { language: 'javascript', script: '' },
  },
  {
    type: 'SUB_WORKFLOW',
    label: '子工作流',
    description: '调用子工作流（未来支持）',
    category: 'integration',
    icon: Workflow,
    color: '#2dd4bf',
    borderColor: '#14b8a6',
    defaultConfig: { workflowId: '', inputMapping: {} },
    hidden: true, // 未来支持
  },
  {
    type: 'SET_VARIABLE',
    label: '设置变量',
    description: '设置变量值',
    category: 'integration',
    icon: Variable,
    color: '#84cc16',
    borderColor: '#65a30d',
    defaultConfig: { assignments: {} },
  },
];

export function getNodeTypeDef(type: string): NodeTypeDef | undefined {
  return NODE_TYPES.find(n => n.type === type);
}

/** 节点面板可见的节点类型（排除 hidden 的节点） */
export function getNodesByCategory(): Record<NodeCategory, NodeTypeDef[]> {
  const map: Record<NodeCategory, NodeTypeDef[]> = {
    flow: [],
    ai: [],
    integration: [],
  };
  for (const n of NODE_TYPES) {
    if (!n.hidden) map[n.category].push(n);
  }
  return map;
}
