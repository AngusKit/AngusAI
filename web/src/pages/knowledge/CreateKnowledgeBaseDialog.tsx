import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { toast } from 'sonner';
import KnowledgeBases from '@/services/KnowledgeBases';
import { VisibilityEnum } from '@/enums/enums';
import { getTagColor } from '@/utils';

interface CreateKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// 扩展的图标选项 - 32个图标
const iconOptions = [
  { emoji: '📘', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '书籍' },
  { emoji: '🎓', bg: 'bg-green-100 dark:bg-green-900/30', label: '学术' },
  { emoji: '📋', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '列表' },
  { emoji: '📁', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '文件夹' },
  { emoji: '📚', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '图书馆' },
  { emoji: '💼', bg: 'bg-gray-100 dark:bg-gray-700/30', label: '公文包' },
  { emoji: '🎯', bg: 'bg-red-100 dark:bg-red-900/30', label: '目标' },
  { emoji: '💡', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '想法' },
  { emoji: '🔬', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '科研' },
  { emoji: '🏆', bg: 'bg-amber-100 dark:bg-amber-900/30', label: '成就' },
  { emoji: '🌟', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '星星' },
  { emoji: '🎨', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '艺术' },
  { emoji: '⚙️', bg: 'bg-slate-100 dark:bg-slate-700/30', label: '设置' },
  { emoji: '🚀', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '火箭' },
  { emoji: '📊', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '数据' },
  { emoji: '🔒', bg: 'bg-red-100 dark:bg-red-900/30', label: '安全' },
  { emoji: '🎭', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '戏剧' },
  { emoji: '🎬', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '电影' },
  { emoji: '🎮', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '游戏' },
  { emoji: '🎪', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '马戏团' },
  { emoji: '🌈', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '彩虹' },
  { emoji: '🔥', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '火焰' },
  { emoji: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '闪电' },
  { emoji: '🌙', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '月亮' },
  { emoji: '☀️', bg: 'bg-amber-100 dark:bg-amber-900/30', label: '太阳' },
  { emoji: '🌍', bg: 'bg-green-100 dark:bg-green-900/30', label: '地球' },
  { emoji: '💎', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '钻石' },
  { emoji: '🎁', bg: 'bg-red-100 dark:bg-red-900/30', label: '礼物' },
  { emoji: '🔑', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '钥匙' },
  { emoji: '🏠', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '房屋' },
  { emoji: '✨', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '闪光' },
  { emoji: '🌺', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '花朵' },
];

