import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Info, Puzzle, Shield, Key, Rocket, Save, Image as ImageIcon, Globe, Mic, Paperclip, Code, Lock, ArrowLeft, MessageSquare, } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { toast } from 'sonner';
import { getTagColor } from '../utils.ts';
import Applications from '@/services/Applications.ts';
import { ApplicationStatusEnum } from '@/enums/enums.ts';

export function AppSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 基本信息
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 配置更新需要保留的 agentIds
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [defaultAgentId, setDefaultAgentId] = useState<string | undefined>();

  // 功能设置
  const [enableFileUpload, setEnableFileUpload] = useState(true);
  const [enableVoiceInput, setEnableVoiceInput] = useState(true);
  const [enableImageInput, setEnableImageInput] = useState(false);
  const [enableSuggestions, setEnableSuggestions] = useState(true);

  // 安全与隐私
  const [enableContentFilter, setEnableContentFilter] = useState(true);
  const [enableDataEncryption, setEnableDataEncryption] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState('30');

  // 发布设置
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'paused'>('published');
  const [publicAccess, setPublicAccess] = useState(false);
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res: any = await Applications.getApplicationDetail(id);
      const d = res?.data ?? res;
      if (!d?.id && !d?.name) {
        toast.error('应用不存在');
        navigate('/apps');
        return;
      }
      setName(d.name ?? '');
      setDescription(d.description ?? '');
      setTags(d.tags ?? []);
      const agents = d.config?.agents ?? d.agents ?? [];
      const ids = agents.map((a: any) => String(a.id)).filter(Boolean);
      setAgentIds(ids.length > 0 ? ids : []);
      const def = d.config?.defaultAgent ?? d.defaultAgent;
      setDefaultAgentId(def?.id != null ? String(def.id) : ids[0]);
      const f = d.config?.features;
      if (f) {
        setEnableFileUpload(f.enableFileUpload ?? true);
        setEnableVoiceInput(f.enableVoiceInput ?? true);
        setEnableImageInput(f.enableImageInput ?? false);
        setEnableSuggestions(f.enableSuggestions ?? true);
      }
      const s = d.config?.security;
      if (s) {
        setEnableContentFilter(s.enableContentFilter ?? true);
        setEnableDataEncryption(s.enableDataEncryption ?? true);
        setDataRetentionDays(String(s.dataRetentionDays ?? 30));
      }
      const p = d.config?.publish;
      if (p) {
        setPublicAccess(p.publicAccess ?? false);
        setEmbedEnabled(p.embedEnabled ?? true);
        setApiEnabled(p.apiEnabled ?? true);
      }
      const status = d.status;
      setPublishStatus(
        status === 'PUBLISHED' ? 'published' : status === 'DRAFT' ? 'draft' : status === 'PAUSED' ? 'paused' : 'published'
      );
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || '加载失败');
      navigate('/apps');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleBack = () => navigate(id ? `/apps/${id}` : '/apps');

  const addTag = () => {
    const t = tagInput.trim().slice(0, 40);
    if (!t || tags.length >= 5) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  const handleSaveBasicInfo = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error('请输入应用名称');
      return;
    }
    setSavingBasic(true);
    try {
      await Applications.updateApplication(id, {
        name: name.trim(),
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      toast.success('基本信息已保存');
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSavingBasic(false);
    }
  };

  const saveConfig = async (
    payload: { features?: object; security?: object; publish?: object },
    setSaving: (v: boolean) => void,
    successMsg: string
  ) => {
    if (!id) return;
    if (agentIds.length === 0) {
      toast.error('应用未绑定智能体，请先在编辑页绑定');
      return;
    }
    setSaving(true);
    try {
      await Applications.updateApplicationConfig(id, {
        agentIds,
        defaultAgentId,
        ...payload,
      } as any);
      toast.success(successMsg);
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeatures = () =>
    saveConfig(
      {
        features: {
          enableFileUpload,
          enableVoiceInput,
          enableImageInput,
          enableSuggestions,
        },
      },
      setSavingFeatures,
      '功能设置已保存'
    );

  const handleSaveSecurity = () => {
    const days = parseInt(String(dataRetentionDays), 10);
    if (isNaN(days) || days < 1) {
      toast.error('数据保留天数须大于 0');
      return;
    }
    saveConfig(
      {
        security: {
          enableContentFilter,
          enableDataEncryption,
          dataRetentionDays: days,
        },
      },
      setSavingSecurity,
      '安全设置已保存'
    );
  };

  const handleSavePublish = async () => {
    if (!id) return;
    if (agentIds.length === 0) {
      toast.error('应用未绑定智能体，请先在编辑页绑定');
      return;
    }
    setSavingPublish(true);
    try {
      await Applications.updateApplicationConfig(id, {
        agentIds,
        defaultAgentId,
        publish: { publicAccess, embedEnabled, apiEnabled },
      } as any);
      const targetStatus =
        publishStatus === 'published'
          ? ApplicationStatusEnum.PUBLISHED
          : publishStatus === 'paused'
            ? ApplicationStatusEnum.PAUSED
            : ApplicationStatusEnum.DRAFT;
      await Applications.modifyApplicationStatus(id, { status: targetStatus });
      toast.success('发布设置已保存');
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSavingPublish(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-24'>
        <div className='w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin' />
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-3'>加载中...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Back Button */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-2'>
          {(
            <Button variant='ghost' size='sm' onClick={handleBack} className='dark:text-gray-300 dark:hover:bg-gray-700'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              返回
            </Button>
          )}
          <div className='w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0'>
            <Settings className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>应用设置</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>配置「{name} 」的各项参数和功能设置</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue='basic' className='mt-4'>
        <TabsList className='grid grid-cols-4 lg:grid-cols-5 gap-2 h-auto dark:bg-gray-800'>
          <TabsTrigger value='basic' className='dark:data-[state=active]:bg-gray-700'>
            <Info className='w-4 h-4 mr-1' />
            基本信息
          </TabsTrigger>
          <TabsTrigger value='features' className='dark:data-[state=active]:bg-gray-700'>
            <Puzzle className='w-4 h-4 mr-1' />
            功能
          </TabsTrigger>
          <TabsTrigger value='security' className='dark:data-[state=active]:bg-gray-700'>
            <Shield className='w-4 h-4 mr-1' />
            安全
          </TabsTrigger>
          <TabsTrigger value='publish' className='dark:data-[state=active]:bg-gray-700'>
            <Rocket className='w-4 h-4 mr-1' />
            发布
          </TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value='basic' className='space-y-4 mt-4'>
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='space-y-4'>
              <div>
                <Label className='dark:text-gray-200'>应用名称</Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 100))}
                  placeholder='输入应用名称'
                  maxLength={100}
                  className='mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
                <p className='text-xs text-gray-500 mt-1'>{name.length}/100</p>
              </div>

              <div>
                <Label className='dark:text-gray-200'>应用描述</Label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 800))}
                  placeholder='描述应用的功能和用途'
                  rows={4}
                  maxLength={800}
                  className='mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
                <p className='text-xs text-gray-500 mt-1'>{description.length}/800</p>
              </div>

              <div>
                <Label className='dark:text-gray-200'>应用标签（最多 5 个，每项最多 40 字符）</Label>
                <div className='space-y-2 mt-2'>
                  {tags.length < 5 && (
                    <div className='flex gap-2'>
                      <Input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value.slice(0, 40))}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder='输入后按回车，最多 40 字符'
                        maxLength={40}
                        className='w-64 min-w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      />
                      <Button type='button' size='sm' variant='outline' onClick={addTag} className='dark:border-gray-600 dark:text-gray-300'>
                        添加
                      </Button>
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((t, i) => (
                        <Badge
                          key={i}
                          variant='secondary'
                          className={`cursor-pointer border dark:border-gray-600 ${getTagColor(t, i)}`}
                          onClick={() => removeTag(i)}
                        >
                          {t} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                <Button
                  onClick={handleSaveBasicInfo}
                  disabled={savingBasic}
                  className='dark:bg-blue-600 dark:hover:bg-blue-700'
                >
                  <Save className='w-4 h-4 mr-2' />
                  {savingBasic ? '保存中...' : '保存基本信息'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 功能设置 */}
        {/* 功能设置 */}
        <TabsContent value='features' className='space-y-4 mt-4'>
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Paperclip className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>文件上传</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>允许用户上传文件</div>
                  </div>
                </div>
                <Switch checked={enableFileUpload} onCheckedChange={setEnableFileUpload} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Mic className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>语音输入</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>启用语音转文字功能</div>
                  </div>
                </div>
                <Switch checked={enableVoiceInput} onCheckedChange={setEnableVoiceInput} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <ImageIcon className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>图片输入</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>允许用户发送图片</div>
                  </div>
                </div>
                <Switch checked={enableImageInput} onCheckedChange={setEnableImageInput} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <MessageSquare className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>智能建议</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>显示相关问题建议</div>
                  </div>
                </div>
                <Switch checked={enableSuggestions} onCheckedChange={setEnableSuggestions} />
              </div>

              <div className='flex justify-end pt-4'>
                <Button
                  onClick={handleSaveFeatures}
                  disabled={savingFeatures}
                  className='dark:bg-blue-600 dark:hover:bg-blue-700'
                >
                  <Save className='w-4 h-4 mr-2' />
                  {savingFeatures ? '保存中...' : '保存功能设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value='security' className='space-y-4 mt-4'>
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Shield className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>内容过滤</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>过滤不当内容</div>
                  </div>
                </div>
                <Switch checked={enableContentFilter} onCheckedChange={setEnableContentFilter} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Lock className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>数据加密</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>加密存储对话数据</div>
                  </div>
                </div>
                <Switch checked={enableDataEncryption} onCheckedChange={setEnableDataEncryption} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div>
                <Label className='dark:text-gray-200'>数据保留期限（天）</Label>
                <Input
                  type='number'
                  value={dataRetentionDays}
                  onChange={e => setDataRetentionDays(e.target.value)}
                  className='mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
              </div>

              <div className='flex justify-end pt-4'>
                <Button
                  onClick={handleSaveSecurity}
                  disabled={savingSecurity}
                  className='dark:bg-blue-600 dark:hover:bg-blue-700'
                >
                  <Save className='w-4 h-4 mr-2' />
                  {savingSecurity ? '保存中...' : '保存安全设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 发布设置 */}
        <TabsContent value='publish' className='space-y-4 mt-4'>
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='space-y-4'>
              <div>
                <Label className='dark:text-gray-200'>发布状态</Label>
                <Select
                  value={publishStatus}
                  onValueChange={(v: 'draft' | 'published' | 'paused') => setPublishStatus(v)}
                >
                  <SelectTrigger className='mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='draft'>草稿</SelectItem>
                    <SelectItem value='published'>已发布</SelectItem>
                    <SelectItem value='paused'>已暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Globe className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>公开访问</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>允许任何人访问</div>
                  </div>
                </div>
                <Switch checked={publicAccess} onCheckedChange={setPublicAccess} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Code className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>嵌入代码</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>允许网站嵌入</div>
                  </div>
                </div>
                <Switch checked={embedEnabled} onCheckedChange={setEmbedEnabled} />
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Key className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <div className='dark:text-white'>API 访问</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>启用 API 调用</div>
                  </div>
                </div>
                <Switch checked={apiEnabled} onCheckedChange={setApiEnabled} />
              </div>

              <div className='flex justify-end pt-4'>
                <Button
                  onClick={handleSavePublish}
                  disabled={savingPublish}
                  className='dark:bg-blue-600 dark:hover:bg-blue-700'
                >
                  <Save className='w-4 h-4 mr-2' />
                  {savingPublish ? '保存中...' : '保存发布设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
