import {
  Bot,
  ChevronRight,
  Edit,
  Play,
  Pause,
  BookOpen,
  Database,
  Zap,
  Code2,
  MessageSquare,
  Brain,
  Settings2,
  Info,
  Loader2,
  User,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { useAgentDetail } from '../hooks';
import { getAgentStatusColor } from '../utils';

/**
 * 智能体详情页：与应用详情页布局一致，展示基本信息、对话配置、记忆配置、关联资源
 */
export function AgentDetailPage() {
  const { id, detail, loading, handleToggleStatus, navigate } = useAgentDetail();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/agents')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            智能体
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white">详情</span>
        </div>
        <Card className="dark:bg-gray-800 dark:border-gray-700 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </Card>
      </div>
    );
  }

  if (!detail) return null;

  const statusColor = getAgentStatusColor(detail.status);
  const resources = detail.resources;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/agents')}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          智能体
        </button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 dark:text-white">详情</span>
      </div>

      {/* 智能体头部卡片：与应用详情一致 */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-start justify-between">
            {/* Left: 智能体信息 */}
            <div className="flex items-start gap-6">
              <div className="rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl dark:text-white">{detail.name ?? '--'}</h1>
                  <Badge className={`border-0 ${statusColor}`}>
                    {detail.status === 'ACTIVE' ? '已发布' : '离线'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ID: {detail.id ?? '-'}
                </div>
                {detail.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xl">
                    {detail.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: 操作按钮（保留原有全部操作） */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                disabled={!detail.status}
                className="dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {detail.status === 'ACTIVE' ? (
                    <>
                      <Pause className="w-4 h-4 mr-1.5" />
                      下线智能体
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1.5" />
                      发布智能体
                    </>
                  )}
              </Button>
              <Button size="sm" onClick={() => navigate(`/agents/${id}/edit`)} className="bg-blue-500 hover:bg-blue-600">
                <Edit className="w-4 h-4 mr-1.5" />
                编辑
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs 区域：与应用详情一致 */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="basic">
            <Info className="w-4 h-4 mr-2" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="w-4 h-4 mr-2" />
            对话配置
          </TabsTrigger>
          <TabsTrigger value="memory">
            <Brain className="w-4 h-4 mr-2" />
            记忆配置
          </TabsTrigger>
        </TabsList>

        {/* Tab: 基本信息 */}
        <TabsContent value="basic" className="space-y-6">
          {/* 关联资源卡片 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">关联资源</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">知识库、数据集、工作流、接口集</p>
              </div>
              {(resources?.knowledgeBases?.length ?? 0) > 0 ||
              (resources?.datasets?.length ?? 0) > 0 ||
              resources?.workflow != null ||
              (resources?.apiCollections?.length ?? 0) > 0 ? (
                <div className="space-y-6">
                  {resources?.knowledgeBases && resources.knowledgeBases.length > 0 && (
                    <ResourceSection
                      icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                      title="知识库"
                      items={resources.knowledgeBases.map(r => r.name ?? String(r.id))}
                      baseLink="/knowledge"
                    />
                  )}
                  {resources?.datasets && resources.datasets.length > 0 && (
                    <ResourceSection
                      icon={<Database className="w-4 h-4 text-green-500" />}
                      title="数据集"
                      items={resources.datasets.map(r => r.name ?? String(r.id))}
                      baseLink="/dataset"
                    />
                  )}
                  {resources?.apiCollections && resources.apiCollections.length > 0 && (
                    <ResourceSection
                      icon={<Code2 className="w-4 h-4 text-orange-500" />}
                      title="接口集"
                      items={resources.apiCollections.map(r => r.name ?? String(r.id))}
                      baseLink="/api-collection"
                    />
                  )}
                  {resources?.workflow && (
                    <ResourceSection
                      icon={<Zap className="w-4 h-4 text-purple-500" />}
                      title="工作流"
                      items={[resources.workflow.name ?? String(resources.workflow.id)]}
                      baseLink="/workflow"
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Settings2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium dark:text-white mb-2">暂无关联资源</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    可在编辑页中配置关联的知识库、数据集等资源
                  </p>
                  <Button size="sm" variant="outline" className="mt-4" onClick={() => navigate(`/agents/${id}/edit`)}>
                    去编辑
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 审计信息卡片 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-base dark:text-white mb-1">审计信息</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">创建与修改记录</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">创建者</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {detail.creator ?? (detail.createdBy != null ? `ID: ${detail.createdBy}` : '-')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">创建时间</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {detail.createdDate ? new Date(detail.createdDate).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">修改者</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {detail.modifier ?? (detail.modifiedBy != null ? `ID: ${detail.modifiedBy}` : '-')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">修改时间</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {detail.modifiedDate ? new Date(detail.modifiedDate).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab: 对话配置 */}
        <TabsContent value="chat">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">对话配置</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">交互模式、推理策略、默认模型等</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ConfigItem
                  label="默认模型"
                  value={detail.defaultModel?.name ?? (detail.defaultModel?.id != null ? String(detail.defaultModel.id) : '未选择')}
                />
                <ConfigItem label="交互模式" value={detail.interactionMode ? getEnumDescription(InteractionModeEnum, detail.interactionMode as InteractionModeEnum) : '--'} />
                <ConfigItem label="推理策略" value={detail.reasoningStrategy ? getEnumDescription(ReasoningStrategyEnum, detail.reasoningStrategy as ReasoningStrategyEnum) : '--'} />
                <ConfigItem label="自治等级" value={detail.autonomyLevel ? getEnumDescription(AutonomyLevelEnum, detail.autonomyLevel as AutonomyLevelEnum) : '--'} />
              </div>
              {detail.welcomeMessage && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">欢迎消息</div>
                  <p className="text-sm dark:text-white">{detail.welcomeMessage}</p>
                </div>
              )}
              {detail.systemPrompt && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">系统提示词</div>
                  <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {detail.systemPrompt}
                  </div>
                </div>
              )}
              {detail.suggestedQuestions && detail.suggestedQuestions.length > 0 && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">建议问题</div>
                  <div className="flex flex-wrap gap-2">
                    {detail.suggestedQuestions.map((q, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab: 记忆配置 */}
        <TabsContent value="memory">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">记忆配置</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">记忆策略、窗口大小、摘要提示词</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ConfigItem label="记忆策略" value={detail.memoryStrategy ? getEnumDescription(MemoryStrategyEnum, detail.memoryStrategy as MemoryStrategyEnum) : '--'} />
                <ConfigItem label="窗口大小" value={detail.memoryWindowSize != null ? String(detail.memoryWindowSize) : '--'} />
                <ConfigItem label="最大 Token" value={detail.memoryMaxTokens != null ? String(detail.memoryMaxTokens) : '--'} />
              </div>
              {detail.memorySummaryPrompt && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">摘要提示词</div>
                  <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
                    {detail.memorySummaryPrompt}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** 配置项（标签+值），带图标样式 */
function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
        <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
        <div className="text-sm font-medium dark:text-white">{value}</div>
      </div>
    </div>
  );
}

/** 关联资源区块 */
function ResourceSection({
  icon,
  title,
  items,
  baseLink,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  baseLink: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium dark:text-white mb-3">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(name => (
          <Link
            key={name}
            to={baseLink}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
