import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Search, Bot } from 'lucide-react';
import Agents from '@/services/Agents';
import Applications from '@/services/Applications';
import { AgentStatusEnum } from '@/enums/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getTagColor } from '@/lib/tagColors';

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

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: '基本信息', desc: '名称、图标、描述' },
    { number: 2, title: '选择智能体', desc: '绑定对话能力' },
  ];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step.number === currentStep
                  ? 'bg-blue-500 text-white shadow-lg'
                  : step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <span className="ml-2 text-sm font-medium dark:text-white">{step.title}</span>
            {idx < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
  }, [currentStep, agentSearchQuery]);

  const addTag = () => {
    const t = tagInput.trim().slice(0, 40);
    if (!t || tags.length >= 5) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  const toggleAgent = (id: string) => {
    let next: string[];
    if (selectedAgentIds.includes(id)) {
      next = selectedAgentIds.filter((a) => a !== id);
      if (defaultAgentId === id) setDefaultAgentId(next[0]);
    } else {
      next = [...selectedAgentIds, id];
      if (!defaultAgentId) setDefaultAgentId(id);
    }
    setSelectedAgentIds(next);
  };

  const setAsDefault = (id: string) => setDefaultAgentId(id);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        toast.error('请输入应用名称');
        return;
      }
      setCurrentStep(2);
    } else {
      if (selectedAgentIds.length === 0) {
        toast.error('请至少选择一个智能体');
        return;
      }
      if (!defaultAgentId || !selectedAgentIds.includes(defaultAgentId)) {
        setDefaultAgentId(selectedAgentIds[0]);
      }
      handleCreate();
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res: any = await Applications.createApplication({
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        agentIds: selectedAgentIds,
        defaultAgentId: defaultAgentId || selectedAgentIds[0],
      });
      const data = res?.data ?? res;
      const id = data?.id ?? data?.id;
      toast.success('应用创建成功');
      if (id) {
        navigate(`/apps/${id}`);
      } else {
        navigate('/apps');
      }
    } catch (error: any) {
      const msg = error?.data?.message ?? error?.message ?? '创建失败';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(1);
    else navigate('/apps');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold dark:text-white">创建新应用</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          绑定智能体并填写基本信息，快速创建您的 AI 应用
        </p>
      </div>

      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
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
                      icon === opt.emoji ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={opt.label}
                  >
                    {opt.emoji}
                  </button>
                ))}
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
          </Card>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索智能体名称或描述..."
              value={agentSearchQuery}
              onChange={(e) => setAgentSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              选择要绑定的智能体，至少一个。默认智能体将用于对话。
            </p>
            <ScrollArea className="h-[320px] pr-2">
              {agentsLoading ? (
                <div className="py-12 text-center text-gray-500">加载中...</div>
              ) : agentsList.length === 0 ? (
                <div className="py-12 text-center text-gray-500">暂无可用智能体，请先在智能体管理中创建</div>
              ) : (
                <div className="space-y-2">
                  {agentsList.map((agent) => {
                    const selected = selectedAgentIds.includes(agent.id);
                    const isDefault = defaultAgentId === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => toggleAgent(agent.id)}
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${
                          selected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium dark:text-white">{agent.name}</div>
                            <div className="text-xs text-gray-500">{agent.description || '暂无描述'}</div>
                          </div>
                          {selected && <Check className="w-5 h-5 text-blue-500" />}
                        </div>
                        {selected && (
                          <Button
                            size="sm"
                            variant={isDefault ? 'default' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setAsDefault(agent.id);
                            }}
                            className="text-xs"
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
          </Card>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">已选智能体</p>
            <div className="flex flex-wrap gap-2">
              {selectedAgentIds.map((id) => {
                const agent = agentsList.find((a) => a.id === id);
                const isDefault = defaultAgentId === id;
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {agent?.name ?? id}
                    {isDefault && <span className="text-blue-500">(默认)</span>}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t dark:border-gray-700">
        <Button variant="outline" onClick={handleBack} className="dark:bg-gray-800 dark:border-gray-700">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {currentStep === 1 ? '取消' : '上一步'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={submitting}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {currentStep === 2 && submitting ? '创建中...' : currentStep === 2 ? '完成创建' : '下一步'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
