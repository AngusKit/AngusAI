import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Datasets from '@/services/Datasets';
import { DatasetUpdateDto } from '@/services/DatasetsTypes';
import { VisibilityEnum } from '@/enums/enums';
import { getTagColor, ICON_OPTIONS } from '@/utils';

interface EditDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: {
    id: string;
    name: string;
    description: string;
    icon?: string;
    iconBg?: string;
    visibility?: string;
    tags?: string[];
  } | null;
  onSuccess?: () => void;
}

export function EditDatasetDialog({ open, onOpenChange, dataset, onSuccess }: EditDatasetDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState<'table' | 'datasource'>('table');
  const [visibility, setVisibility] = useState('private');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 预处理选项
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [cleanHTML, setCleanHTML] = useState(true);
  const [autoSegment, setAutoSegment] = useState(false);
  const [normalizeFormat, setNormalizeFormat] = useState(true);

  // 数据分割
  const [trainingSplit, setTrainingSplit] = useState([80]);
  const [validationSplit, setValidationSplit] = useState([10]);
  const [testSplit, setTestSplit] = useState([10]);

  // 处理优先级
  const [priority, setPriority] = useState<'standard' | 'high'>('standard');

  // 当dataset变化时，更新表单
  useEffect(() => {
    if (dataset) {
      setDatasetName(dataset.name);
      setDescription(dataset.description);
      setVisibility(dataset.visibility || 'private');
      setTags(dataset.tags || []);

      // 根据icon找到对应的索引
      if (dataset.icon) {
        const iconIndex = ICON_OPTIONS.findIndex(opt => opt.emoji === dataset.icon);
        if (iconIndex !== -1) {
          setSelectedIcon(iconIndex);
        }
      }
    }
  }, [dataset]);

  const steps = [
    { number: 1, title: '基本信息' },
    { number: 2, title: '配置处理' },
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

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!datasetName.trim()) {
        toast.error('请输入数据集名称');
        return;
      }
      if (!description.trim()) {
        toast.error('请输入描述');
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // 更新数据集
      if (!dataset) {
        toast.error('数据集信息不存在');
        return;
      }

      try {
        // 映射可见性
        const visibilityMap: Record<string, VisibilityEnum> = {
          private: VisibilityEnum.PRIVATE,
          team: VisibilityEnum.TEAM,
          public: VisibilityEnum.PUBLIC,
        };

        const updateDto: DatasetUpdateDto = {
          name: datasetName.trim(),
          description: description.trim(),
          icon: ICON_OPTIONS[selectedIcon]?.emoji,
          iconBg: ICON_OPTIONS[selectedIcon]?.bg,
          visibility: visibilityMap[visibility] || VisibilityEnum.PRIVATE,
          tags: tags.length > 0 ? tags : undefined,
        };

        await Datasets.updateDataset(dataset.id, updateDto);
        toast.success('数据集更新成功！');
        onOpenChange(false);
        onSuccess?.();
        
        // 重置表单
        setCurrentStep(1);
      } catch (error: any) {
        console.error('更新数据集失败:', error);
        toast.error(error?.message || '更新数据集失败');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className='py-6'>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>数据集名称</Label>
          <Input
            value={datasetName}
            onChange={e => setDatasetName(e.target.value)}
            placeholder='请输入数据集名称'
            className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
        </div>

        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>可见性</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
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

      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>描述</Label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='请输入数据集描述'
          rows={3}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none'
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
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
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
            {ICON_OPTIONS.map((option, index) => (
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

      <div className='mt-5'>
        <Label className='text-sm mb-3 block dark:text-gray-300'>数据类型</Label>
        <div className='grid grid-cols-2 gap-3'>
          <button
            onClick={() => setDataType('table')}
            className={`p-3 border-2 rounded-lg text-left transition-all ${
              dataType === 'table'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className='flex items-start gap-3'>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  dataType === 'table' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {dataType === 'table' && <div className='w-2.5 h-2.5 rounded-full bg-blue-500' />}
              </div>
              <div>
                <div className='dark:text-white mb-0.5'>表格数据</div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>CSV、Excel等</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setDataType('datasource')}
            className={`p-3 border-2 rounded-lg text-left transition-all ${
              dataType === 'datasource'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className='flex items-start gap-3'>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  dataType === 'datasource' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {dataType === 'datasource' && <div className='w-2.5 h-2.5 rounded-full bg-blue-500' />}
              </div>
              <div>
                <div className='dark:text-white mb-0.5'>数据源</div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>API、数据库等</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className='py-6'>
      <div className='grid grid-cols-2 gap-8'>
        {/* 左列 */}
        <div className='space-y-5'>
          {/* 预处理选项 */}
          <div>
            <h3 className='text-sm mb-3 dark:text-gray-300'>预处理选项</h3>
            <div className='space-y-2.5'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='remove-duplicates'
                  checked={removeDuplicates}
                  onCheckedChange={checked => setRemoveDuplicates(checked as boolean)}
                />
                <label htmlFor='remove-duplicates' className='text-sm dark:text-gray-300 cursor-pointer'>
                  去除重复数据
                </label>
              </div>

              <div className='flex items-center gap-2'>
                <Checkbox
                  id='clean-html'
                  checked={cleanHTML}
                  onCheckedChange={checked => setCleanHTML(checked as boolean)}
                />
                <label htmlFor='clean-html' className='text-sm dark:text-gray-300 cursor-pointer'>
                  清理HTML标签
                </label>
              </div>

              <div className='flex items-center gap-2'>
                <Checkbox
                  id='auto-segment'
                  checked={autoSegment}
                  onCheckedChange={checked => setAutoSegment(checked as boolean)}
                />
                <label htmlFor='auto-segment' className='text-sm dark:text-gray-300 cursor-pointer'>
                  自动分段
                </label>
              </div>

              <div className='flex items-center gap-2'>
                <Checkbox
                  id='normalize-format'
                  checked={normalizeFormat}
                  onCheckedChange={checked => setNormalizeFormat(checked as boolean)}
                />
                <label htmlFor='normalize-format' className='text-sm dark:text-gray-300 cursor-pointer'>
                  标准化文本格式
                </label>
              </div>
            </div>
          </div>

          {/* 处理优先级 */}
          <div>
            <h3 className='text-sm mb-3 dark:text-gray-300'>处理优先级</h3>
            <RadioGroup value={priority} onValueChange={value => setPriority(value as 'standard' | 'high')}>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='standard' id='standard' />
                  <label htmlFor='standard' className='text-sm dark:text-gray-300 cursor-pointer'>
                    标准
                  </label>
                </div>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='high' id='high' />
                  <label htmlFor='high' className='text-sm dark:text-gray-300 cursor-pointer'>
                    高优先级
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* 右列 - 数据分割 */}
        <div>
          <h3 className='text-sm mb-3 dark:text-gray-300'>数据分割</h3>
          <div className='space-y-5'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>训练集</span>
                <span className='text-sm dark:text-white'>{trainingSplit[0]}%</span>
              </div>
              <Slider value={trainingSplit} onValueChange={setTrainingSplit} max={100} step={1} className='w-full' />
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>验证集</span>
                <span className='text-sm dark:text-white'>{validationSplit[0]}%</span>
              </div>
              <Slider
                value={validationSplit}
                onValueChange={setValidationSplit}
                max={100}
                step={1}
                className='w-full'
              />
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>测试集</span>
                <span className='text-sm dark:text-white'>{testSplit[0]}%</span>
              </div>
              <Slider value={testSplit} onValueChange={setTestSplit} max={100} step={1} className='w-full' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[760px] !max-w-[90vw] max-h-[85vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700'>
        {/* Header */}
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogTitle className='text-xl dark:text-white'>编辑数据集</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            修改数据集的配置和设置
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area with Sidebar */}
        <div className='flex' style={{ height: 'calc(85vh - 140px)' }}>
          {/* Left Sidebar - Step Indicator */}
          <div className='w-56 border-r border-gray-200 dark:border-gray-700 p-6'>
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
          </div>
        </div>

        {/* Footer */}
        <div className='px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
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
              className={
                currentStep === 2
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            >
              {currentStep === 2 ? '确认并保存' : '下一步'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
