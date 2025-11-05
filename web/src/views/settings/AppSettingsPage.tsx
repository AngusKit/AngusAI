import { useState } from 'react';
import { useLanguage } from '@/ui/LanguageProvider';
import {
  Settings,
  Info,
  Zap,
  Database,
  MessageSquare,
  Puzzle,
  Shield,
  Key,
  Rocket,
  Save,
  Upload,
  Image as ImageIcon,
  Globe,
  Languages,
  Thermometer,
  Hash,
  BarChart,
  MessageCircle,
  FileText,
  Mic,
  Paperclip,
  Code,
  Lock,
  Eye,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Trash2,
  Plus,
  X,
  Search,
  MoreVertical,
  Clock,
  Users,
  GitBranch,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Switch } from '@/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Separator } from '@/ui/separator';
import { Slider } from '@/ui/slider';
import { toast } from 'sonner';
import { copyToClipboard } from '../../lib/clipboard';

interface KnowledgeBaseItem {
  id: number;
  name: string;
  documentsCount: number;
  enabled: boolean;
}

interface DatasetItem {
  id: number;
  name: string;
  type: string;
  dataCount: string;
  enabled: boolean;
}

interface WorkflowItem {
  id: number;
  name: string;
  type: string;
  nodesCount: number;
  enabled: boolean;
}