export function CreateKnowledgeBaseDialog({ open, onOpenChange, onSuccess }: CreateKnowledgeBaseDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [kbName, setKbName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 配置处理参数
  const [chunkSize, setChunkSize] = useState([512]);
  const [chunkOverlap, setChunkOverlap] = useState([50]);
  const [embeddingModelId, setEmbeddingModelId] = useState<number | undefined>(undefined);
  const [vectorStoreId, setVectorStoreId] = useState('1'); // 默认选择第一个
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: '基本信息' },
    { number: 2, title: '配置处理' },
  ];

  // 向量存储源列表（模拟数据）
  const vectorStores = [
    {
      id: '1',
      name: 'Production Pinecone',
      type: 'PINECONE',
      status: 'connected',
      icon: '🌲',
    },
    {
      id: '2',
      name: 'Dev Chroma DB',
      type: 'CHROMA',
      status: 'connected',
      icon: '🎨',
    },
    {
      id: '3',
      name: 'Azure OpenSearch',
      type: 'OPENSEARCH',
      status: 'disconnected',
      icon: '🔎',
    },
    {
      id: '4',
      name: 'Qdrant Cluster',
      type: 'QDRANT',
      status: 'connected',
      icon: '⚡',
    },
    {
      id: '5',
      name: 'MongoDB Atlas Vector',
      type: 'MONGODB_ATLAS',
      status: 'connected',
      icon: '🍃',
    },
  ];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (!newTag) return;

      if (newTag.length > 10) {
        toast.error('标签长度不能超过10个字符');
        return;
      }

      if (tags.length >= 5) {
        toast.error('最多只能添加5个标签');
        return;
      }

      if (tags.includes(newTag)) {
        toast.error('标签已存在');
        return;
      }

      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!kbName.trim()) {
        toast.error('请输入知识库名称');
        return;
      }
      if (!description.trim()) {
        toast.error('请输入知识库描述');
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // 验证配置处理参数
      const currentChunkSize = chunkSize[0];
      const currentChunkOverlap = chunkOverlap[0];

      if (!currentChunkSize || currentChunkSize < 100 || currentChunkSize > 2000) {
        toast.error('分段大小必须在100-2000之间');
        return;
      }
      if (currentChunkOverlap === undefined || currentChunkOverlap < 0 || currentChunkOverlap > 200) {
        toast.error('分段重叠必须在0-200之间');
        return;
      }

      // 创建知识库
      handleCreateKnowledgeBase();
    }
  };

  const handleCreateKnowledgeBase = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedIconOption = iconOptions[selectedIcon];
      if (!selectedIconOption) {
        toast.error('请选择图标');
        setIsSubmitting(false);
        return;
      }

      const visibilityMap: Record<string, VisibilityEnum> = {
        private: VisibilityEnum.PRIVATE,
        team: VisibilityEnum.TEAM,
        public: VisibilityEnum.PUBLIC,
      };

      const createData: any = {
        name: kbName.trim(),
        icon: selectedIconOption.emoji,
        iconBg: selectedIconOption.bg,
        description: description.trim(),
        visibility: visibilityMap[visibility] || VisibilityEnum.PRIVATE,
        tags: tags.length > 0 ? tags : undefined,
      };

      // 如果配置了向量化模型，添加config
      if (embeddingModelId && chunkSize[0] && chunkOverlap[0] !== undefined) {
        createData.config = {
          chunkSize: chunkSize[0],
          chunkOverlap: chunkOverlap[0],
          embeddingModelId: embeddingModelId,
        };
      }

      await KnowledgeBases.createKnowledgeBase(createData);

      toast.success('知识库创建成功！');
      onOpenChange(false);
      onSuccess?.();

      // 重置表单
      setCurrentStep(1);
      setKbName('');
      setDescription('');
      setVisibility('private');
      setSelectedIcon(0);
      setTags([]);
      setTagInput('');
      setChunkSize([512]);
      setChunkOverlap([50]);
      setEmbeddingModelId(undefined);
      setVectorStoreId('1');
    } catch (error: any) {
      toast.error(error?.data?.message || '创建知识库失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className='py-6'>
      {/* 名称和可见性在同一行 */}
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>知识库名称</Label>
          <Input
            value={kbName}
            onChange={e => setKbName(e.target.value)}
            placeholder='请输入知识库名称'
            className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
          />
        </div>

        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>可见性</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='private' className='dark:text-white'>
                私有
              </SelectItem>
              <SelectItem value='team' className='dark:text-white'>
                团队可见
              </SelectItem>
              <SelectItem value='public' className='dark:text-white'>
                公开
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 描述 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>描述</Label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='请输入知识库描述'
          rows={3}
          className='dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none'
        />
      </div>

      {/* 标签 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>
          标签 <span className='text-gray-400'>({tags.length}/5)</span>
        </Label>
        <Input
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder='输入标签后按回车，最多5个，每个不超过10字符'
          className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
          disabled={tags.length >= 5}
          maxLength={10}
        />
        {tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map(tag => (
              <Badge key={tag} className={`border-0 ${getTagColor(tag)}`}>
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className='ml-1 hover:opacity-70 transition-opacity'>
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 图标 - 超过两排时可滚动 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>图标</Label>
        <div className='max-h-[140px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
          <div className='grid grid-cols-8 gap-2'>
            {iconOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedIcon(index)}
                className={`${option.bg} w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                  selectedIcon === index
                    ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                    : 'hover:scale-105'
                }`}
                title={option.label}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // 确保 chunkSize 和 chunkOverlap 始终是有效的数组
    const safeChunkSize = Array.isArray(chunkSize) && chunkSize.length > 0 ? chunkSize : [512];
    const safeChunkOverlap = Array.isArray(chunkOverlap) && chunkOverlap.length > 0 ? chunkOverlap : [50];
    const currentChunkSize = safeChunkSize[0];
    const currentChunkOverlap = safeChunkOverlap[0];

    return (
      <div className='py-6'>
        <div className='space-y-6'>
          {/* 向量存储源 */}
          <div>
            <Label className='text-sm mb-3 block dark:text-gray-300'>向量存储源</Label>
            <Select value={vectorStoreId} onValueChange={setVectorStoreId}>
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {vectorStores.map(store => (
                  <SelectItem key={store.id} value={store.id} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <span>{store.icon}</span>
                      <span>{store.name}</span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>({store.type})</span>
                      {store.status === 'connected' ? (
                        <Badge
                          variant='outline'
                          className='text-xs border-green-500 text-green-600 dark:text-green-400 ml-2'
                        >
                          已连接
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='text-xs border-gray-400 text-gray-500 dark:text-gray-400 ml-2'
                        >
                          未连接
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>选择用于存储向量数据的存储源</p>
          </div>

          {/* 分段大小 */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <Label className='text-sm dark:text-gray-300'>分段大小</Label>
              <span className='text-sm dark:text-white'>{currentChunkSize}</span>
            </div>
            <Slider
              value={safeChunkSize}
              onValueChange={setChunkSize}
              min={100}
              max={2000}
              step={1}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>控制文本分块的大小，范围：100-2000 字符</p>
          </div>

          {/* 分段重叠 */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <Label className='text-sm dark:text-gray-300'>分段重叠</Label>
              <span className='text-sm dark:text-white'>{currentChunkOverlap}</span>
            </div>
            <Slider
              value={safeChunkOverlap}
              onValueChange={setChunkOverlap}
              min={0}
              max={200}
              step={1}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              控制相邻文本块的重叠字符数，范围：0-200 字符
            </p>
          </div>

          {/* 向量化模型 */}
          <div>
            <Label className='text-sm mb-3 block dark:text-gray-300'>向量化模型（可选）</Label>
            <Select
              value={embeddingModelId?.toString() || ''}
              onValueChange={value => setEmbeddingModelId(value ? Number(value) : undefined)}
            >
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                <SelectValue placeholder='不指定时使用默认模型' />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                <SelectItem value='' className='dark:text-white'>
                  使用默认模型
                </SelectItem>
                {/* 注意：这里需要根据实际的模型ID列表来填充，目前使用示例ID */}
                <SelectItem value='1' className='dark:text-white'>
                  text-embedding-ada-002
                </SelectItem>
                <SelectItem value='2' className='dark:text-white'>
                  text-embedding-3-small
                </SelectItem>
                <SelectItem value='3' className='dark:text-white'>
                  text-embedding-3-large
                </SelectItem>
                <SelectItem value='4' className='dark:text-white'>
                  m3e-base
                </SelectItem>
                <SelectItem value='5' className='dark:text-white'>
                  m3e-large
                </SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              选择用于文本向量化的模型，不指定时使用默认模型
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[760px] !max-w-[90vw] max-h-[85vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700 flex flex-col'>
        {/* Header */}
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <DialogTitle className='text-xl dark:text-white'>创建知识库</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            按照步骤创建和配置您的知识库
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area with Sidebar */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left Sidebar - Step Indicator */}
          <div className='w-56 border-r border-gray-200 dark:border-gray-700 p-6 flex-shrink-0'>
            <div className='space-y-4'>
              {steps.map((step, index) => (
                <div key={step.number}>
                  <div className='flex items-start gap-3'>
                    <div className='flex flex-col items-center'>
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          step.number === currentStep
                            ? 'bg-blue-500 text-white'
                            : step.number < currentStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {step.number < currentStep ? <Check className='w-5 h-5' /> : <span>{step.number}</span>}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 mt-2 transition-all ${
                            step.number < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      )}
                    </div>
                    <div className='pt-1.5'>
                      <div
                        className={`text-sm ${
                          step.number === currentStep
                            ? 'text-blue-500'
                            : step.number < currentStep
                              ? 'text-green-500'
                              : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className='flex-1 overflow-y-auto px-8'>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep !== 1 && currentStep !== 2 && (
              <div className='py-6 text-center text-gray-500 dark:text-gray-400'>未知步骤: {currentStep}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0'>
          <div>
            {currentStep === 2 && (
              <Button
                variant='outline'
                onClick={() => {
                  toast.success('已保存为草稿');
                  onOpenChange(false);
                  setCurrentStep(1);
                }}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                保存为草稿
              </Button>
            )}
          </div>
          <div className='flex items-center gap-3'>
            {currentStep > 1 ? (
              <Button
                variant='outline'
                onClick={handleBack}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                上一步
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={() => {
                  onOpenChange(false);
                  setCurrentStep(1);
                }}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                取消
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className={
                currentStep === 2
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            >
              {isSubmitting ? '创建中...' : currentStep === 2 ? '确认并创建' : '下一步'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
