import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Search, Bot, Check } from 'lucide-react';
import Agents from '@/services/Agents';
import Applications from '@/services/Applications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getTagColor } from '@/lib/tagColors';
import { AgentStatusEnum } from '@/enums/enums';

const ICON_OPTIONS = [
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
];

export function EditApplicationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [agentsList, setAgentsList] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [defaultAgentId, setDefaultAgentId] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🤖');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Applications.getApplicationDetail(id)
      .then((res: any) => {
        const d = res?.data ?? res;
        if (!d) {
          toast.error('应用不存在');
          navigate('/apps');
          return;
        }
        setDetail(d);
        setName(d.name ?? '');
        setDescription(d.description ?? '');
        setIcon(d.icon && /[\u{1F300}-\u{1F9FF}\u2600-\u26FF\u2700-\u27BF]/u.test(d.icon) ? d.icon : '🤖');
        setTags(d.tags ?? []);
        const agents = d.config?.agents ?? d.agents ?? [];
        const ids = agents.map((a: any) => String(a.id)).filter(Boolean);
        setSelectedAgentIds(ids.length > 0 ? ids : []);
        const def = d.config?.defaultAgent ?? d.defaultAgent;
        setDefaultAgentId(def?.id != null ? String(def.id) : ids[0]);
      })
      .catch(() => {
        toast.error('加载失败');
        navigate('/apps');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    setAgentsLoading(true);
    Agents.getAgentList({
      status: AgentStatusEnum.ACTIVE,
      bindable: true,
      pageNo: 1,
      pageSize: 100,
      keyword: agentSearchQuery.trim() || undefined,
    })
      .then((res: any) => {
        const list = (res?.data?.list ?? []).map((a: any) => ({
          id: a.id != null ? String(a.id) : '',
          name: a.name ?? '--',
          description: a.description,
        }));
        setAgentsList(list);
      })
      .catch(() => setAgentsList([]))
      .finally(() => setAgentsLoading(false));
  }, [agentSearchQuery]);

  const addTag = () => {
    const t = tagInput.trim().slice(0, 40);
    if (!t || tags.length >= 5) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  const toggleAgent = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      const next = selectedAgentIds.filter((a) => a !== agentId);
      setSelectedAgentIds(next);
      if (defaultAgentId === agentId) setDefaultAgentId(next[0]);
    } else {
      const next = [...selectedAgentIds, agentId];
      setSelectedAgentIds(next);
      if (!defaultAgentId) setDefaultAgentId(agentId);
    }
  };

  const setAsDefault = (agentId: string) => setDefaultAgentId(agentId);

  const handleSave = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error('请输入应用名称');
      return;
    }
    if (selectedAgentIds.length === 0) {
      toast.error('请至少选择一个智能体');
      return;
    }

    setSubmitting(true);
    try {
      await Applications.updateApplication(id, {
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        agentIds: selectedAgentIds,
        defaultAgentId: defaultAgentId || selectedAgentIds[0],
      });
      toast.success('保存成功');
      navigate(`/apps/${id}`);
    } catch (error: any) {
      const msg = error?.data?.message ?? error?.message ?? '保存失败';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate(`/apps/${id}`);

  if (loading || !detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold dark:text-white">编辑应用</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">修改应用的基本信息和绑定智能体</p>
      </div>

      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
        <div>
          <Label className="dark:text-gray-300">应用名称</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            placeholder="我的智能助手"
            maxLength={100}
            className="mt-2 dark:bg-gray-900 dark:border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">{name.length}/100</p>
        </div>
        <div>
          <Label className="dark:text-gray-300">应用图标（emoji）</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.emoji}
                type="button"
                onClick={() => setIcon(opt.emoji)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  icon === opt.emoji
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="或输入 emoji"
              className="w-24 h-10 text-center"
            />
          </div>
        </div>
        <div>
          <Label className="dark:text-gray-300">应用描述</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 800))}
            placeholder="简要描述应用的功能和用途"
            rows={3}
            maxLength={800}
            className="mt-2 dark:bg-gray-900 dark:border-gray-700 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/800</p>
        </div>
        <div>
          <Label className="dark:text-gray-300">标签（最多 5 个，每项最多 40 字符）</Label>
          <div className="space-y-2 mt-2">
            {tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value.slice(0, 40))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="输入后按回车，最多 40 字符"
                  maxLength={40}
                  className="w-64 min-w-[200px] dark:bg-gray-900"
                />
                <Button type="button" size="sm" variant="outline" onClick={addTag}>
                  添加
                </Button>
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={`cursor-pointer border ${getTagColor(t, i)}`}
                    onClick={() => removeTag(i)}
                  >
                    {t} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="dark:text-gray-300">绑定智能体</Label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
            至少选择一个智能体，默认智能体将用于对话
          </p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索智能体..."
              value={agentSearchQuery}
              onChange={(e) => setAgentSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
          <ScrollArea className="h-[240px] border rounded-lg dark:border-gray-700 p-2">
            {agentsLoading ? (
              <div className="py-8 text-center text-gray-500">加载中...</div>
            ) : agentsList.length === 0 ? (
              <div className="py-8 text-center text-gray-500">暂无智能体</div>
            ) : (
              <div className="space-y-1">
                {agentsList.map((agent) => {
                  const selected = selectedAgentIds.includes(agent.id);
                  const isDefault = defaultAgentId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm dark:text-white">{agent.name}</span>
                        {selected && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      {selected && (
                        <Button
                          size="sm"
                          variant={isDefault ? 'default' : 'outline'}
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAsDefault(agent.id);
                          }}
                        >
                          {isDefault ? '默认' : '设为默认'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="dark:bg-gray-800 dark:border-gray-700">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <Button onClick={handleSave} disabled={submitting} className="bg-blue-500 hover:bg-blue-600">
          {submitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  );
}
