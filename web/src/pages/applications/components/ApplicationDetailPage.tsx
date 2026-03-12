import {
  ChevronRight,
  Edit,
  MessageSquare,
  Bot,
  Copy,
  Share2,
  Trash2,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Settings2,
  Clock,
  TrendingUp,
  Link2,
  Info,
  Loader2,
  User,
  FileText,
  Shield,
  Rocket,
  Globe,
  Lock,
  Users,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { ShareApplicationDialog } from './ShareApplicationDialog';
import { getTagColor } from '../utils';
import { useApplicationDetail } from '../hooks';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendsStatsVo } from '@/services/ApplicationsTypes';

/**
 * 应用详情页：参考用户详情布局，展示基本信息、配置、统计、分享
 */
export function ApplicationDetailPage() {
  const {
    id,
    detail,
    statistics,
    loading,
    shareDialogOpen,
    setShareDialogOpen,
    handleToggleStatus,
    handleDuplicate,
    handleDelete,
    navigate,
  } = useApplicationDetail();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/apps')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            应用
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

  const agents = detail.config?.agents ?? detail.agents ?? [];
  const defaultAgent = detail.config?.defaultAgent ?? detail.defaultAgent;
  const config = detail.config;
  const share = detail.share;
  const overview = statistics?.overview ?? (detail as any).stats ?? (detail as any).overview;
  const trends = statistics?.trends;
  const topUsers = statistics?.topUsers ?? [];
  const statusColor =
    detail.status === ApplicationStatusEnum.PUBLISHED
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : detail.status === ApplicationStatusEnum.PAUSED
        ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

  const appForShare = {
    id: String(detail.id ?? ''),
    name: detail.name ?? '',
    description: detail.description ?? '',
    status: (detail.status as ApplicationStatusEnum) ?? ApplicationStatusEnum.DRAFT,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/apps')}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          应用
        </button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 dark:text-white">详情</span>
      </div>

      {/* 应用头部卡片：与 UserDetail 一致 */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-start justify-between">
            {/* Left: 应用信息 */}
            <div className="flex items-start gap-6">
              <div className="rounded-xl flex items-center justify-center flex-shrink-0">
                <span
                  className="leading-none"
                  style={{ fontSize: '4rem', lineHeight: 1 }}
                >
                  {detail.icon && /^[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u{1F600}-\u{1F64F}]$/u.test(detail.icon)
                    ? detail.icon
                    : '🤖'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl dark:text-white">{detail.name ?? '--'}</h1>
                  <Badge className={`border-0 ${statusColor}`}>
                    {getEnumDescription(ApplicationStatusEnum, detail.status as ApplicationStatusEnum)}
                  </Badge>
                  {detail.publishedDate && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      发布于 {new Date(detail.publishedDate).toLocaleDateString()}
                    </span>
                  )}
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
              <Button size="sm" onClick={() => navigate(`/chat?app=${id}`)} className="bg-blue-500 hover:bg-blue-600">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                进入对话
              </Button>
              {(detail.status === ApplicationStatusEnum.DRAFT || detail.status === ApplicationStatusEnum.PAUSED) && (
                <Button variant="outline" size="sm" onClick={handleToggleStatus} className="dark:border-gray-600 dark:hover:bg-gray-700">
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  发布
                </Button>
              )}
              {detail.status === ApplicationStatusEnum.PUBLISHED && (
                <Button variant="outline" size="sm" onClick={handleToggleStatus} className="dark:border-gray-600 dark:hover:bg-gray-700">
                  <PauseCircle className="w-4 h-4 mr-1.5" />
                  暂停
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate(`/apps/${id}/edit`)} className="dark:border-gray-600 dark:hover:bg-gray-700">
                <Edit className="w-4 h-4 mr-1.5" />
                编辑
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/apps/${id}/settings`)} className="dark:border-gray-600 dark:hover:bg-gray-700">
                <Settings2 className="w-4 h-4 mr-1.5" />
                设置
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
                <Share2 className="w-4 h-4 mr-1.5" />
                分享
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicate} className="dark:border-gray-600 dark:hover:bg-gray-700">
                <Copy className="w-4 h-4 mr-1.5" />
                复制
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                删除
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs 区域：与 UserDetail 一致 */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="basic">
            <Info className="w-4 h-4 mr-2" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings2 className="w-4 h-4 mr-2" />
            配置信息
          </TabsTrigger>
          <TabsTrigger value="share">
            <Share2 className="w-4 h-4 mr-2" />
            分享信息
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="w-4 h-4 mr-2" />
            统计分析
          </TabsTrigger>
        </TabsList>

        {/* Tab: 基本信息 */}
        <TabsContent value="basic" className="space-y-6">
          {/* 基本信息卡片 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">基本信息</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">应用的名称、描述、标签等基础属性</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
                      <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">应用名称</div>
                      <div className="text-sm text-gray-900 dark:text-white font-medium">{detail.name ?? '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">描述</div>
                      <div className="text-sm text-gray-900 dark:text-white">{detail.description || '暂无描述'}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">发布状态</div>
                      <Badge className={`border-0 ${statusColor}`}>
                        {getEnumDescription(ApplicationStatusEnum, detail.status as ApplicationStatusEnum)}
                      </Badge>
                    </div>
                  </div>
                  {detail.publishedDate && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">发布时间</div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(detail.publishedDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {detail.tags && detail.tags.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">标签</div>
                        <div className="flex flex-wrap gap-1.5">
                          {detail.tags.map((t, i) => (
                            <Badge key={i} variant="secondary" className={`text-xs border ${getTagColor(t, i)}`}>
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 绑定智能体卡片 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-base dark:text-white mb-1">绑定智能体</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">应用关联的智能体，默认智能体用于对话</p>
              </div>
              {agents.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {agents.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                    >
                      {a.name ?? '--'}
                      {defaultAgent?.id === a.id && (
                        <Badge variant="secondary" className="text-xs ml-1">默认</Badge>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bot className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">暂无绑定智能体</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate(`/apps/${id}/settings`)}>
                    去设置
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

        {/* Tab: 配置信息 */}
        <TabsContent value="config">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">配置信息</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">应用的功能、安全与发布配置</p>
              </div>

              {config ? (
                <div className="mt-8 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium dark:text-white mb-3 flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      功能设置
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ConfigItem label="文件上传" value={config.features?.enableFileUpload} />
                      <ConfigItem label="语音输入" value={config.features?.enableVoiceInput} />
                      <ConfigItem label="图片输入" value={config.features?.enableImageInput} />
                      <ConfigItem label="提示词库" value={config.features?.enablePromptLibrary} />
                      <ConfigItem label="会话列表" value={config.features?.enableSessionList} />
                      <ConfigItem label="切换应用" value={config.features?.enableSwitchApp} />
                      <ConfigItem label="会话设置" value={config.features?.enableSessionSettings} />
                      <ConfigItem label="外观设置" value={config.features?.enableAppearanceSettings} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium dark:text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      安全设置
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ConfigItem label="内容过滤" value={config.security?.enableContentFilter} />
                      <ConfigItem label="数据加密" value={config.security?.enableDataEncryption} />
                      <ConfigItem label="数据保留(天)" value={config.security?.dataRetentionDays ?? '-'} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium dark:text-white mb-3 flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      发布设置
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ConfigItem label="公开访问" value={config.publish?.publicAccess} />
                      <ConfigItem label="嵌入代码" value={config.publish?.embedEnabled} />
                      <ConfigItem label="API 访问" value={config.publish?.apiEnabled} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Settings2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium dark:text-white mb-2">暂无配置信息</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">可在设置页中配置应用</p>
                  <Button size="sm" className="mt-4" onClick={() => navigate(`/apps/${id}/settings`)}>
                    <Settings2 className="w-4 h-4 mr-2" />
                    去设置
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab: 统计分析 */}
        <TabsContent value="statistics">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">统计数据</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">应用的调用量、Token 消耗、响应时间等</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={<Clock className="w-4 h-4" />}
                  label="调用次数"
                  value={overview?.totalCalls ?? overview?.totalApiCalls ?? (detail as any).apiCalls ?? '--'}
                />
                <StatCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Token 数"
                  value={overview?.totalTokens ?? '--'}
                />
                <StatCard
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="平均响应(ms)"
                  value={
                    overview?.avgResponseTime != null ? String(Math.round(overview.avgResponseTime)) : '--'
                  }
                />
                <StatCard
                  icon={<Link2 className="w-4 h-4" />}
                  label="成功率"
                  value={overview?.successRate != null ? `${Math.round(overview.successRate * 100)}%` : '--'}
                />
              </div>

              {/* 趋势数据：始终展示，有数据则渲染图表，无数据则展示占位 */}
              <div className="mb-8">
                <h4 className="text-sm font-medium dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  趋势数据
                </h4>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">调用次数趋势</div>
                    <div className="h-64 rounded-lg border dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 min-h-[16rem]">
                      {(trends?.calls?.length ?? 0) > 0 ? (
                        <div className="h-full w-full">
                          <TrendsChart trends={trends!} type="calls" />
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ChartPlaceholder text="暂无调用次数趋势数据" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Token 数趋势</div>
                    <div className="h-64 rounded-lg border dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 min-h-[16rem]">
                      {(trends?.tokens?.length ?? 0) > 0 ? (
                        <div className="h-full w-full">
                          <TrendsChart trends={trends!} type="tokens" />
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ChartPlaceholder text="暂无 Token 数趋势数据" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">响应时间趋势 (ms)</div>
                    <div className="h-64 rounded-lg border dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 min-h-[16rem]">
                      {(trends?.responseTime?.length ?? 0) > 0 ? (
                        <div className="h-full w-full">
                          <TrendsChart trends={trends!} type="responseTime" />
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ChartPlaceholder text="暂无响应时间趋势数据" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 热门用户信息：始终展示，有数据则渲染列表，无数据则展示占位 */}
              <div>
                <h4 className="text-sm font-medium dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  热门用户信息
                </h4>
                <div className="rounded-lg border dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 min-h-[12rem]">
                  {topUsers.length > 0 ? (
                    <div className="p-4 space-y-3">
                      {topUsers.slice(0, 10).map((u, idx) => (
                        <div
                          key={u.userId ?? idx}
                          className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 bg-white dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="dark:text-white">{u.username ?? `用户 ${u.userId ?? idx + 1}`}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">ID: {u.userId ?? '-'}</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            调用 {u.callCount ?? 0} 次
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">暂无热门用户数据</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">应用产生调用后，将展示使用最多的用户</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab: 分享信息 */}
        <TabsContent value="share">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base dark:text-white mb-1">分享信息</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">应用的分享设置及访问链接</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">公开访问</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {share?.publicAccess ? '是' : '否'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">匿名访问</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {share?.anonymousAccess ? '是' : '否'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">授权访问</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {share?.authorizationRequired ? '是' : '否'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {share?.shareUrl && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <Link2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">分享链接</div>
                        <div className="text-sm text-gray-900 dark:text-white truncate" title={share.shareUrl}>
                          {share.shareUrl}
                        </div>
                      </div>
                    </div>
                  )}
                  {share?.inviteCode && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                        <Link2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">邀请码</div>
                        <div className="text-sm text-gray-900 dark:text-white font-mono">{share.inviteCode}</div>
                      </div>
                    </div>
                  )}
                  {share?.expiresAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">过期时间</div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(share.expiresAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ShareApplicationDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} application={appForShare} />
    </div>
  );
}

/** 统计卡片 */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-lg font-semibold dark:text-white">{value}</div>
      </div>
    </div>
  );
}

/** 配置项展示 */
function ConfigItem({
  label,
  value,
}: {
  label: string;
  value?: boolean | string | number;
}) {
  const display =
    typeof value === 'boolean' ? (value ? '是' : '否') : value == null || value === '' ? '-' : String(value);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded border dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-white">{display}</span>
    </div>
  );
}

/** 图表空数据占位 */
function ChartPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">应用产生调用后，趋势数据将在此展示</p>
    </div>
  );
}

/** 趋势图 */
function TrendsChart({
  trends,
  type = 'calls',
}: {
  trends: TrendsStatsVo;
  type?: 'calls' | 'tokens' | 'responseTime';
}) {
  const series = type === 'calls' ? (trends.calls ?? []) : type === 'tokens' ? (trends.tokens ?? []) : (trends.responseTime ?? []);
  const dataKey = type === 'calls' ? 'calls' : type === 'tokens' ? 'tokens' : 'responseTime';
  const data = series.map((c) => ({
    time: c.datetime ? new Date(c.datetime).toLocaleDateString() : '',
    [dataKey]: c.value ?? 0,
  }));
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="time" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--chart-background)',
            border: '1px solid var(--chart-border)',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary) / 0.2)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
