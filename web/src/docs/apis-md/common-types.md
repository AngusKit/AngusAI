# 公共类型定义

本文档定义了AngusAI系统中常用的数据类型和枚举值。

## 基础类型

### User（用户）
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
```

### UserRole（用户角色）
```typescript
enum UserRole {
  ADMIN = 'admin',         // 管理员
  MEMBER = 'member',       // 普通成员
  VIEWER = 'viewer'        // 只读成员
}
```

### Pagination（分页）
```typescript
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

### ListResponse（列表响应）
```typescript
interface ListResponse<T> {
  items: T[];
  pagination: Pagination;
}
```

## 应用相关

### Application（应用）
```typescript
interface Application {
  id: number;
  name: string;
  icon: string;             // emoji或图标URL
  description: string;
  category: ApplicationCategory;
  status: ApplicationStatus;
  createdAt: number;
  updatedAt: number;
  createdBy: number;        // 创建人ID
  apiCalls: number;         // API调用次数
  lastModified: string;     // 最后修改时间描述
}
```

### ApplicationCategory（应用分类）
```typescript
enum ApplicationCategory {
  CUSTOMER_SERVICE = 'customer-service',   // 客户服务
  SALES = 'sales',                         // 销售助手
  EDUCATION = 'education',                 // 教育培训
  PRODUCTIVITY = 'productivity',           // 效率工具
  CREATIVE = 'creative',                   // 创意设计
  OTHER = 'other'                          // 其他
}
```

### ApplicationStatus（应用状态）
```typescript
enum ApplicationStatus {
  PUBLISHED = 'published',   // 已发布
  DRAFT = 'draft'           // 草稿
}
```

## 知识库相关

### KnowledgeBase（知识库）
```typescript
interface KnowledgeBase {
  id: number;
  name: string;
  icon: string;
  iconBg: string;
  description: string;
  documentsCount: number;
  totalSize: string;        // 如 "2.5 MB"
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}
```

### Document（文档）
```typescript
interface Document {
  id: number;
  name: string;
  type: DocumentType;
  size: string;
  uploadedAt: number;
  status: DocumentStatus;
  enabled: boolean;
  chunks?: number;          // 分段数量
  processingProgress?: number;  // 处理进度 0-100
}
```

### DocumentType（文档类型）
```typescript
enum DocumentType {
  TXT = 'txt',
  PDF = 'pdf',
  DOCX = 'docx',
  MD = 'md',
  HTML = 'html'
}
```

### DocumentStatus（文档状态）
```typescript
enum DocumentStatus {
  UPLOADING = 'uploading',       // 上传中
  PROCESSING = 'processing',     // 处理中
  COMPLETED = 'completed',       // 已完成
  FAILED = 'failed'             // 失败
}
```

## 数据集相关

### Dataset（数据集）
```typescript
interface Dataset {
  id: number;
  name: string;
  icon: string;
  iconBg: string;
  description: string;
  dataType: DataType;
  visibility: Visibility;
  dataCount: string;        // 如 "12.5K 条"
  totalSize: string;        // 如 "5.2 MB"
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}
```

### DataType（数据类型）
```typescript
enum DataType {
  TEXT = 'text',           // 文本数据
  TABLE = 'table',         // 表格数据
  DATASOURCE = 'datasource' // 数据源
}
```

### Visibility（可见性）
```typescript
enum Visibility {
  PRIVATE = 'private',     // 私有
  TEAM = 'team',          // 团队可见
  PUBLIC = 'public'       // 公开
}
```

## 工作流相关

### Workflow（工作流）
```typescript
interface Workflow {
  id: number;
  name: string;
  icon: string;
  iconBg: string;
  description: string;
  type: WorkflowType;
  nodesCount: number;      // 节点数量
  status: WorkflowStatus;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  version: string;         // 版本号
}
```

### WorkflowType（工作流类型）
```typescript
enum WorkflowType {
  SINGLE_TASK = 'single-task',           // 单轮任务流
  MULTI_CONVERSATION = 'multi-conversation'  // 多轮对话流（记忆）
}
```

