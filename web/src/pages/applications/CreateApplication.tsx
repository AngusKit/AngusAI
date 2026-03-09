import { MessageSquare, Sparkles, HelpCircle, Bot, ChevronLeft, ChevronRight, Check, Code2, Search, Zap, Database, FileText, Users, Send, Palette, Image, Smile, Star, Heart, Briefcase, Coffee, Globe, Bookmark, Cloud, Cpu, Music, Video, Camera, Mail, Phone, Map, Calendar, Bell, Settings, Folder, Archive, Download, Upload, Share2, Lock, Unlock, Eye, EyeOff, Edit, Trash2, Copy, Link, Hash, Percent, TrendingUp, BarChart, PieChart, Activity, Target, Flag, Award, Gift, Rocket, Layers, Command, BookOpen, } from 'lucide-react';
import Agents from '@/services/Agents';
import Applications from '@/services/Applications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type AppType = 'chatbot' | 'text-generation' | 'knowledge' | 'agent';
type ModelType =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'llama-3-70b'
  | 'llama-3-8b'
  | 'gemini-pro'
  | 'mistral-large';
type TemplateType = 'modern-blue' | 'minimal-gray' | 'elegant-purple' | 'warm-orange';
type IconType =
  | 'message'
  | 'sparkles'
  | 'help'
  | 'bot'
  | 'zap'
  | 'database'
  | 'file'
  | 'users'
  | 'palette'
  | 'image'
  | 'smile'
  | 'star'
  | 'heart'
  | 'briefcase'
  | 'coffee'
  | 'globe'
  | 'bookmark'
  | 'cloud'
  | 'cpu'
  | 'music'
  | 'video'
  | 'camera'
  | 'mail'
  | 'phone'
  | 'map'
  | 'calendar'
  | 'bell'
  | 'settings'
  | 'folder'
  | 'archive'
  | 'download'
  | 'upload'
  | 'share'
  | 'lock'
  | 'unlock'
  | 'eye'
  | 'eyeoff'
  | 'edit'
  | 'trash'
  | 'copy'
  | 'link'
  | 'hash'
  | 'percent'
  | 'trending'
  | 'barchart'
  | 'piechart'
  | 'activity'
  | 'target'
  | 'flag'
  | 'award'
  | 'gift'
  | 'rocket'
  | 'layers'
  | 'command';

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; title: string; description: string }[];
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className='mb-12'>
      <div className='flex items-center justify-center'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex items-center'>
            <div className='flex flex-col items-center relative'>
              {/* 步骤圆圈 */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.number === currentStep
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110'
                    : step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className='w-6 h-6' />
                ) : (
                  <span className='text-lg'>{step.number}</span>
                )}
              </div>
              {/* 步骤标题和描述 */}
              <div className='mt-3 text-center'>
                <div
                  className={`text-sm transition-colors ${
                    step.number === currentStep
                      ? 'text-blue-500'
                      : step.number < currentStep
                        ? 'text-green-500'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
                <div className='text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[100px]'>{step.description}</div>
              </div>
            </div>
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div className='relative' style={{ width: '120px', marginBottom: '60px' }}>
                {/* 背景线 */}
                <div className='h-0.5 bg-gray-200 dark:bg-gray-700 absolute top-0 left-0 right-0' />
                {/* 进度线 */}
                <div
                  className={`h-0.5 absolute top-0 left-0 transition-all duration-500 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ width: step.number < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateApplication() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AppType | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [agentsList, setAgentsList] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-blue');
  const [selectedIcon, setSelectedIcon] = useState<IconType>('message');
  const [temperature, setTemperature] = useState([0.7]);
  const [enableLongConversation, setEnableLongConversation] = useState(true);
  const [enablePreciseAnalysis, setEnablePreciseAnalysis] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testMessages, setTestMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
  const [selectedAPICollection, setSelectedAPICollection] = useState<number | null>(null);

  const onBack = () => {
    navigate('/apps');
  };

  useEffect(() => {
    if (currentStep === 2) {
      setAgentsLoading(true);
      Agents.getAgentList({
        status: 'ACTIVE',
        bindable: true,
        pageNo: 1,
        pageSize: 100,
        keyword: agentSearchQuery.trim() || undefined,
      })
        .then((res: any) => {
          const data = res?.data;
          const list = data?.list ?? [];
          setAgentsList(
            list.map((a: any) => ({
              id: a.id != null ? String(a.id) : '',
              name: a.name ?? '--',
              description: a.description,
            }))
          );
        })
        .catch((e) => {
          console.error('Failed to load agents:', e);
          setAgentsList([]);
        })
        .finally(() => setAgentsLoading(false));
    }
  }, [currentStep, agentSearchQuery]);

  const steps = [
    {
      number: 1,
      title: t('createApp.selectType'),
      description: t('createApp.selectTypeDesc'),
    },
    {
      number: 2,
      title: t('createApp.configModel'),
      description: t('createApp.configModelDesc'),
    },
    {
      number: 3,
      title: t('createApp.setParams'),
      description: t('createApp.setParamsDesc'),
    },
    {
      number: 4,
      title: '关联资源',
      description: '知识库、数据集、工作流、接口',
    },
    {
      number: 5,
      title: t('createApp.previewComplete'),
      description: t('createApp.previewCompleteDesc'),
    },
  ];

  const appTypes = [
    {
      id: 'chatbot' as AppType,
      name: '聊天助手',
      description: '创建智能对话助手，支持多轮对话和上下文理解',
      icon: MessageSquare,
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      id: 'text-generation' as AppType,
      name: '内容创作',
      description: 'AI 内容创作工具，自动生成文章、广告文案等',
      icon: Sparkles,
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      id: 'knowledge' as AppType,
      name: '知识问答',
      description: '基于知识库的智能问答系统，快速检索和回答',
      icon: HelpCircle,
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      id: 'agent' as AppType,
      name: 'Agent 代理',
      description: '智能任务执行代理，支持多步推理和任务处理',
      icon: Bot,
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
  ];

  const templates = [
    {
      id: 'modern-blue' as TemplateType,
      name: '现代蓝',
      description: '专业清新的蓝色主题',
      primaryColor: 'bg-blue-500',
      secondaryColor: 'bg-blue-50 dark:bg-blue-900/20',
      accentColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'minimal-gray' as TemplateType,
      name: '简约灰',
      description: '简洁优雅的灰色主题',
      primaryColor: 'bg-gray-700',
      secondaryColor: 'bg-gray-50 dark:bg-gray-800',
      accentColor: 'border-gray-200 dark:border-gray-700',
    },
    {
      id: 'elegant-purple' as TemplateType,
      name: '优雅紫',
      description: '高雅精致的紫色主题',
      primaryColor: 'bg-purple-500',
      secondaryColor: 'bg-purple-50 dark:bg-purple-900/20',
      accentColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 'warm-orange' as TemplateType,
      name: '温暖橙',
      description: '活力温馨的橙色主题',
      primaryColor: 'bg-orange-500',
      secondaryColor: 'bg-orange-50 dark:bg-orange-900/20',
      accentColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  const iconOptions = [
    { id: 'message' as IconType, icon: MessageSquare, label: '消息' },
    { id: 'sparkles' as IconType, icon: Sparkles, label: '星星' },
    { id: 'help' as IconType, icon: HelpCircle, label: '帮助' },
    { id: 'bot' as IconType, icon: Bot, label: '机器人' },
    { id: 'zap' as IconType, icon: Zap, label: '闪电' },
    { id: 'database' as IconType, icon: Database, label: '数据库' },
    { id: 'file' as IconType, icon: FileText, label: '文件' },
    { id: 'users' as IconType, icon: Users, label: '用户' },
    { id: 'palette' as IconType, icon: Palette, label: '调色板' },
    { id: 'image' as IconType, icon: Image, label: '图片' },
    { id: 'smile' as IconType, icon: Smile, label: '笑脸' },
    { id: 'star' as IconType, icon: Star, label: '星标' },
    { id: 'heart' as IconType, icon: Heart, label: '心' },
    { id: 'briefcase' as IconType, icon: Briefcase, label: '公文包' },
    { id: 'coffee' as IconType, icon: Coffee, label: '咖啡' },
    { id: 'globe' as IconType, icon: Globe, label: '地球' },
    { id: 'bookmark' as IconType, icon: Bookmark, label: '书签' },
    { id: 'cloud' as IconType, icon: Cloud, label: '云' },
    { id: 'cpu' as IconType, icon: Cpu, label: 'CPU' },
    { id: 'music' as IconType, icon: Music, label: '音乐' },
    { id: 'video' as IconType, icon: Video, label: '视频' },
    { id: 'camera' as IconType, icon: Camera, label: '相机' },
    { id: 'mail' as IconType, icon: Mail, label: '邮件' },
    { id: 'phone' as IconType, icon: Phone, label: '电话' },
    { id: 'map' as IconType, icon: Map, label: '地图' },
    { id: 'calendar' as IconType, icon: Calendar, label: '日历' },
    { id: 'bell' as IconType, icon: Bell, label: '通知' },
    { id: 'settings' as IconType, icon: Settings, label: '设置' },
    { id: 'folder' as IconType, icon: Folder, label: '文件夹' },
    { id: 'archive' as IconType, icon: Archive, label: '归档' },
    { id: 'download' as IconType, icon: Download, label: '下载' },
    { id: 'upload' as IconType, icon: Upload, label: '上传' },
    { id: 'share' as IconType, icon: Share2, label: '分享' },
    { id: 'lock' as IconType, icon: Lock, label: '锁定' },
    { id: 'unlock' as IconType, icon: Unlock, label: '解锁' },
    { id: 'eye' as IconType, icon: Eye, label: '可见' },
    { id: 'eyeoff' as IconType, icon: EyeOff, label: '隐藏' },
    { id: 'edit' as IconType, icon: Edit, label: '编辑' },
    { id: 'trash' as IconType, icon: Trash2, label: '删除' },
    { id: 'copy' as IconType, icon: Copy, label: '复制' },
    { id: 'link' as IconType, icon: Link, label: '链接' },
    { id: 'hash' as IconType, icon: Hash, label: '标签' },
    { id: 'percent' as IconType, icon: Percent, label: '百分比' },
    { id: 'trending' as IconType, icon: TrendingUp, label: '趋势' },
    { id: 'barchart' as IconType, icon: BarChart, label: '柱状图' },
    { id: 'piechart' as IconType, icon: PieChart, label: '饼图' },
    { id: 'activity' as IconType, icon: Activity, label: '活动' },
    { id: 'target' as IconType, icon: Target, label: '目标' },
    { id: 'flag' as IconType, icon: Flag, label: '标记' },
    { id: 'award' as IconType, icon: Award, label: '奖励' },
    { id: 'gift' as IconType, icon: Gift, label: '礼物' },
    { id: 'rocket' as IconType, icon: Rocket, label: '火箭' },
    { id: 'layers' as IconType, icon: Layers, label: '层级' },
    { id: 'command' as IconType, icon: Command, label: '命令' },
  ];

  const filteredAgents = agentsList.filter(
    a =>
      a.name.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      (a.description ?? '').toLowerCase().includes(agentSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (currentStep === 2) {
      setAgentsLoading(true);
      Agents.getAgentList({ bindable: true, pageNo: 1, pageSize: 100 })
        .then((res: any) => {
          const data = res?.data;
          const list = (data?.list ?? []).map((item: any) => ({
            id: item.id != null ? String(item.id) : '',
            name: item.name ?? '--',
            description: item.description,
          }));
          setAgentsList(list);
        })
        .catch(() => setAgentsList([]))
        .finally(() => setAgentsLoading(false));
    }
  }, [currentStep]);


  const iconToEmoji: Record<IconType, string> = {
    message: '💬',
    sparkles: '✨',
    help: '❓',
    bot: '🤖',
    zap: '⚡',
    database: '🗄️',
    file: '📄',
    users: '👥',
    palette: '🎨',
    image: '🖼️',
    smile: '😊',
    star: '⭐',
    heart: '❤️',
    briefcase: '💼',
    coffee: '☕',
    globe: '🌐',
    bookmark: '🔖',
    cloud: '☁️',
    cpu: '💻',
    music: '🎵',
    video: '🎬',
    camera: '📷',
    mail: '📧',
    phone: '📱',
    map: '🗺️',
    calendar: '📅',
    bell: '🔔',
    settings: '⚙️',
    folder: '📁',
    archive: '📦',
    download: '⬇️',
    upload: '⬆️',
    share: '🔗',
    lock: '🔒',
    unlock: '🔓',
    eye: '👁️',
    eyeoff: '🙈',
    edit: '✏️',
    trash: '🗑️',
    copy: '📋',
    link: '🔗',
    hash: '#',
    percent: '%',
    trending: '📈',
    barchart: '📊',
    piechart: '🥧',
    activity: '📌',
    target: '🎯',
    flag: '🚩',
    award: '🏆',
    gift: '🎁',
    rocket: '🚀',
    layers: '📚',
    command: '⌘',
  };

  const handleNext = async () => {
    if (currentStep === 1 && !selectedType) {
      toast.error('请选择一个应用类型');
      return;
    }
    if (currentStep === 2 && !selectedAgent) {
      toast.error('请选择一个智能体');
      return;
    }
    if (currentStep === 3) {
      if (!appName.trim()) {
        toast.error('请输入应用名称');
        return;
      }
      if (!appDescription.trim()) {
        toast.error('请输入应用描述');
        return;
      }
    }
    // 步骤4（关联资源）是可选的，不需要验证
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!selectedAgent) {
        toast.error('请选择智能体');
        return;
      }
      try {
        await Applications.createApplication({
          name: appName.trim(),
          icon: iconToEmoji[selectedIcon] || '🤖',
          description: appDescription.trim() || undefined,
          tags: selectedType ? [selectedType] : [],
          agentIds: [selectedAgent.id],
          defaultAgentId: selectedAgent.id,
        });
        toast.success('应用创建成功！');
        onBack();
      } catch (error: any) {
        toast.error(error?.message || error?.data?.message || '创建失败');
      }
    }
  };

  const handleSkipStep4 = () => {
    toast.info('已跳过资源关联');
    setCurrentStep(5);
  };

  const handleSaveDraft = () => {
    toast.success('应用已保存为草稿！');
    onBack();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSendTestMessage = () => {
    if (!testMessage.trim()) return;

    setTestMessages([...testMessages, { role: 'user', content: testMessage }]);
    setTestMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        '您好！我已经理解了您的问题，让我为您详细解答。',
        '这是一个很好的问题。根据您的需求，我建议...',
        '我可以帮您处理这个任务。让我们一步步来完成。',
        welcomeMessage || '感谢您的提问！我会尽力为您提供帮助。',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)] ?? '';
      setTestMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
  };

  const getTypeSpecificDefaults = () => {
    switch (selectedType) {
      case 'chatbot':
        return {
          namePrefix: '智能客服助手',
          descriptionTemplate:
            '这是一个智能客服对话助手，支持多轮对话和上下文理解，能够快速理解用户需求并提供专业的解决方案。',
          welcomeTemplate: '您好！我是智能客服助手，有什么可以帮助您的吗？',
        };
      case 'text-generation':
        return {
          namePrefix: '内容创作助手',
          descriptionTemplate:
            '这是一个AI内容创作工具，可以自动生成高质量的文章、广告文案和社交媒体内容，帮助您快速完成内容创作。',
          welcomeTemplate: '欢迎使用内容创作助手！请告诉我您需要创作什么类型的内容。',
        };
      case 'knowledge':
        return {
          namePrefix: '知识库问答助手',
          descriptionTemplate:
            '这是一个基于知识库的智能问答系统，可以快速检索相关信息并提供准确的答案，支持多语言和文档管理。',
          welcomeTemplate: '您好！我可以帮您查询知识库中的信息，请问有什么问题？',
        };
      case 'agent':
        return {
          namePrefix: 'Agent 任务代理',
          descriptionTemplate: '这是一个智能任务执行代理，支持多步推理和复杂任务处理，可以自动完成各种工作流程。',
          welcomeTemplate: '您好！我是智能任务代理，可以帮您执行各种任务，请告诉我需要做什么。',
        };
      default:
        return {
          namePrefix: '',
          descriptionTemplate: '',
          welcomeTemplate: '',
        };
    }
  };

  const getSelectedIcon = () => {
    const iconObj = iconOptions.find(i => i.id === selectedIcon);
    return iconObj?.icon || MessageSquare;
  };

  const renderStep1 = () => (
    <div className='animate-in fade-in duration-500'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl mb-2 dark:text-white'>选择应用类型</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>选择最适合您需要的应用类型，您可以随时修改配置</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {appTypes.map(type => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedType === type.id
                  ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <div className='flex items-start gap-4'>
                <div
                  className={`${type.iconBg} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <Icon className='w-7 h-7 text-white' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h3 className='text-lg dark:text-white'>{type.name}</h3>
                    {selectedType === type.id && <Check className='w-5 h-5 text-blue-500' />}
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className='animate-in fade-in duration-500'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl mb-2 dark:text-white'>选择智能体</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          选择要绑定到应用的智能体，应用将使用该智能体的能力进行对话
        </p>
      </div>

      {/* 搜索框 */}
      <div className='mb-6'>
        <div className='relative max-w-2xl mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
          <Input
            placeholder='搜索智能体名称、描述...'
            value={agentSearchQuery}
            onChange={e => setAgentSearchQuery(e.target.value)}
            className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
        </div>
      </div>

      {/* 智能体列表 */}
      <div>
        <ScrollArea className='h-[500px] pr-4'>
          <div className='space-y-3'>
            {agentsLoading ? (
              <div className='py-12 text-center text-gray-500 dark:text-gray-400'>加载中...</div>
            ) : filteredAgents.length === 0 ? (
              <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
                暂无可用智能体，请先在智能体管理中创建
              </div>
            ) : (
              filteredAgents.map(agent => (
                <Card
                  key={agent.id}
                  onClick={() => setSelectedAgent({ id: agent.id, name: agent.name })}
                  className={`p-5 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                    selectedAgent?.id === agent.id
                      ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800'
                  }`}
                >
                  <div className='flex items-start gap-4'>
                    <div className='bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Bot className='w-6 h-6 text-white' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2 mb-1'>
                        <h3 className='dark:text-white'>{agent.name}</h3>
                        {selectedAgent?.id === agent.id && <Check className='w-5 h-5 text-blue-500' />}
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {agent.description || '暂无描述'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const defaults = getTypeSpecificDefaults();
    const selectedTypeObj = appTypes.find(t => t.id === selectedType);
    const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);
    const SelectedIcon = getSelectedIcon();

    return (
      <div className='animate-in fade-in duration-500'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl mb-2 dark:text-white'>{selectedTypeObj?.name}设置</h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>配置对话模式入口和其他相关参数</p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 左侧：基本信息和参数 */}
          <div className='space-y-6'>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <h3 className='text-lg mb-4 dark:text-white'>基本信息</h3>
              <div className='space-y-4'>
                <div>
                  <Label className='text-sm mb-2 block dark:text-gray-300'>应用名称</Label>
                  <Input
                    placeholder={defaults.namePrefix}
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
                  />
                </div>

                <div>
                  <Label className='text-sm mb-2 block dark:text-gray-300'>应用描述</Label>
                  <Textarea
                    placeholder={defaults.descriptionTemplate}
                    value={appDescription}
                    onChange={e => setAppDescription(e.target.value)}
                    rows={4}
                    className='dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none'
                  />
                </div>

                <div>
                  <Label className='text-sm mb-2 block dark:text-gray-300'>欢迎语</Label>
                  <Textarea
                    placeholder={defaults.welcomeTemplate}
                    value={welcomeMessage}
                    onChange={e => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className='dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none'
                  />
                </div>
              </div>
            </Card>

            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <h3 className='text-lg mb-4 dark:text-white'>应用图标</h3>
              <ScrollArea className='h-32'>
                <div className='grid grid-cols-8 gap-2 pr-4'>
                  {iconOptions.map(iconOption => {
                    const IconComp = iconOption.icon;
                    return (
                      <button
                        key={iconOption.id}
                        onClick={() => setSelectedIcon(iconOption.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          selectedIcon === iconOption.id
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={iconOption.label}
                      >
                        <IconComp className='w-5 h-5' />
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>

            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <h3 className='text-lg mb-4 dark:text-white'>高级参数</h3>
              <div className='space-y-6'>
                <div>
                  <Label className='text-sm mb-3 block dark:text-gray-300'>温度参数</Label>
                  <div className='space-y-3'>
                    <Slider value={temperature} onValueChange={setTemperature} max={1} step={0.1} className='w-full' />
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500 dark:text-gray-400'>保守</span>
                      <span className='dark:text-white'>{temperature[0]}</span>
                      <span className='text-gray-500 dark:text-gray-400'>创造</span>
                    </div>
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                    <div className='flex-1'>
                      <div className='dark:text-white text-sm'>长对话性</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>保留历史上下文信息</div>
                    </div>
                    <Switch checked={enableLongConversation} onCheckedChange={setEnableLongConversation} />
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                    <div className='flex-1'>
                      <div className='dark:text-white text-sm'>精确分析</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>提升准确性但可能降低速度</div>
                    </div>
                    <Switch checked={enablePreciseAnalysis} onCheckedChange={setEnablePreciseAnalysis} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧：外观模板和预览 */}
          <div className='space-y-6'>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <h3 className='text-lg mb-4 dark:text-white'>外观模板</h3>
              <div className='space-y-3'>
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <div className='dark:text-white'>{template.name}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>{template.description}</div>
                      </div>
                      {selectedTemplate === template.id && <Check className='w-5 h-5 text-blue-500' />}
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <div className={`w-8 h-8 ${template.primaryColor} rounded`}></div>
                      <div
                        className={`w-8 h-8 ${template.secondaryColor} rounded border ${template.accentColor}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className={`p-6 ${selectedTemplateObj?.secondaryColor} border-2 ${selectedTemplateObj?.accentColor}`}>
              <h3 className='text-lg mb-4 dark:text-white flex items-center gap-2'>
                <Palette className='w-5 h-5' />
                外观预览
              </h3>

              {/* 聊天界面预览 */}
              <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden'>
                {/* 聊天头部 */}
                <div className={`${selectedTemplateObj?.primaryColor} p-4 flex items-center gap-3`}>
                  <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                    <SelectedIcon className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <div className='text-white'>{appName || '应用名称'}</div>
                    <div className='text-white/80 text-xs'>在线</div>
                  </div>
                </div>

                {/* 聊天消息 */}
                <div className='p-4 space-y-3 h-64 overflow-y-auto'>
                  {/* 助手消息 */}
                  <div className='flex gap-2'>
                    <div
                      className={`${selectedTemplateObj?.primaryColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <SelectedIcon className='w-4 h-4 text-white' />
                    </div>
                    <div
                      className={`${selectedTemplateObj?.secondaryColor} p-3 rounded-lg rounded-tl-none max-w-[80%]`}
                    >
                      <p className='text-sm dark:text-white'>
                        {welcomeMessage || defaults.welcomeTemplate || '欢迎使用！'}
                      </p>
                    </div>
                  </div>

                  {/* 用户消息示例 */}
                  <div className='flex gap-2 justify-end'>
                    <div className={`${selectedTemplateObj?.primaryColor} p-3 rounded-lg rounded-tr-none max-w-[80%]`}>
                      <p className='text-sm text-white'>你好，请问你能帮我做什么？</p>
                    </div>
                  </div>

                  {/* 助手回复示例 */}
                  <div className='flex gap-2'>
                    <div
                      className={`${selectedTemplateObj?.primaryColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <SelectedIcon className='w-4 h-4 text-white' />
                    </div>
                    <div
                      className={`${selectedTemplateObj?.secondaryColor} p-3 rounded-lg rounded-tl-none max-w-[80%]`}
                    >
                      <p className='text-sm dark:text-white'>
                        {appDescription || defaults.descriptionTemplate || '我可以帮助您解决各种问题！'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 输入框 */}
                <div className={`p-3 border-t ${selectedTemplateObj?.accentColor}`}>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      placeholder='输入消息...'
                      className='flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm outline-none'
                      disabled
                    />
                    <button className={`${selectedTemplateObj?.primaryColor} p-2 rounded-lg`}>
                      <Send className='w-4 h-4 text-white' />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    // 模拟知识库数据
    const knowledgeBases = [
      {
        id: 1,
        name: '产品文档',
        description: '公司所有产品的使用说明和技术文档',
        icon: '📘',
        documentCount: '24',
        size: '456 MB',
        enabled: true,
      },
      {
        id: 2,
        name: '培训资料',
        description: '新员工培训及各类培训资料汇总',
        icon: '📚',
        documentCount: '13',
        size: '312 MB',
        enabled: true,
      },
      {
        id: 3,
        name: '市场分析',
        description: '市场调研报告和竞品分析文档',
        icon: '📊',
        documentCount: '7',
        size: '703 MB',
        enabled: false,
      },
      {
        id: 4,
        name: '客户案例',
        description: '成功案例和客户故事集',
        icon: '📝',
        documentCount: '18',
        size: '234 MB',
        enabled: true,
      },
      {
        id: 5,
        name: '技术文档',
        description: 'API文档和开发指南',
        icon: '💻',
        documentCount: '31',
        size: '567 MB',
        enabled: true,
      },
    ];

    // 模拟数据集数据
    const datasets = [
      {
        id: 1,
        name: '客户对话数据集',
        description: '基于客服场景的真实对话数据',
        icon: '📚',
        type: '文本',
        dataCount: '12.5K 条',
        enabled: true,
      },
      {
        id: 2,
        name: '技术问答集',
        description: 'IT技术类常见问题及答案',
        icon: '📗',
        type: '表格',
        dataCount: '5.2K 条',
        enabled: true,
      },
      {
        id: 3,
        name: '产品评价数据集',
        description: '电商平台产品评价及推荐相关',
        icon: '📙',
        type: '文本',
        dataCount: '18.7K 条',
        enabled: false,
      },
      {
        id: 4,
        name: 'CRM客户数据源',
        description: '连接到CRM系统的客户数据',
        icon: '🔌',
        type: '数据源',
        dataCount: '45.6K 条',
        enabled: true,
      },
      {
        id: 5,
        name: '销售数据集',
        description: '历史销售数据和趋势分析',
        icon: '📈',
        type: '表格',
        dataCount: '32.1K 条',
        enabled: true,
      },
    ];

    // 模拟工作流数据
    const workflows = [
      {
        id: 1,
        name: '客户服务流程',
        description: '标准的客户服务工作流，包含问题分类、自动回复、人工转接',
        icon: '🔄',
        nodeCount: '8',
        status: '已发布',
      },
      {
        id: 2,
        name: '数据分析流程',
        description: '自动化数据收集、清洗、分析和报告生成',
        icon: '📊',
        nodeCount: '12',
        status: '已发布',
      },
      {
        id: 3,
        name: '内容审核流程',
        description: 'AI辅助的内容审核和过滤工作流',
        icon: '✅',
        nodeCount: '6',
        status: '已发布',
      },
      {
        id: 4,
        name: '文档处理流程',
        description: '文档上传、解析、分类和归档的自动化流程',
        icon: '📄',
        nodeCount: '10',
        status: '已发布',
      },
    ];

    // 模拟接口集数据
    const apiCollections = [
      {
        id: 1,
        name: 'OpenAI API',
        description: 'OpenAI GPT-4 和相关模型的接口集合',
        icon: '🤖',
        endpointCount: '15',
        source: 'OpenAPI',
        enabled: true,
      },
      {
        id: 2,
        name: '支付服务 API',
        description: '支付宝、微信支付等第三方支付接口',
        icon: '💳',
        endpointCount: '28',
        source: 'Swagger',
        enabled: true,
      },
      {
        id: 3,
        name: '电商平台 API',
        description: '商品管理、订单处理、库存系统接口',
        icon: '🛒',
        endpointCount: '45',
        source: 'Postman',
        enabled: true,
      },
      {
        id: 4,
        name: '天气数据 API',
        description: '实时天气数据和预报接口',
        icon: '🌤️',
        endpointCount: '8',
        source: 'OpenAPI',
        enabled: false,
      },
      {
        id: 5,
        name: '地图服务 API',
        description: '地理位置、路径规划等地图服务',
        icon: '🗺️',
        endpointCount: '22',
        source: 'OpenAPI',
        enabled: true,
      },
    ];

    const selectKnowledgeBase = (id: number) => {
      setSelectedKnowledgeBase(prev => (prev === id ? null : id));
    };

    const selectDataset = (id: number) => {
      setSelectedDataset(prev => (prev === id ? null : id));
    };

    const selectWorkflow = (id: number) => {
      setSelectedWorkflow(prev => (prev === id ? null : id));
    };

    const selectAPICollection = (id: number) => {
      setSelectedAPICollection(prev => (prev === id ? null : id));
    };

    return (
      <div className='animate-in fade-in duration-500'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl mb-2 dark:text-white'>关联资源</h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            为应用关联知识库、数据集、工作流和接口集，提升AI能力（可选）
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 知识库选择 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <BookOpen className='w-5 h-5 text-blue-500' />
                  <h3 className='text-lg dark:text-white'>选择知识库</h3>
                </div>
                {selectedKnowledgeBase && <Badge className='bg-blue-500'>已选择</Badge>}
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                选择一个知识库为应用提供专业知识支持（单选）
              </p>
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-3'>
                  {knowledgeBases
                    .filter(kb => kb.enabled)
                    .map(kb => (
                      <Card
                        key={kb.id}
                        onClick={() => selectKnowledgeBase(kb.id)}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedKnowledgeBase === kb.id
                            ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800'
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          <div className='text-3xl flex-shrink-0'>{kb.icon}</div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2 mb-1'>
                              <h4 className='dark:text-white truncate'>{kb.name}</h4>
                              {selectedKnowledgeBase === kb.id && (
                                <Check className='w-5 h-5 text-blue-500 flex-shrink-0' />
                              )}
                            </div>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
                              {kb.description}
                            </p>
                            <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                              <span className='flex items-center gap-1'>
                                <FileText className='w-3 h-3' />
                                {kb.documentCount} 文档
                              </span>
                              <span className='flex items-center gap-1'>
                                <Database className='w-3 h-3' />
                                {kb.size}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* 数据集选择 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Database className='w-5 h-5 text-green-500' />
                  <h3 className='text-lg dark:text-white'>选择数据集</h3>
                </div>
                {selectedDataset && <Badge className='bg-green-500'>已选择</Badge>}
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>选择一个数据集为应用提供训练数据（单选）</p>
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-3'>
                  {datasets
                    .filter(ds => ds.enabled)
                    .map(ds => (
                      <Card
                        key={ds.id}
                        onClick={() => selectDataset(ds.id)}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedDataset === ds.id
                            ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-2 border-transparent hover:border-green-200 dark:hover:border-green-800'
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          <div className='text-3xl flex-shrink-0'>{ds.icon}</div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2 mb-1'>
                              <h4 className='dark:text-white truncate'>{ds.name}</h4>
                              {selectedDataset === ds.id && <Check className='w-5 h-5 text-green-500 flex-shrink-0' />}
                            </div>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
                              {ds.description}
                            </p>
                            <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                              <Badge variant='secondary' className='text-xs'>
                                {ds.type}
                              </Badge>
                              <span className='flex items-center gap-1'>
                                <Database className='w-3 h-3' />
                                {ds.dataCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* 工作流选择 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Zap className='w-5 h-5 text-purple-500' />
                  <h3 className='text-lg dark:text-white'>选择工作流</h3>
                </div>
                {selectedWorkflow && <Badge className='bg-purple-500'>已选择</Badge>}
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                选择一个工作流为应用提供自动化流程支持（单选）
              </p>
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-3'>
                  {workflows.map(wf => (
                    <Card
                      key={wf.id}
                      onClick={() => selectWorkflow(wf.id)}
                      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedWorkflow === wf.id
                          ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='text-3xl flex-shrink-0'>{wf.icon}</div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between gap-2 mb-1'>
                            <h4 className='dark:text-white truncate'>{wf.name}</h4>
                            {selectedWorkflow === wf.id && <Check className='w-5 h-5 text-purple-500 flex-shrink-0' />}
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>{wf.description}</p>
                          <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                            <Badge variant='secondary' className='text-xs'>
                              {wf.status}
                            </Badge>
                            <span className='flex items-center gap-1'>
                              <Layers className='w-3 h-3' />
                              {wf.nodeCount} 节点
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* 接口集选择 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Code2 className='w-5 h-5 text-orange-500' />
                  <h3 className='text-lg dark:text-white'>选择接口集</h3>
                </div>
                {selectedAPICollection && <Badge className='bg-orange-500'>已选择</Badge>}
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                选择一个接口集为应用提供外部API调用能力（单选）
              </p>
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-3'>
                  {apiCollections
                    .filter(api => api.enabled)
                    .map(api => (
                      <Card
                        key={api.id}
                        onClick={() => selectAPICollection(api.id)}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedAPICollection === api.id
                            ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-800'
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          <div className='text-3xl flex-shrink-0'>{api.icon}</div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2 mb-1'>
                              <h4 className='dark:text-white truncate'>{api.name}</h4>
                              {selectedAPICollection === api.id && (
                                <Check className='w-5 h-5 text-orange-500 flex-shrink-0' />
                              )}
                            </div>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
                              {api.description}
                            </p>
                            <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                              <Badge variant='secondary' className='text-xs'>
                                {api.source}
                              </Badge>
                              <span className='flex items-center gap-1'>
                                <Code2 className='w-3 h-3' />
                                {api.endpointCount} 接口
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* 提示信息 */}
        {(selectedKnowledgeBase || selectedDataset || selectedWorkflow || selectedAPICollection) && (
          <div className='mt-6'>
            <Card className='p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'>
              <div className='flex items-start gap-3'>
                <Check className='w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm dark:text-white mb-1'>
                    已选择资源：
                    {selectedKnowledgeBase && ' 知识库'}
                    {selectedKnowledgeBase && (selectedDataset || selectedWorkflow || selectedAPICollection) && '、'}
                    {selectedDataset && ' 数据集'}
                    {selectedDataset && (selectedWorkflow || selectedAPICollection) && '、'}
                    {selectedWorkflow && ' 工作流'}
                    {selectedWorkflow && selectedAPICollection && '、'}
                    {selectedAPICollection && ' 接口集'}
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    这些资源将帮助您的应用提供更准确、更专业的服务和外部能力
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderStep5 = () => {
    const selectedTypeObj = appTypes.find(t => t.id === selectedType);
    const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);
    const SelectedIcon = getSelectedIcon();

    return (
      <div className='animate-in fade-in duration-500'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl mb-2 dark:text-white'>预览与测试</h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>确认您的应用配置并进行实时测试</p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 左侧：配置预览 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              {/* 应用头部 */}
              <div className='flex items-start gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'>
                <div
                  className={`${selectedTypeObj?.iconBg} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <SelectedIcon className='w-8 h-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl mb-2 dark:text-white'>{appName || '未命名应用'}</h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>{appDescription || '暂无描述'}</p>
                </div>
              </div>

              {/* 配置详情 */}
              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm mb-3 dark:text-white'>基本配置</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>应用类型</div>
                      <div className='text-sm dark:text-white'>{selectedTypeObj?.name}</div>
                    </div>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>绑定智能体</div>
                      <div className='text-sm dark:text-white'>{selectedAgent?.name ?? '--'}</div>
                    </div>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>外观模板</div>
                      <div className='text-sm dark:text-white'>{selectedTemplateObj?.name}</div>
                    </div>
                    <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>温度参数</div>
                      <div className='text-sm dark:text-white'>{temperature[0]}</div>
                    </div>
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                <div>
                  <h4 className='text-sm mb-3 dark:text-white'>欢迎语</h4>
                  <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>{welcomeMessage || '暂无设置'}</p>
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                <div>
                  <h4 className='text-sm mb-3 dark:text-white'>功能设置</h4>
                  <div className='flex flex-wrap gap-2'>
                    <Badge
                      className={
                        enableLongConversation ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
                      }
                    >
                      长对话性：{enableLongConversation ? '开启' : '关闭'}
                    </Badge>
                    <Badge
                      className={
                        enablePreciseAnalysis ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
                      }
                    >
                      精确分析：{enablePreciseAnalysis ? '开启' : '关闭'}
                    </Badge>
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                {/* 关联资源 */}
                {(selectedKnowledgeBase || selectedDataset || selectedWorkflow || selectedAPICollection) && (
                  <>
                    <div>
                      <h4 className='text-sm mb-3 dark:text-white'>关联资源</h4>
                      <div className='flex flex-wrap gap-2'>
                        {selectedKnowledgeBase && (
                          <Badge className='bg-blue-500 hover:bg-blue-600'>
                            <BookOpen className='w-3 h-3 mr-1' />
                            知识库
                          </Badge>
                        )}
                        {selectedDataset && (
                          <Badge className='bg-green-500 hover:bg-green-600'>
                            <Database className='w-3 h-3 mr-1' />
                            数据集
                          </Badge>
                        )}
                        {selectedWorkflow && (
                          <Badge className='bg-purple-500 hover:bg-purple-600'>
                            <Zap className='w-3 h-3 mr-1' />
                            工作流
                          </Badge>
                        )}
                        {selectedAPICollection && (
                          <Badge className='bg-orange-500 hover:bg-orange-600'>
                            <Code2 className='w-3 h-3 mr-1' />
                            接口集
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className='dark:bg-gray-700' />
                  </>
                )}

                <div>
                  <h4 className='text-sm mb-3 dark:text-white'>智能体</h4>
                  <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>已选智能体</span>
                      <span className='text-sm dark:text-white'>{selectedAgent?.name ?? '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧：实时测试 */}
          <div>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col'>
              <h3 className='text-lg mb-4 dark:text-white flex items-center gap-2'>
                <MessageSquare className='w-5 h-5' />
                实时测试
              </h3>

              {/* 测试聊天区域 */}
              <div className='flex-1 flex flex-col'>
                <ScrollArea className='flex-1 mb-4 h-96'>
                  <div className='space-y-3 pr-4'>
                    {/* 初始欢迎消息 */}
                    {testMessages.length === 0 && (
                      <div className='flex gap-2'>
                        <div
                          className={`${selectedTemplateObj?.primaryColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <SelectedIcon className='w-4 h-4 text-white' />
                        </div>
                        <div
                          className={`${selectedTemplateObj?.secondaryColor} p-3 rounded-lg rounded-tl-none max-w-[85%]`}
                        >
                          <p className='text-sm dark:text-white'>
                            {welcomeMessage || '您好！我是AI助手，请开始测试对话。'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 测试消息 */}
                    {testMessages.map((msg, index) => (
                      <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && (
                          <div
                            className={`${selectedTemplateObj?.primaryColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <SelectedIcon className='w-4 h-4 text-white' />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-lg max-w-[85%] ${
                            msg.role === 'user'
                              ? `${selectedTemplateObj?.primaryColor} text-white rounded-tr-none`
                              : `${selectedTemplateObj?.secondaryColor} rounded-tl-none`
                          }`}
                        >
                          <p className={`text-sm ${msg.role === 'assistant' ? 'dark:text-white' : 'text-white'}`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* 测试输入框 */}
                <div className='flex gap-2'>
                  <Input
                    placeholder='输入测试消息...'
                    value={testMessage}
                    onChange={e => setTestMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendTestMessage()}
                    className='flex-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white'
                  />
                  <Button
                    onClick={handleSendTestMessage}
                    className={`${selectedTemplateObj?.primaryColor} hover:opacity-90 text-white`}
                  >
                    <Send className='w-4 h-4' />
                  </Button>
                </div>

                <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 text-center'>
                  这是一个模拟测试环境，实际响应可能有所不同
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>创建新应用</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>跟随引导步骤，快速创建您的AI应用</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* Step Content */}
      <div>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-700 -mx-7 px-7'>
        <Button
          variant='outline'
          onClick={handleBack}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          {currentStep === 1 ? '取消' : '上一步'}
        </Button>
        <div className='flex gap-3'>
          {currentStep === 4 && (
            <Button
              onClick={handleSkipStep4}
              variant='outline'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              跳过此步骤
            </Button>
          )}
          {currentStep === 5 && (
            <Button
              onClick={handleSaveDraft}
              variant='outline'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <Bookmark className='w-4 h-4 mr-2' />
              保存为草稿
            </Button>
          )}
          <Button
            onClick={handleNext}
            className='bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
          >
            {currentStep === 5 ? '完成创建' : '下一步'}
            <ChevronRight className='w-4 h-4 ml-1' />
          </Button>
        </div>
      </div>
    </div>
  );
}
