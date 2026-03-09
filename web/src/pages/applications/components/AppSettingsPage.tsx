import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
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
import { copyToClipboard } from '@/lib/clipboard.ts';
import { useNavigate } from 'react-router-dom';
import { getTagColor } from '../utils.ts';

interface APIKey {
  id: number;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

export function AppSettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/apps');
  };
  // 基本信息
  const [name, setName] = useState('智能客服助手');
  const [description, setDescription] = useState('基于AI的智能客服应用，提供24/7在线服务');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 功能设置
  const [enableFileUpload, setEnableFileUpload] = useState(true);
  const [enableVoiceInput, setEnableVoiceInput] = useState(true);
  const [enableImageInput, setEnableImageInput] = useState(false);
  const [enableSuggestions, setEnableSuggestions] = useState(true);
  const [enableHistory, setEnableHistory] = useState(true);
  const [maxHistoryLength, setMaxHistoryLength] = useState('50');

  // 安全与隐私
  const [enableContentFilter, setEnableContentFilter] = useState(true);
  const [enableDataEncryption, setEnableDataEncryption] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState('30');
  const [enableAnonymization, setEnableAnonymization] = useState(false);

  // API密钥
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 1,
      name: '生产环境',
      key: 'sk-prod-abc123***********',
      created: '2024-01-15',
      lastUsed: '2分钟前',
      status: 'active',
    },
    {
      id: 2,
      name: '测试环境',
      key: 'sk-test-xyz789***********',
      created: '2024-02-20',
      lastUsed: '3天前',
      status: 'active',
    },
  ]);

  // 发布设置
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('published');
  const [publicAccess, setPublicAccess] = useState(false);
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  const addTag = () => {
    const t = tagInput.trim().slice(0, 40);
    if (!t || tags.length >= 5) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  const handleSaveBasicInfo = () => {
    toast.success('基本信息已保存');
  };

  const handleSaveFeatures = () => {
    toast.success('功能设置已保存');
  };

  const handleSaveSecurity = () => {
    toast.success('安全设置已保存');
  };

  const handleSavePublish = () => {
    toast.success('发布设置已保存');
  };

  const handleCopyKey = (key: string) => {
    copyToClipboard(key);
  };

  const handleGenerateNewKey = () => {
    toast.success('新密钥已生成');
  };

  const handleRevokeKey = (id: number) => {
    setApiKeys(prev => prev.map(key => (key.id === id ? { ...key, status: 'inactive' as const } : key)));
    toast.success('密钥已撤销');
  };

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
                <Button onClick={handleSaveBasicInfo} className='dark:bg-blue-600 dark:hover:bg-blue-700'>
                  <Save className='w-4 h-4 mr-2' />
                  保存基本信息
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 对话设置 */}
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
                <Button onClick={handleSaveFeatures} className='dark:bg-blue-600 dark:hover:bg-blue-700'>
                  <Save className='w-4 h-4 mr-2' />
                  保存功能设置
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
                <Button onClick={handleSaveSecurity} className='dark:bg-blue-600 dark:hover:bg-blue-700'>
                  <Save className='w-4 h-4 mr-2' />
                  保存安全设置
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
                <Select value={publishStatus} onValueChange={(v: 'draft' | 'published') => setPublishStatus(v)}>
                  <SelectTrigger className='mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='draft'>草稿</SelectItem>
                    <SelectItem value='published'>已发布</SelectItem>
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
                <Button onClick={handleSavePublish} className='dark:bg-blue-600 dark:hover:bg-blue-700'>
                  <Save className='w-4 h-4 mr-2' />
                  保存发布设置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