### WorkflowStatus（工作流状态）
```typescript
enum WorkflowStatus {
  ACTIVE = 'active',       // 活跃
  DRAFT = 'draft',        // 草稿
  ARCHIVED = 'archived'   // 已归档
}
```

### WorkflowNode（工作流节点）
```typescript
interface WorkflowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
}
```

### NodeType（节点类型）
```typescript
enum NodeType {
  START = 'start',         // 开始节点
  END = 'end',            // 结束节点
  LLM = 'llm',            // LLM节点
  CONDITION = 'condition', // 条件判断
  TOOL = 'tool',          // 工具调用
  CODE = 'code',          // 代码执行
  TEMPLATE = 'template',  // 模板节点
  KNOWLEDGE = 'knowledge' // 知识库检索
}
```

## 模型相关

### Model（模型）
```typescript
interface Model {
  id: number;
  name: string;
  description: string;
  type: ModelType;
  provider: ModelProvider;
  version: string;
  status: ModelStatus;
  performance: {
    latency: string;
    throughput: string;
    accuracy: string;
  };
  resources: {
    cpu: string;
    memory: string;
    gpu: string;
  };
  calls: string;           // 调用次数
  cost: string;           // 成本
  deployed: string;       // 部署时间
}
```

### ModelType（模型类型）
```typescript
enum ModelType {
  LANGUAGE = 'language',       // 语言模型
  IMAGE = 'image',            // 图像生成
  VIDEO = 'video',            // 视频生成
  CODE = 'code',              // 代码模型
  AUDIO = 'audio',            // 语音模型
  EMBEDDING = 'embedding',    // 嵌入模型
  MULTIMODAL = 'multimodal'   // 多模态
}
```

### ModelProvider（模型提供商）
```typescript
enum ModelProvider {
  OPENAI = 'OpenAI',
  ANTHROPIC = 'Anthropic',
  GOOGLE = 'Google',
  META = 'Meta',
  STABILITY_AI = 'Stability AI',
  RUNWAY = 'Runway',
  PIKA = 'Pika Labs',
  CUSTOM = 'Custom'
}
```

### ModelStatus（模型状态）
```typescript
enum ModelStatus {
  RUNNING = 'running',     // 运行中
  STOPPED = 'stopped',     // 已停止
  DEPLOYING = 'deploying'  // 部署中
}
```

## 提示词相关

### Prompt（提示词）
```typescript
interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  variables: string[];     // 变量列表
  language: Language;
  likes: number;
  uses: number;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: number;
}
```

### PromptCategory（提示词分类）
```typescript
enum PromptCategory {
  WRITING = 'writing',         // 写作
  CODING = 'coding',          // 编程
  MARKETING = 'marketing',    // 营销
  EDUCATION = 'education',    // 教育
  BUSINESS = 'business',      // 商务
  CREATIVE = 'creative',      // 创意
  OTHER = 'other'            // 其他
}
```

## 插件相关

