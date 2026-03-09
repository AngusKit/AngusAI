import {
  ChevronLeft,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { ShareApplicationDialog } from './ShareApplicationDialog';
import { getTagColor } from '../utils';
import { useApplicationDetail } from '../hooks';

/**
 * 应用详情页：展示应用信息、绑定的智能体、统计数据，提供操作按钮
 */
export function ApplicationDetailPage() {
  const { id, detail, loading, shareDialogOpen, setShareDialogOpen, handleToggleStatus, handleDuplicate, handleDelete, navigate } =
    useApplicationDetail();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
      </div>
    );
  }

  if (!detail) return null;

  const agents = detail.config?.agents ?? detail.agents ?? [];
  const defaultAgent = detail.config?.defaultAgent ?? detail.defaultAgent;
  const stats = (detail as any).stats ?? (detail as any).overview;
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/apps')} className="dark:text-gray-300">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
      </div>

      {/* 应用头部：图标、名称、状态、操作按钮 */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl flex-shrink-0">
            {detail.icon && /^[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u{1F600}-\u{1F64F}]$/u.test(detail.icon)
              ? detail.icon
              : '🤖'}
          </div>
          <div>
            <h1 className="text-2xl font-semibold dark:text-white">{detail.name ?? '--'}</h1>
            <Badge className={`text-xs mt-2 ${statusColor} border-0`}>
              {getEnumDescription(ApplicationStatusEnum, detail.status as ApplicationStatusEnum)}
            </Badge>
            {detail.publishedDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                发布于 {new Date(detail.publishedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate(`/chat?app=${id}`)} className="bg-blue-500 hover:bg-blue-600">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            进入对话
          </Button>
          {(detail.status === ApplicationStatusEnum.DRAFT || detail.status === ApplicationStatusEnum.PAUSED) && (
            <Button variant="outline" size="sm" onClick={handleToggleStatus} className="dark:bg-gray-800 dark:border-gray-700">
              <PlayCircle className="w-4 h-4 mr-1.5" />
              发布
            </Button>
          )}
          {detail.status === ApplicationStatusEnum.PUBLISHED && (
            <Button variant="outline" size="sm" onClick={handleToggleStatus} className="dark:bg-gray-800 dark:border-gray-700">
              <PauseCircle className="w-4 h-4 mr-1.5" />
              暂停
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(`/apps/${id}/edit`)} className="dark:bg-gray-800 dark:border-gray-700">
            <Edit className="w-4 h-4 mr-1.5" />
            编辑
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/apps/${id}/settings`)} className="dark:bg-gray-800 dark:border-gray-700">
            <Settings2 className="w-4 h-4 mr-1.5" />
            设置
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
            <Share2 className="w-4 h-4 mr-1.5" />
            分享
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicate} className="dark:bg-gray-800 dark:border-gray-700">
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

      {/* 基本信息卡片 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <Bot className="w-4 h-4" />
          基本信息
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">描述</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{detail.description || '暂无描述'}</p>
          </div>
          {detail.tags && detail.tags.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">标签</div>
              <div className="flex flex-wrap gap-1.5">
                {detail.tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className={`text-xs border ${getTagColor(t, i)}`}>
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 绑定的智能体 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <Settings2 className="w-4 h-4" />
          绑定的智能体
        </h3>
        {agents.length > 0 ? (
          <div className="space-y-2">
            {agents.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm dark:text-white">{a.name ?? '--'}</span>
                </div>
                {defaultAgent?.id === a.id && (
                  <Badge variant="secondary" className="text-xs">
                    默认
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">暂无绑定智能体</p>
        )}
      </Card>

      {/* 统计数据 */}
      {stats && (
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
            <BarChart3 className="w-4 h-4" />
            统计数据
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Clock className="w-4 h-4" />} label="调用次数" value={stats.totalCalls ?? stats.totalApiCalls ?? detail.apiCalls ?? '--'} />
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Token 数" value={stats.totalTokens ?? '--'} />
            <StatCard
              icon={<BarChart3 className="w-4 h-4" />}
              label="平均响应(ms)"
              value={stats.avgResponseTime != null ? String(Math.round(stats.avgResponseTime)) : '--'}
            />
            <StatCard
              icon={<Link2 className="w-4 h-4" />}
              label="成功率"
              value={stats.successRate != null ? `${Math.round(stats.successRate * 100)}%` : '--'}
            />
          </div>
        </Card>
      )}

      <ShareApplicationDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} application={appForShare} />
    </div>
  );
}

/** 统计卡片 */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
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
