import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Bot, Search, Filter, Grid3x3, List, Eye, Edit, Trash2, MoreHorizontal, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XcanPagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import {
  AgentListVo,
  AgentCreateDto,
  AgentUpdateDto,
} from '@/services/AgentsTypes';
import type { AgentStatusEnum } from '@/services/AgentsTypes';
import { AgentStatusEnum as AgentStatusEnumValue } from '@/enums/enums';
import { ModelListVo } from '@/services/ModelsTypes';
import { ModelStatusEnum } from '@/enums/enums';

interface AgentListItem {
  id: string;
  name: string;
  description: string;
  status: string;
  statusEnum?: AgentStatusEnum;
  interactionMode?: string;
}

const AGENT_STATUS_CONFIG: Record<string, { color: string }> = {
  ACTIVE: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  INACTIVE: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' },
};

export function AgentManagement() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | AgentStatusEnum>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsTotal, setAgentsTotal] = useState(0);
  const [models, setModels] = useState<ModelListVo[]>([]);

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    modelId: 0,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    modelId: 0,
  });

  const loadModels = useCallback(async () => {
    try {
      const res = await Models.getModelList({
        status: ModelStatusEnum.ACTIVE,
        pageNo: 1,
        pageSize: 100,
      });
      const data = (res as any)?.data;
      setModels(data?.list ?? []);
    } catch (e) {
      console.error('Failed to load models:', e);
    }
  }, []);

  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const res = await Agents.getAgentList({
        keyword: debouncedSearchQuery.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });
      const data = (res as any)?.data;
      const list: AgentListVo[] = data?.list ?? [];
      setAgentsTotal(data?.total ?? 0);
      setAgents(
        list.map((item) => ({
          id: String(item.id ?? ''),
          name: item.name ?? '--',
          description: item.description ?? '--',
          status: item.status ?? 'INACTIVE',
          statusEnum: item.status as AgentStatusEnum | undefined,
          interactionMode: item.interactionMode,
        }))
      );
    } catch (error: any) {
      console.error('Failed to load agents:', error);
      toast.error(error?.message || '加载智能体列表失败');
      setAgents([]);
      setAgentsTotal(0);
    } finally {
      setAgentsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, currentPage]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  useEffect(() => {
    if (createDialogOpen || editDialogOpen) {
      loadModels();
    }
  }, [createDialogOpen, editDialogOpen, loadModels]);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error('请输入智能体名称');
      return;
    }
    if (!createForm.modelId) {
      toast.error('请选择模型');
      return;
    }
    try {
      const dto: AgentCreateDto = {
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
        defaultModelId: createForm.modelId,
      };
      await Agents.createAgent(dto);
      toast.success('智能体创建成功');
      setCreateDialogOpen(false);
      setCreateForm({ name: '', description: '', modelId: 0 });
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '创建失败');
    }
  };

  const handleEdit = async () => {
    if (!selectedAgent) return;
    if (!editForm.name.trim()) {
      toast.error('请输入智能体名称');
      return;
    }
    try {
      const dto: AgentUpdateDto = {
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
        defaultModelId: editForm.modelId || undefined,
      };
      await Agents.updateAgent(selectedAgent.id, dto);
      toast.success('智能体已更新');
      setEditDialogOpen(false);
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '更新失败');
    }
  };

  const handleToggleStatus = async (agent: AgentListItem) => {
    if (!agent.id || !agent.statusEnum) return;
    const newStatus: AgentStatusEnum =
      agent.statusEnum === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await Agents.updateAgentStatus(agent.id, newStatus);
      toast.success(newStatus === 'ACTIVE' ? '已发布' : '已下线');
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '操作失败');
    }
  };

  const handleDelete = async (agent: AgentListItem) => {
    if (!agent.id) return;
    try {
      await Agents.deleteAgent(agent.id);
      toast.success('智能体已删除');
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '删除失败');
    }
  };

  const openEdit = async (agent: AgentListItem) => {
    setSelectedAgent(agent);
    let modelId = 0;
    try {
      const res = await Agents.getAgentDetail(agent.id);
      const detail = (res as any)?.data;
      if (detail?.modelId) {
        modelId = typeof detail.modelId === 'number' ? detail.modelId : parseInt(String(detail.modelId), 10) || 0;
      }
    } catch {
      // ignore
    }
    setEditForm({
      name: agent.name,
      description: agent.description,
      modelId,
    });
    setEditDialogOpen(true);
  };

  const openDetail = (agent: AgentListItem) => {
    setSelectedAgent(agent);
    setDetailDialogOpen(true);
  };

  const getStatusConfig = (status?: string) =>
    AGENT_STATUS_CONFIG[status ?? ''] ?? AGENT_STATUS_CONFIG.INACTIVE ?? { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">{t('nav.agents')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理智能体，配置模型与能力
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索智能体..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as 'all' | AgentStatusEnum);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-300">
                全部状态
              </SelectItem>
              <SelectItem value={AgentStatusEnumValue.ACTIVE} className="dark:text-gray-300">
                已发布
              </SelectItem>
              <SelectItem value={AgentStatusEnumValue.INACTIVE} className="dark:text-gray-300">
                已下线
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setCreateForm({ name: '', description: '', modelId: 0 });
              setCreateDialogOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            创建智能体
          </Button>
        </div>
      </div>

      {agentsLoading ? (
        <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg mb-2 dark:text-white">加载中...</h3>
        </Card>
      ) : agents.length === 0 ? (
        <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg mb-2 dark:text-white">暂无智能体</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            创建第一个智能体开始使用
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            创建智能体
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const statusCfg = getStatusConfig(agent.statusEnum);
            return (
              <Card
                key={agent.id}
                className="p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => handleToggleStatus(agent)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={!agent.statusEnum}
                  >
                    {agent.statusEnum === 'ACTIVE' ? (
                      <Pause className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem onClick={() => openDetail(agent)} className="dark:text-gray-300">
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(agent)} className="dark:text-gray-300">
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(agent)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 dark:text-white">{agent.name}</h3>
                    <Badge className={`text-xs ${statusCfg?.color ?? 'bg-gray-100 text-gray-700'} border-0`}>
                      {agent.statusEnum === 'ACTIVE' ? '已发布' : '已下线'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {agent.description}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">智能体</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">状态</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {agents.map((agent) => {
                  const statusCfg = getStatusConfig(agent.statusEnum);
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="dark:text-white">{agent.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {agent.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`text-xs ${statusCfg?.color ?? 'bg-gray-100 text-gray-700'} border-0`}>
                          {agent.statusEnum === 'ACTIVE' ? '已发布' : '已下线'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(agent)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            disabled={!agent.statusEnum}
                          >
                            {agent.statusEnum === 'ACTIVE' ? (
                              <Pause className="w-4 h-4 text-orange-500" />
                            ) : (
                              <Play className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          <button
                            onClick={() => openDetail(agent)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => openEdit(agent)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(agent)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {agentsTotal > itemsPerPage && (
        <XcanPagination
          pageSize={itemsPerPage}
          pageNo={currentPage}
          total={agentsTotal}
          onChange={({ pageNo }) => setCurrentPage(pageNo)}
        />
      )}

      {/* 创建对话框 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">创建智能体</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              填写基本信息并选择模型
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="dark:text-gray-300">名称</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="智能体名称"
                className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <Label className="dark:text-gray-300">描述</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="简要描述"
                rows={3}
                className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
              />
            </div>
            <div>
              <Label className="dark:text-gray-300">模型</Label>
              <Select
                value={createForm.modelId ? String(createForm.modelId) : ''}
                onValueChange={(v) => setCreateForm((f) => ({ ...f, modelId: parseInt(v, 10) }))}
              >
                <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)} className="dark:text-gray-300">
                      {m.name ?? m.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="dark:bg-gray-700 dark:border-gray-600">
              取消
            </Button>
            <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">编辑智能体</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              修改智能体基本信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="dark:text-gray-300">名称</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="智能体名称"
                className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <Label className="dark:text-gray-300">描述</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="简要描述"
                rows={3}
                className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
              />
            </div>
            <div>
              <Label className="dark:text-gray-300">模型</Label>
              <Select
                value={editForm.modelId ? String(editForm.modelId) : ''}
                onValueChange={(v) => setEditForm((f) => ({ ...f, modelId: parseInt(v, 10) }))}
              >
                <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)} className="dark:text-gray-300">
                      {m.name ?? m.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="dark:bg-gray-700 dark:border-gray-600">
              取消
            </Button>
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">智能体详情</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1 dark:text-white">{selectedAgent.name}</h3>
                  <Badge className={`text-xs ${(getStatusConfig(selectedAgent?.statusEnum) ?? { color: 'bg-gray-100' }).color} border-0`}>
                    {selectedAgent.statusEnum === 'ACTIVE' ? '已发布' : '已下线'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAgent.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)} className="dark:bg-gray-700 dark:border-gray-600">
              关闭
            </Button>
            {selectedAgent && (
              <Button onClick={() => { setDetailDialogOpen(false); openEdit(selectedAgent); }} className="bg-blue-500 hover:bg-blue-600">
                编辑
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
