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

/** 配置参数字段类型 */
export type ConfigParamType = 'string' | 'number' | 'textarea' | 'json' | 'select' | 'array';

/** 配置参数定义 — 用于表单渲染、校验、枚举选择 */
export interface ConfigParamDef {
  key: string;
  label: string;
  type: ConfigParamType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  /** 枚举选项：{ value, label } */
  enum?: readonly { value: string; label: string }[] | { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: unknown;
}

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
  /** 配置参数定义（空或 undefined 时隐藏配置区域） */
  configParams?: ConfigParamDef[];
  /** 默认 config 模板 */
  defaultConfig?: Record<string, unknown>;
  /** 是否在节点面板中隐藏（未来支持等） */
  hidden?: boolean;
}

// --------------- 枚举类型（与后端 WaitType、HTTP 等对齐） ---------------
export const WAIT_TYPE_ENUM = [
  { value: 'DELAY', label: '延时等待' },
  { value: 'APPROVAL', label: '人工审批' },
  { value: 'EVENT', label: '等待外部事件' },
  { value: 'WAITING', label: '通用等待' },
] as const;

export const HTTP_METHOD_ENUM = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
] as const;

export const CODE_LANGUAGE_ENUM = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'groovy', label: 'Groovy' },
] as const;

export const PARALLEL_JOIN_STRATEGY_ENUM = [
  { value: 'ALL', label: '全部完成（ALL）' },
  { value: 'ANY', label: '任一完成（ANY）' },
] as const;

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
    description: '工作流入口节点，每个工作流有且仅有一个',
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
    description: '工作流终止节点，收集最终输出',
    category: 'flow',
    icon: Square,
    color: '#ef4444',
    borderColor: '#dc2626',
    inputHandles: [{ id: 'input', label: '输入', position: 'left' }],
    outputHandles: [],
    configParams: [
      {
        key: 'outputMapping',
        label: '输出映射',
        type: 'json',
        required: false,
        placeholder: '{"变量名":"输出字段名"}',
        description: '将变量映射到最终输出字段',
      },
    ],
    defaultConfig: { outputMapping: {} },
  },
  {
    type: 'LLM',
    label: '大模型',
    description: '调用大语言模型生成文本',
    category: 'ai',
    icon: Brain,
    color: '#8b5cf6',
    borderColor: '#7c3aed',
    configParams: [
      {
        key: 'prompt',
        label: '提示词',
        type: 'textarea',
        required: true,
        placeholder: '支持 ${variable} 变量替换',
        description: '提示词模板',
      },
      {
        key: 'model',
        label: '模型',
        type: 'string',
        required: false,
        placeholder: '可选，默认使用全局模型',
        description: '模型配置 ID',
      },
      {
        key: 'temperature',
        label: '温度',
        type: 'number',
        required: false,
        placeholder: '0-2',
        min: 0,
        max: 2,
        description: '控制输出随机性',
      },
      {
        key: 'maxTokens',
        label: '最大 Token 数',
        type: 'number',
        required: false,
        placeholder: '4096',
        min: 1,
        max: 128000,
        description: '生成的最大 Token 数',
      },
    ],
    defaultConfig: { prompt: '', model: '', temperature: 0.7, maxTokens: 4096 },
  },
  {
    type: 'AGENT',
    label: '智能体',
    description: '调用已注册的 Agent 进行对话',
    category: 'ai',
    icon: Bot,
    color: '#0ea5e9',
    borderColor: '#0284c7',
    configParams: [
      {
        key: 'agentId',
        label: 'Agent ID',
        type: 'string',
        required: true,
        placeholder: '要调用的 Agent ID',
        description: '目标 Agent 唯一标识',
      },
      {
        key: 'message',
        label: '消息',
        type: 'textarea',
        required: false,
        placeholder: '发送给 Agent 的消息模板',
        description: '支持变量替换',
      },
    ],
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
    configParams: [
      {
        key: 'query',
        label: '检索查询',
        type: 'textarea',
        required: true,
        placeholder: '支持 ${variable} 变量替换',
        description: '检索查询模板',
      },
      {
        key: 'knowledgeBaseId',
        label: '知识库 ID',
        type: 'string',
        required: false,
        placeholder: '可选，使用默认知识库',
        description: '知识库唯一标识',
      },
      {
        key: 'topK',
        label: '返回数量',
        type: 'number',
        required: false,
        placeholder: '5',
        min: 1,
        max: 100,
        description: '返回结果数量，默认 5',
      },
    ],
    defaultConfig: { query: '', knowledgeBaseId: '', topK: 5 },
  },
  {
    type: 'CONDITION',
    label: '条件分支',
    description: '根据表达式结果选择路径',
    category: 'flow',
    icon: GitBranch,
    color: '#f59e0b',
    borderColor: '#d97706',
    outputHandles: [
      { id: 'true', label: '是', position: 'right' },
      { id: 'false', label: '否', position: 'right' },
    ],
    configParams: [
      {
        key: 'expression',
        label: '条件表达式',
        type: 'string',
        required: true,
        placeholder: 'SpEL 表达式，如 ${score} > 60',
        description: 'SpEL 条件表达式',
      },
      {
        key: 'ifTrue',
        label: '条件为真时跳转',
        type: 'string',
        required: true,
        placeholder: '目标节点 ID',
        description: '条件为 true 时跳转的节点 ID',
      },
      {
        key: 'ifFalse',
        label: '条件为假时跳转',
        type: 'string',
        required: true,
        placeholder: '目标节点 ID',
        description: '条件为 false 时跳转的节点 ID',
      },
    ],
    defaultConfig: { expression: '', ifTrue: '', ifFalse: '' },
  },
  {
    type: 'SWITCH',
    label: '多路分支',
    description: '根据表达式值匹配多个分支',
    category: 'flow',
    icon: GitMerge,
    color: '#f97316',
    borderColor: '#ea580c',
    outputHandles: [{ id: 'output', label: '输出', position: 'right' }],
    configParams: [
      {
        key: 'expression',
        label: '匹配表达式',
        type: 'string',
        required: true,
        placeholder: 'SpEL 表达式',
        description: '待匹配的 SpEL 表达式',
      },
      {
        key: 'cases',
        label: '分支映射',
        type: 'json',
        required: true,
        placeholder: '{"值":"目标节点ID"}',
        description: '值到节点 ID 的映射',
      },
      {
        key: 'default',
        label: '默认跳转',
        type: 'string',
        required: false,
        placeholder: '默认目标节点 ID',
        description: '无匹配时的默认跳转节点 ID',
      },
    ],
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
    configParams: [
      {
        key: 'items',
        label: '遍历变量',
        type: 'string',
        required: true,
        placeholder: '列表变量名',
        description: '要遍历的列表变量名',
      },
      {
        key: 'body',
        label: '循环体节点',
        type: 'string',
        required: true,
        placeholder: '循环体起始节点 ID',
        description: '循环体起始节点 ID',
      },
      {
        key: 'itemVariable',
        label: '当前项变量名',
        type: 'string',
        required: false,
        placeholder: 'item',
        description: '当前项变量名，默认 item',
      },
    ],
    defaultConfig: { items: '', body: '', itemVariable: 'item' },
  },
  {
    type: 'WHILE',
    label: '条件循环',
    description: 'while 条件循环',
    category: 'flow',
    icon: RotateCw,
    color: '#06b6d4',
    borderColor: '#0891b2',
    configParams: [
      {
        key: 'condition',
        label: '循环条件',
        type: 'string',
        required: true,
        placeholder: 'SpEL 循环条件',
        description: 'SpEL 循环条件',
      },
      {
        key: 'body',
        label: '循环体节点',
        type: 'string',
        required: true,
        placeholder: '循环体起始节点 ID',
        description: '循环体起始节点 ID',
      },
      {
        key: 'maxIterations',
        label: '最大迭代次数',
        type: 'number',
        required: false,
        placeholder: '100',
        min: 1,
        max: 10000,
        description: '防死循环，默认 100',
      },
    ],
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
    configParams: [
      {
        key: 'branches',
        label: '并行分支',
        type: 'json',
        required: true,
        placeholder: '["node1","node2"]',
        description: '并行分支起始节点 ID 列表',
      },
      {
        key: 'joinStrategy',
        label: '汇聚策略',
        type: 'select',
        required: false,
        enum: [...PARALLEL_JOIN_STRATEGY_ENUM],
        description: 'ALL=全部完成，ANY=任一完成',
      },
    ],
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
    configParams: [
      {
        key: 'waitType',
        label: '等待类型',
        type: 'select',
        required: false,
        enum: [...WAIT_TYPE_ENUM],
        description: '延时/人工审批/事件等',
      },
      {
        key: 'delaySeconds',
        label: '延迟秒数',
        type: 'number',
        required: false,
        placeholder: '0',
        min: 0,
        max: 86400,
        description: 'DELAY 类型时生效',
      },
    ],
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
    configParams: [
      {
        key: 'url',
        label: '请求 URL',
        type: 'string',
        required: true,
        placeholder: 'https://api.example.com',
        description: '支持变量替换',
      },
      {
        key: 'method',
        label: '请求方法',
        type: 'select',
        required: false,
        enum: [...HTTP_METHOD_ENUM],
        description: 'GET/POST/PUT/DELETE',
      },
      {
        key: 'headers',
        label: '请求头',
        type: 'json',
        required: false,
        placeholder: '{"Content-Type":"application/json"}',
        description: '自定义请求头',
      },
      {
        key: 'body',
        label: '请求体',
        type: 'textarea',
        required: false,
        placeholder: 'POST/PUT 时填写',
        description: '请求体模板',
      },
    ],
    defaultConfig: { url: '', method: 'GET', headers: {}, body: '' },
  },
  {
    type: 'TOOL',
    label: '工具',
    description: '调用注册的工具',
    category: 'integration',
    icon: Wrench,
    color: '#eab308',
    borderColor: '#ca8a04',
    configParams: [
      {
        key: 'toolId',
        label: '工具 ID',
        type: 'string',
        required: true,
        placeholder: '工具唯一标识',
        description: '要调用的工具 ID',
      },
      {
        key: 'params',
        label: '工具参数',
        type: 'json',
        required: false,
        placeholder: '{"key":"value"}',
        description: '工具调用参数',
      },
    ],
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
    configParams: [
      {
        key: 'language',
        label: '编程语言',
        type: 'select',
        required: true,
        enum: [...CODE_LANGUAGE_ENUM],
        description: 'javascript/python/groovy',
      },
      {
        key: 'script',
        label: '代码内容',
        type: 'textarea',
        required: true,
        placeholder: '编写代码逻辑',
        description: '要执行的代码',
      },
    ],
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
    configParams: [
      {
        key: 'workflowId',
        label: '子工作流 ID',
        type: 'string',
        required: true,
        placeholder: '子工作流唯一标识',
        description: '要调用的子工作流 ID',
      },
      {
        key: 'inputMapping',
        label: '输入映射',
        type: 'json',
        required: false,
        placeholder: '{"子流变量":"上级变量"}',
        description: '输入变量映射',
      },
    ],
    defaultConfig: { workflowId: '', inputMapping: {} },
    hidden: true,
  },
  {
    type: 'SET_VARIABLE',
    label: '设置变量',
    description: '设置变量值',
    category: 'integration',
    icon: Variable,
    color: '#84cc16',
    borderColor: '#65a30d',
    configParams: [
      {
        key: 'assignments',
        label: '变量赋值',
        type: 'json',
        required: true,
        placeholder: '{"变量名":"值或表达式"}',
        description: '变量赋值映射',
      },
    ],
    defaultConfig: { assignments: {} },
  },
];

export function getNodeTypeDef(type: string): NodeTypeDef | undefined {
  return NODE_TYPES.find(n => n.type === type);
}

/** 节点是否有配置参数（用于隐藏配置标题） */
export function hasConfigParams(type: string): boolean {
  const def = getNodeTypeDef(type);
  const params = def?.configParams;
  return Array.isArray(params) && params.length > 0;
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
