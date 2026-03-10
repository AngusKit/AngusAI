import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ModelListItem } from '../types';

export interface ModelDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: ModelListItem | null;
  onEdit: (model: ModelListItem) => void;
}

export function ModelDetailsDialog({ open, onOpenChange, selectedModel, onEdit }: ModelDetailsDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>{t('models.details.title')}</DialogTitle>
          <DialogDescription className='dark:text-gray-400'>{t('models.details.description')}</DialogDescription>
        </DialogHeader>

        {selectedModel && (
          <div className='space-y-6 py-4'>
            {/* 基本信息 */}
            <div className='flex items-start gap-4'>
              <div
                className={`${selectedModel.iconBg} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                {(() => {
                  const Icon = selectedModel.icon;
                  return Icon ? <Icon className={`w-8 h-8 ${selectedModel.iconColor}`} /> : null;
                })()}
              </div>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='text-xl dark:text-white'>{selectedModel.name}</h3>
                  <Badge className={`text-xs ${selectedModel.statusColor} border-0`}>{selectedModel.status}</Badge>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{selectedModel.description}</p>
              </div>
            </div>

            {/* 模型信息 */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</div>
                <div className='dark:text-white'>{selectedModel.provider}</div>
              </div>
              <div className='space-y-1'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.type')}</div>
                <div className='dark:text-white'>{selectedModel.type}</div>
              </div>
              <div className='space-y-1'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.maxTokens')}</div>
                <div className='dark:text-white'>{selectedModel.maxTokens ?? '--'}</div>
              </div>
              <div className='space-y-1'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.addedAt')}</div>
                <div className='dark:text-white'>{selectedModel.deployed}</div>
              </div>
            </div>

            {/* 性能指标 */}
            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
              <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.performanceMetrics')}</h4>
              <div className='grid grid-cols-3 gap-4'>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.table.latency')}</div>
                  <div className='text-lg dark:text-white'>{selectedModel.performance.latency}</div>
                </Card>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.throughput')}</div>
                  <div className='text-lg dark:text-white'>{selectedModel.performance.throughput}</div>
                </Card>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.accuracy')}</div>
                  <div className='text-lg dark:text-white'>{selectedModel.performance.accuracy}</div>
                </Card>
              </div>
            </div>

            {/* 使用统计 */}
            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
              <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.usageStats')}</h4>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCalls')}</div>
                  <div className='text-xl dark:text-white'>{selectedModel.calls}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCost')}</div>
                  <div className='text-xl dark:text-white'>{selectedModel.cost}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalTokens')}</div>
                  <div className='text-xl dark:text-white'>{selectedModel.tokens || '--'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
          >
            {t('models.actions.close')}
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              selectedModel && onEdit(selectedModel);
            }}
            className='bg-blue-500 hover:bg-blue-600'
          >
            {t('models.actions.editConfig')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
