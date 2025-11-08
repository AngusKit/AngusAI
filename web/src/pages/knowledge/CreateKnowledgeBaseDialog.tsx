import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import KnowledgeBases from '@/services/KnowledgeBases';
import { VisibilityEnum } from '@/enums/enums';
import { ICON_OPTIONS, FORM_STEPS, CONFIG_CONSTANTS } from './constants';
import { validateBasicInfoStep, validateConfigurationStep } from './utils';
import { useKnowledgeBaseForm } from './hooks/useKnowledgeBaseForm';
import { BasicInfoStep, ConfigurationStep } from './components/KnowledgeBaseFormSteps';

interface CreateKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateKnowledgeBaseDialog({ open, onOpenChange, onSuccess }: CreateKnowledgeBaseDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    tagInput,
    setTagInput,
    updateField,
    removeTag,
    handleTagInputKeyDown,
    resetForm,
  } = useKnowledgeBaseForm();

  // 可见性映射
  const visibilityMap: Record<string, VisibilityEnum> = {
    private: VisibilityEnum.PRIVATE,
    team: VisibilityEnum.TEAM,
    public: VisibilityEnum.PUBLIC,
  };

  // 处理下一步/提交
  const handleNextStep = () => {
    if (currentStep === 1) {
      const validation = validateBasicInfoStep(formData.name, formData.description);
      if (!validation.isValid) {
        return;
      }
      setCurrentStep(2);
    } else {
      // 验证配置处理参数
      const currentChunkSize = formData.chunkSize[0] ?? CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT;
      const currentChunkOverlap = formData.chunkOverlap[0] ?? CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT;

      const validation = validateConfigurationStep(currentChunkSize, currentChunkOverlap);
      if (!validation.isValid) {
        return;
      }

      // 创建知识库
      handleSubmit();
    }
  };

  // 提交创建知识库
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedIconOption = ICON_OPTIONS[formData.selectedIconIndex];
      if (!selectedIconOption) {
        toast.error('请选择图标');
        setIsSubmitting(false);
        return;
      }

      const createData: any = {
        name: formData.name.trim(),
        icon: selectedIconOption.emoji,
        iconBg: selectedIconOption.bg,
        description: formData.description.trim(),
        visibility: visibilityMap[formData.visibility] || VisibilityEnum.PRIVATE,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      // 如果配置了向量化模型，添加config
      if (formData.embeddingModelId && formData.chunkSize[0] && formData.chunkOverlap[0] !== undefined) {
        createData.config = {
          chunkSize: formData.chunkSize[0],
          chunkOverlap: formData.chunkOverlap[0],
          embeddingModelId: formData.embeddingModelId,
        };
      }

      await KnowledgeBases.createKnowledgeBase(createData);

      toast.success('知识库创建成功！');
      onOpenChange(false);
      onSuccess?.();

      // 重置表单
      setCurrentStep(1);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || '创建知识库失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理返回上一步
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 处理取消/关闭
  const handleCancel = () => {
    onOpenChange(false);
    setCurrentStep(1);
  };

  // 处理保存草稿
  const handleSaveDraft = () => {
    toast.success('已保存为草稿');
    onOpenChange(false);
    setCurrentStep(1);
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
              {FORM_STEPS.map((step, index) => (
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
                      {index < FORM_STEPS.length - 1 && (
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
            {currentStep === 1 && (
              <BasicInfoStep
                formData={formData}
                tagInput={tagInput}
                onFieldChange={updateField}
                onTagInputChange={setTagInput}
                onTagInputKeyDown={handleTagInputKeyDown}
                onRemoveTag={removeTag}
              />
            )}
            {currentStep === 2 && (
              <ConfigurationStep
                formData={formData}
                onFieldChange={updateField}
              />
            )}
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
                onClick={handleSaveDraft}
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
                onClick={handleBackStep}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                上一步
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={handleCancel}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                取消
              </Button>
            )}
            <Button
              onClick={handleNextStep}
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
