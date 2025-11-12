import { Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import KnowledgeBases from '@/services/KnowledgeBases';
import { VisibilityEnum } from '@/enums/enums';
import { CONFIG_CONSTANTS } from './constants';
import { ICON_OPTIONS } from '@/utils';
import { useKnowledgeBaseForm } from './hooks/useKnowledgeBaseForm';
import { BasicInfoStep, ConfigurationStep } from './components/KnowledgeBaseFormSteps';
import { KnowledgeBaseDetailResult } from '@/types/api-types';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface EditKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBase: {
    id: string;
    name: string;
    description: string;
    icon?: string;
    iconBg?: string;
    visibility?: string;
    tags?: string[];
    chunkSize?: number;
    chunkOverlap?: number;
    embeddingModelId?: number;
  } | null;
  onSuccess?: () => void;
}

export function EditKnowledgeBaseDialog({
  open,
  onOpenChange,
  knowledgeBase,
  onSuccess,
}: EditKnowledgeBaseDialogProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { formData, tagInput, setTagInput, updateField, removeTag, handleTagInputKeyDown, setSelectedIconByEmoji } =
    useKnowledgeBaseForm();

  // TODO 和公共重复
  const steps = [
    { number: 1, title: t('knowledge.formSteps.basicInfo') },
    { number: 2, title: t('knowledge.formSteps.configuration') },
  ];

  // TODO 验证提到工具类
  const validateBasicInfo = () => {
    if (!formData.name.trim()) {
      toast.error(t('knowledge.validation.nameRequired'));
      return false;
    }
    if (!formData.description.trim()) {
      toast.error(t('knowledge.validation.descriptionRequired'));
      return false;
    }
    return true;
  };

  // TODO 验证提到工具类
  const validateConfiguration = () => {
    const chunkSize = formData.chunkSize[0] ?? CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT;
    const chunkOverlap = formData.chunkOverlap[0] ?? CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT;
    const { MIN: chunkSizeMin, MAX: chunkSizeMax } = CONFIG_CONSTANTS.CHUNK_SIZE;
    if (!chunkSize || chunkSize < chunkSizeMin || chunkSize > chunkSizeMax) {
      toast.error(
        t('knowledge.validation.chunkSizeRange', {
          min: chunkSizeMin,
          max: chunkSizeMax,
        })
      );
      return false;
    }

    const { MIN: overlapMin, MAX: overlapMax } = CONFIG_CONSTANTS.CHUNK_OVERLAP;
    if (chunkOverlap === undefined || chunkOverlap < overlapMin || chunkOverlap > overlapMax) {
      toast.error(
        t('knowledge.validation.chunkOverlapRange', {
          min: overlapMin,
          max: overlapMax,
        })
      );
      return false;
    }

    return true;
  };

  // 加载知识库详情
  useEffect(() => {
    const loadKnowledgeBaseDetail = async () => {
      if (!open || !knowledgeBase?.id) {
        // 弹窗关闭时重置状态
        if (!open) {
          setCurrentStep(1);
          setIsLoadingDetail(false);
        }
        return;
      }

      setIsLoadingDetail(true);
      setCurrentStep(1); // 重置到第一步

      try {
        const response = await KnowledgeBases.getKnowledgeBaseDetail(knowledgeBase.id);
        const detail = (response as KnowledgeBaseDetailResult)?.data;

        if (detail) {
          // 更新表单数据
          updateField('name', detail.name || '');
          updateField('description', detail.description || '');

          // 将 VisibilityEnum 转换为小写字符串（PRIVATE -> private）
          const visibilityValue = detail.visibility
            ? (detail.visibility.toLowerCase() as 'private' | 'team' | 'public')
            : 'private';
          updateField('visibility', visibilityValue);

          updateField('tags', detail.tags || []);

          // 配置处理参数
          const chunkSize = detail.config?.chunkSize || CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT;
          const chunkOverlap = detail.config?.chunkOverlap || CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT;
          updateField('chunkSize', [chunkSize]);
          updateField('chunkOverlap', [chunkOverlap]);
          updateField('embeddingModelId', detail.config?.embeddingModelId);

          // 预处理选项
          updateField('removeDuplicates', detail.config?.removeDuplicates ?? true);
          updateField('cleanHTML', detail.config?.cleanHTML ?? true);
          updateField('optimizeTextFormat', detail.config?.optimizeTextFormat ?? true);

          // 根据icon找到对应的索引
          if (detail.icon) {
            setSelectedIconByEmoji(detail.icon);
          }
        }
      } catch (error: any) {
        console.error('Failed to load knowledge base detail:', error);
        toast.error(error?.data?.message || t('knowledge.editDialog.loadFailed'));
        // 如果加载失败，使用传入的基础数据
        if (knowledgeBase) {
          updateField('name', knowledgeBase.name);
          updateField('description', knowledgeBase.description);
          const visibilityValue = knowledgeBase.visibility
            ? (knowledgeBase.visibility.toLowerCase() as 'private' | 'team' | 'public')
            : 'private';
          updateField('visibility', visibilityValue);
          updateField('tags', knowledgeBase.tags || []);
          updateField('chunkSize', [knowledgeBase.chunkSize || CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT]);
          updateField('chunkOverlap', [knowledgeBase.chunkOverlap || CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT]);
          updateField('embeddingModelId', knowledgeBase.embeddingModelId);
          // 预处理选项使用默认值
          updateField('removeDuplicates', true);
          updateField('cleanHTML', true);
          updateField('optimizeTextFormat', true);
          if (knowledgeBase.icon) {
            setSelectedIconByEmoji(knowledgeBase.icon);
          }
        }
      } finally {
        setIsLoadingDetail(false);
      }
    };

    loadKnowledgeBaseDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, knowledgeBase?.id]);

  // 可见性映射
  const visibilityMap: Record<string, VisibilityEnum> = {
    private: VisibilityEnum.PRIVATE,
    team: VisibilityEnum.TEAM,
    public: VisibilityEnum.PUBLIC,
  };

  // 处理下一步/提交
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateBasicInfo()) {
        return;
      }
      setCurrentStep(2);
    } else {
      if (!validateConfiguration()) {
        return;
      }
      // 更新知识库
      handleSubmit();
    }
  };

  // 提交更新知识库
  const handleSubmit = async () => {
    if (!knowledgeBase || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedIconOption = ICON_OPTIONS[formData.selectedIconIndex] ?? ICON_OPTIONS[0]!;

      const updateData: any = {
        name: formData.name.trim(),
        icon: selectedIconOption.emoji,
        iconBg: selectedIconOption.bg,
        description: formData.description.trim(),
        visibility: visibilityMap[formData.visibility] || VisibilityEnum.PRIVATE,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      // 添加config配置（与创建逻辑保持一致：只要有chunkSize和chunkOverlap就添加config）
      const currentChunkSize = formData.chunkSize[0] ?? CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT;
      const currentChunkOverlap = formData.chunkOverlap[0] ?? CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT;

      // 只要有chunkSize和chunkOverlap就添加config，embeddingModelId可选
      if (currentChunkSize && currentChunkOverlap !== undefined) {
        updateData.config = {
          chunkSize: currentChunkSize,
          chunkOverlap: currentChunkOverlap,
          // 如果embeddingModelId存在则添加，否则使用0作为默认值（后端会使用默认模型）
          embeddingModelId: formData.embeddingModelId ?? 0,
          removeDuplicates: formData.removeDuplicates,
          cleanHTML: formData.cleanHTML,
          optimizeTextFormat: formData.optimizeTextFormat,
        };
      }

      await KnowledgeBases.toggleKnowledge(knowledgeBase.id, updateData);

      toast.success(t('knowledge.editDialog.updateSuccess'));
      onOpenChange(false);
      onSuccess?.();
      setCurrentStep(1);
    } catch (error: any) {
      toast.error(error?.data?.message || t('knowledge.editDialog.updateFailed'));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[760px] !max-w-[90vw] max-h-[85vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700 flex flex-col'>
        {/* Header */}
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <DialogTitle className='text-xl dark:text-white'>{t('knowledge.editDialog.title')}</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {t('knowledge.editDialog.description')}
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
            {isLoadingDetail ? (
              <div className='flex items-center justify-center py-12'>
                <div className='flex flex-col items-center gap-3'>
                  <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{t('knowledge.editDialog.loadingDetail')}</p>
                </div>
              </div>
            ) : (
              <>
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
                {currentStep === 2 && <ConfigurationStep formData={formData} onFieldChange={updateField} />}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0'>
          <div />
          <div className='flex items-center gap-3'>
            {currentStep > 1 ? (
              <Button
                variant='outline'
                onClick={handleBackStep}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                {t('common.actions.previous')}
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={handleCancel}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              >
                {t('common.actions.cancel')}
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              disabled={isSubmitting || isLoadingDetail}
              className={
                currentStep === 2
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            >
              {isSubmitting
                ? t('common.messages.saving')
                : isLoadingDetail
                  ? t('common.messages.loading')
                  : currentStep === 2
                    ? t('knowledge.editDialog.saveButton')
                    : t('common.actions.next')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