interface APIKey {
  id: number;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

interface AppSettingsPageProps {
  appId?: number;
  appName?: string;
  onBack?: () => void;
}

export function AppSettingsPage({ appId, appName = '智能客服助手', onBack }: AppSettingsPageProps) {
  const { t } = useLanguage();

  // 基本信息
  const [name, setName] = useState(appName);
  const [description, setDescription] = useState('基于AI的智能客服应用，提供24/7在线服务');
  const [category, setCategory] = useState('chatbot');
  const [language, setLanguage] = useState('zh-CN');

  // 模型配置
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [topP, setTopP] = useState([0.9]);
  const [frequencyPenalty, setFrequencyPenalty] = useState([0]);
  const [presencePenalty, setPresencePenalty] = useState([0]);

  // 知识库
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([
    { id: 1, name: '产品知识库', documentsCount: 128, enabled: true },
    { id: 2, name: '常见问题', documentsCount: 64, enabled: false },
    { id: 3, name: '技术文档', documentsCount: 256, enabled: false }
  ]);

  // 数据集
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    { id: 1, name: '客户对话数据集', type: '文本', dataCount: '12.5K 条', enabled: true },
    { id: 2, name: '技术问答集', type: '表格', dataCount: '5.2K 条', enabled: false },
    { id: 3, name: '产品评价数据集', type: '文本', dataCount: '18.7K 条', enabled: false }
  ]);

  // 工作流
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    { id: 1, name: '客服问答流程', type: '多轮对话流（记忆）', nodesCount: 8, enabled: true },
    { id: 2, name: '内容审核流程', type: '单轮任务流', nodesCount: 5, enabled: false },
    { id: 3, name: '数据处理流程', type: '单轮任务流', nodesCount: 12, enabled: false }
  ]);

  // 提示词设置
  const [systemPrompt, setSystemPrompt] = useState('你是一个专业的客服助手，请礼貌、专业地回答用户的问题。');
  const [contextPrompt, setContextPrompt] = useState('');

  // 对话设置
  const [welcomeMessage, setWelcomeMessage] = useState('您好！我是智能客服助手，有什么可以帮您？');
  const [openingQuestions, setOpeningQuestions] = useState([
    '如何查询订单状态？',
    '退换货政策是什么？',
    '如何联系人工客服？'
  ]);
  const [newQuestion, setNewQuestion] = useState('');

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
      status: 'active'
    },
    {
      id: 2,
      name: '测试环境',
      key: 'sk-test-xyz789***********',
      created: '2024-02-20',
      lastUsed: '3天前',
      status: 'active'
    }
  ]);

  // 发布设置
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('published');
  const [publicAccess, setPublicAccess] = useState(false);
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  const handleSaveBasicInfo = () => {
    toast.success('基本信息已保存');
  };

  const handleSaveModelConfig = () => {
    toast.success('模型配置已保存');
  };

  const handleSaveKnowledgeBase = () => {
    toast.success('知识库配置已保存');
  };

  const handleSavePrompt = () => {
    toast.success('提示词设置已保存');
  };

  const handleSaveConversation = () => {
    toast.success('对话设置已保存');
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

  const handleToggleKnowledgeBase = (id: number) => {
    setKnowledgeBases(prev =>
      prev.map(kb => ({ ...kb, enabled: kb.id === id }))
    );
  };

  const handleToggleDataset = (id: number) => {
    setDatasets(prev =>
      prev.map(ds => ({ ...ds, enabled: ds.id === id }))
    );
  };

  const handleToggleWorkflow = (id: number) => {
    setWorkflows(prev =>
      prev.map(wf => (wf.id === id ? { ...wf, enabled: !wf.enabled } : wf))
    );
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setOpeningQuestions([...openingQuestions, newQuestion]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setOpeningQuestions(openingQuestions.filter((_, i) => i !== index));
  };

  const handleCopyKey = (key: string) => {
    copyToClipboard(key);
  };

  const handleGenerateNewKey = () => {
    toast.success('新密钥已生成');
  };

  const handleRevokeKey = (id: number) => {
    setApiKeys(prev =>
      prev.map(key => (key.id === id ? { ...key, status: 'inactive' as const } : key))
    );
    toast.success('密钥已撤销');
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          )}
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">应用设置</h1>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
          配置 {name} 的各项参数和功能设置
        </p>
      </div>

      <Tabs defaultValue="basic" className="mt-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto dark:bg-gray-800">
          <TabsTrigger value="basic" className="dark:data-[state=active]:bg-gray-700">
            <Info className="w-4 h-4 mr-1" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="model" className="dark:data-[state=active]:bg-gray-700">
            <Zap className="w-4 h-4 mr-1" />
            模型配置
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="dark:data-[state=active]:bg-gray-700">
            <Database className="w-4 h-4 mr-1" />
            知识库
          </TabsTrigger>
          <TabsTrigger value="prompt" className="dark:data-[state=active]:bg-gray-700">
            <MessageSquare className="w-4 h-4 mr-1" />
            提示词
          </TabsTrigger>
          <TabsTrigger value="conversation" className="dark:data-[state=active]:bg-gray-700">
            <MessageCircle className="w-4 h-4 mr-1" />
            对话设置
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

        {/* 基本信息 */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">应用名称</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入应用名称"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <Label className="dark:text-gray-200">应用描述</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述应用的功能和用途"
                  rows={4}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-200">应用分类</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="chatbot">智能助手</SelectItem>
                      <SelectItem value="text-generation">文本生成</SelectItem>
                      <SelectItem value="knowledge">知识问答</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="dark:text-gray-200">
                    <Languages className="w-4 h-4 inline mr-1" />
                    默认语言
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveBasicInfo} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存基本信息
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 模型配置 */}
        <TabsContent value="model" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <Label className="dark:text-gray-200">AI 模型</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="dark:text-gray-200">
                    <Thermometer className="w-4 h-4 inline mr-1" />
                    Temperature (创造性)
                  </Label>
                  <span className="text-sm dark:text-gray-400">{temperature[0]}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  较低的值使输出更确定，较高的值使输出更随机
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="dark:text-gray-200">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Max Tokens (最大长度)
                  </Label>
                  <span className="text-sm dark:text-gray-400">{maxTokens[0]}</span>
                </div>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  min={256}
                  max={4096}
                  step={256}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="dark:text-gray-200">Top P (采样)</Label>
                  <span className="text-sm dark:text-gray-400">{topP[0]}</span>
                </div>
                <Slider
                  value={topP}
                  onValueChange={setTopP}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveModelConfig} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存模型配置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 知识库 */}
        <TabsContent value="knowledge" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="dark:text-white">知识库选择</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    选择一个知识库作为应用的知识来源
                  </p>
                </div>
                <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
                  <Plus className="w-4 h-4 mr-1" />
                  新建知识库
                </Button>
              </div>

              <div className="space-y-2">
                {knowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      kb.enabled
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleToggleKnowledgeBase(kb.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${kb.enabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          <Database className={`w-5 h-5 ${kb.enabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="dark:text-white">{kb.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {kb.documentsCount} 个文档
                          </div>
                        </div>
                      </div>
                      {kb.enabled && (
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveKnowledgeBase} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存知识库配置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 提示词 */}
        <TabsContent value="prompt" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">系统提示词</Label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="定义AI的角色和行为..."
                  rows={6}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  系统提示词定义了AI的基本行为和角色
                </p>
              </div>

              <div>
                <Label className="dark:text-gray-200">上下文提示词（可选）</Label>
                <Textarea
                  value={contextPrompt}
                  onChange={(e) => setContextPrompt(e.target.value)}
                  placeholder="添加额外的上下文信息..."
                  rows={4}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePrompt} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存提示词设置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 对话设置 */}
        <TabsContent value="conversation" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">欢迎消息</Label>
                <Input
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="输入欢迎消息"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <Label className="dark:text-gray-200">开场问题</Label>
                <div className="space-y-2 mt-2">
                  {openingQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={question}
                        readOnly
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(index)}
                        className="dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="添加新问题"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddQuestion();
                        }
                      }}
                    />
                    <Button onClick={handleAddQuestion} size="sm" className="dark:bg-blue-600">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveConversation} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存对话设置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 功能设置 */}
        <TabsContent value="features" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">文件上传</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">允许用户上传文件</div>
                  </div>
                </div>
                <Switch checked={enableFileUpload} onCheckedChange={setEnableFileUpload} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">语音输入</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">启用语音转文字功能</div>
                  </div>
                </div>
                <Switch checked={enableVoiceInput} onCheckedChange={setEnableVoiceInput} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">图片输入</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">允许用户发送图片</div>
                  </div>
                </div>
                <Switch checked={enableImageInput} onCheckedChange={setEnableImageInput} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">智能建议</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">显示相关问题建议</div>
                  </div>
                </div>
                <Switch checked={enableSuggestions} onCheckedChange={setEnableSuggestions} />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveFeatures} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存功能设置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">内容过滤</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">过滤不当内容</div>
                  </div>
                </div>
                <Switch checked={enableContentFilter} onCheckedChange={setEnableContentFilter} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">数据加密</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">加密存储对话数据</div>
                  </div>
                </div>
                <Switch checked={enableDataEncryption} onCheckedChange={setEnableDataEncryption} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div>
                <Label className="dark:text-gray-200">数据保留期限（天）</Label>
                <Input
                  type="number"
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(e.target.value)}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecurity} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存安全设置
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 发布设置 */}
        <TabsContent value="publish" className="space-y-4 mt-4">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">发布状态</Label>
                <Select value={publishStatus} onValueChange={(v: 'draft' | 'published') => setPublishStatus(v)}>
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">公开访问</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">允许任何人访问</div>
                  </div>
                </div>
                <Switch checked={publicAccess} onCheckedChange={setPublicAccess} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">嵌入代码</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">允许网站嵌入</div>
                  </div>
                </div>
                <Switch checked={embedEnabled} onCheckedChange={setEmbedEnabled} />
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white">API 访问</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">启用 API 调用</div>
                  </div>
                </div>
                <Switch checked={apiEnabled} onCheckedChange={setApiEnabled} />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePublish} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
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
