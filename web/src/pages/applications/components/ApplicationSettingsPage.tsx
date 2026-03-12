import {
  Settings,
  Info,
  Puzzle,
  Shield,
  Key,
  Rocket,
  Save,
  Image as ImageIcon,
  Globe,
  Mic,
  Paperclip,
  Code,
  Lock,
  ArrowLeft,
  BookmarkPlus,
  List,
  LayoutGrid,
  Settings2,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getTagColor } from '../utils';
import { useAppSettings } from '../hooks';
import { NAME_MAX_LENGTH, DESC_MAX_LENGTH, TAG_MAX_COUNT, TAG_MAX_LENGTH } from '../constants';

/**
 * 应用设置页：基本信息、功能、安全、发布配置
 */
export function ApplicationSettingsPage() {
  const hook = useAppSettings();

  if (hook.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页头：返回 + 标题 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={hook.handleBack} className="dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">应用设置</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">配置「{hook.name}」的各项参数和功能设置</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="mt-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-5 gap-2 h-auto dark:bg-gray-800">
          <TabsTrigger value="basic" className="dark:data-[state=active]:bg-gray-700">
            <Info className="w-4 h-4 mr-1" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="features" className="dark:data-[state=active]:bg-gray-700">
            <Puzzle className="w-4 h-4 mr-1" />
            功能
          </TabsTrigger>
          <TabsTrigger value="security" className="dark:data-[state=active]:bg-gray-700">
            <Shield className="w-4 h-4 mr-1" />
            安全
          </TabsTrigger>
          <TabsTrigger value="publish" className="dark:data-[state=active]:bg-gray-700">
            <Rocket className="w-4 h-4 mr-1" />
            发布
          </TabsTrigger>
        </TabsList>

        {/* Tab：基本信息 */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">应用名称</Label>
                <Input
                  value={hook.name}
                  onChange={e => hook.setName(e.target.value.slice(0, NAME_MAX_LENGTH))}
                  placeholder="输入应用名称"
                  maxLength={NAME_MAX_LENGTH}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">{hook.name.length}/{NAME_MAX_LENGTH}</p>
              </div>
              <div>
                <Label className="dark:text-gray-200">应用描述</Label>
                <Textarea
                  value={hook.description}
                  onChange={e => hook.setDescription(e.target.value.slice(0, DESC_MAX_LENGTH))}
                  placeholder="描述应用的功能和用途"
                  rows={4}
                  maxLength={DESC_MAX_LENGTH}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">{hook.description.length}/{DESC_MAX_LENGTH}</p>
              </div>
              <div>
                <Label className="dark:text-gray-200">应用标签（最多 {TAG_MAX_COUNT} 个，每项最多 {TAG_MAX_LENGTH} 字符）</Label>
                <div className="space-y-2 mt-2">
                  {hook.tags.length < TAG_MAX_COUNT && (
                    <div className="flex gap-2">
                      <Input
                        value={hook.tagInput}
                        onChange={e => hook.setTagInput(e.target.value.slice(0, TAG_MAX_LENGTH))}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), hook.addTag())}
                        placeholder={`输入后按回车，最多 ${TAG_MAX_LENGTH} 字符`}
                        maxLength={TAG_MAX_LENGTH}
                        className="w-64 min-w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={hook.addTag} className="dark:border-gray-600 dark:text-gray-300">
                        添加
                      </Button>
                    </div>
                  )}
                  {hook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hook.tags.map((t, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className={`cursor-pointer border dark:border-gray-600 ${getTagColor(t, i)}`}
                          onClick={() => hook.removeTag(i)}
                        >
                          {t} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={hook.handleSaveBasicInfo} disabled={hook.savingBasic} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {hook.savingBasic ? '保存中...' : '保存基本信息'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab：功能设置 */}
        <TabsContent value="features" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <FeatureSwitch icon={<Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="文件上传" desc="允许用户上传文件" checked={hook.enableFileUpload} onCheckedChange={hook.setEnableFileUpload} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="语音输入" desc="启用语音转文字功能" checked={hook.enableVoiceInput} onCheckedChange={hook.setEnableVoiceInput} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="图片输入" desc="允许用户发送图片" checked={hook.enableImageInput} onCheckedChange={hook.setEnableImageInput} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<BookmarkPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="提示词库" desc="允许用户在对话页面选择提示词" checked={hook.enablePromptLibrary} onCheckedChange={hook.setEnablePromptLibrary} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<List className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="会话列表" desc="允许用户在对话页面查看对话记录" checked={hook.enableSessionList} onCheckedChange={hook.setEnableSessionList} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<LayoutGrid className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="切换应用" desc="允许切换应用、默认智能体、默认模型，关闭时会隐藏应用切换" checked={hook.enableSwitchApp} onCheckedChange={hook.setEnableSwitchApp} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="会话设置" desc="用户可以在对话页面进行温度、最大token等参数设置" checked={hook.enableSessionSettings} onCheckedChange={hook.setEnableSessionSettings} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="外观设置" desc="用户可以在对话页面进行主题、外观等设置" checked={hook.enableAppearanceSettings} onCheckedChange={hook.setEnableAppearanceSettings} />
              <div className="flex justify-end pt-4">
                <Button onClick={hook.handleSaveFeatures} disabled={hook.savingFeatures} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {hook.savingFeatures ? '保存中...' : '保存功能设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab：安全设置 */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <FeatureSwitch icon={<Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="内容过滤" desc="过滤不当内容" checked={hook.enableContentFilter} onCheckedChange={hook.setEnableContentFilter} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="数据加密" desc="加密存储对话数据" checked={hook.enableDataEncryption} onCheckedChange={hook.setEnableDataEncryption} />
              <Separator className="dark:bg-gray-700" />
              <div>
                <Label className="dark:text-gray-200">数据保留期限（天）</Label>
                <Input
                  type="number"
                  value={hook.dataRetentionDays}
                  onChange={e => hook.setDataRetentionDays(e.target.value)}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={hook.handleSaveSecurity} disabled={hook.savingSecurity} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {hook.savingSecurity ? '保存中...' : '保存安全设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab：发布设置 */}
        <TabsContent value="publish" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">发布状态</Label>
                <Select value={hook.publishStatus} onValueChange={hook.setPublishStatus}>
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="公开访问" desc="允许任何人访问" checked={hook.publicAccess} onCheckedChange={hook.setPublicAccess} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="嵌入代码" desc="允许网站嵌入" checked={hook.embedEnabled} onCheckedChange={hook.setEmbedEnabled} />
              <Separator className="dark:bg-gray-700" />
              <FeatureSwitch icon={<Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="API 访问" desc="启用 API 调用" checked={hook.apiEnabled} onCheckedChange={hook.setApiEnabled} />
              <div className="flex justify-end pt-4">
                <Button onClick={hook.handleSavePublish} disabled={hook.savingPublish} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {hook.savingPublish ? '保存中...' : '保存发布设置'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** 功能开关行（图标+标题+描述+Switch） */
function FeatureSwitch({
  icon,
  title,
  desc,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="dark:text-white">{title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