### Plugin（插件）
```typescript
interface Plugin {
  id: number;
  name: string;
  icon: string;
  description: string;
  version: string;
  author: string;
  category: PluginCategory;
  rating: number;          // 评分 0-5
  downloads: number;       // 下载量
  price: number;          // 价格，0表示免费
  isInstalled: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### PluginCategory（插件分类）
```typescript
enum PluginCategory {
  DATA_SOURCE = 'data-source',     // 数据源
  TOOL = 'tool',                   // 工具
  INTEGRATION = 'integration',     // 集成
  ANALYTICS = 'analytics',         // 分析
  AUTOMATION = 'automation',       // 自动化
  OTHER = 'other'                  // 其他
}
```

## API密钥相关

### ApiKey（API密钥）
```typescript
interface ApiKey {
  id: number;
  name: string;
  key: string;             // 密钥（部分隐藏）
  permissions: Permission[];
  status: ApiKeyStatus;
  createdAt: number;
  lastUsed?: number;
  expiresAt?: number;      // 过期时间，null表示永不过期
}
```

### Permission（权限）
```typescript
interface Permission {
  resourceType: ResourceType;
  resourceIds?: number[];  // 具体资源ID，空表示所有
  actions: Action[];       // 允许的操作
}
```

### ResourceType（资源类型）
```typescript
enum ResourceType {
  APPLICATION = 'application',
  WORKFLOW = 'workflow',
  DATASET = 'dataset',
  KNOWLEDGE_BASE = 'knowledge-base',
  PLUGIN = 'plugin',
  MODEL = 'model'
}
```

### Action（操作）
```typescript
enum Action {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  EXECUTE = 'execute'
}
```

### ApiKeyStatus（API密钥状态）
```typescript
enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired'
}
```

## 团队相关

### TeamMember（团队成员）
```typescript
interface TeamMember {
  id: number;
  user: User;
  role: TeamRole;
  joinedAt: number;
  status: MemberStatus;
  invitedBy?: number;      // 邀请人ID
}
```

### TeamRole（团队角色）
```typescript
enum TeamRole {
  OWNER = 'owner',         // 所有者
  ADMIN = 'admin',         // 管理员
  MEMBER = 'member',       // 成员
  VIEWER = 'viewer'        // 访客
}
```

### MemberStatus（成员状态）
```typescript
enum MemberStatus {
  ACTIVE = 'active',       // 活跃
  PENDING = 'pending',     // 待接受
  INACTIVE = 'inactive'    // 已禁用
}
```

## 计费相关

### Subscription（订阅）
```typescript
interface Subscription {
  id: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
}
```

### SubscriptionPlan（订阅计划）
```typescript
enum SubscriptionPlan {
  FREE = 'free',           // 免费版
  BASIC = 'basic',         // 基础版
  PRO = 'pro',            // 专业版
  ENTERPRISE = 'enterprise' // 企业版
}
```

### SubscriptionStatus（订阅状态）
```typescript
enum SubscriptionStatus {
  ACTIVE = 'active',       // 活跃
  PAST_DUE = 'past_due',  // 逾期
  CANCELED = 'canceled',   // 已取消
  EXPIRED = 'expired'      // 已过期
}
```

### PaymentMethod（支付方式）
```typescript
enum PaymentMethod {
  CREDIT_CARD = 'credit_card',  // 信用卡
  ALIPAY = 'alipay',           // 支付宝
  WECHAT = 'wechat'            // 微信支付
}
```

## 语言设置

### Language（语言）
```typescript
enum Language {
  ZH_CN = 'zh-CN',   // 简体中文
  ZH_TW = 'zh-TW',   // 繁体中文
  EN_US = 'en-US',   // 英语
  JA_JP = 'ja-JP',   // 日语
  KO_KR = 'ko-KR'    // 韩语
}
```

## 主题设置

### Theme（主题）
```typescript
enum Theme {
  LIGHT = 'light',     // 浅色
  DARK = 'dark',       // 深色
  AUTO = 'auto'        // 跟随系统
}
```

## 排序方式

### SortOrder（排序方向）
```typescript
enum SortOrder {
  ASC = 'asc',         // 升序
  DESC = 'desc'        // 降序
}
```

## 文件相关

### FileUpload（文件上传）
```typescript
interface FileUpload {
  file: File;
  progress: number;    // 0-100
  status: UploadStatus;
  error?: string;
}
```

### UploadStatus（上传状态）
```typescript
enum UploadStatus {
  PENDING = 'pending',     // 等待中
  UPLOADING = 'uploading', // 上传中
  SUCCESS = 'success',     // 成功
  FAILED = 'failed'        // 失败
}
```

## 错误类型

### ErrorResponse（错误响应）
```typescript
interface ErrorResponse {
  code: number;
  message: string;
  errors?: FieldError[];
  timestamp: number;
}
```

### FieldError（字段错误）
```typescript
interface FieldError {
  field: string;
  message: string;
  value?: any;
}
```

---

**注意**：所有时间戳使用Unix时间戳（毫秒）格式
