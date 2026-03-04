import { Card, CardContent } from '@/components/ui/card.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { NotificationTypeEnum, NotificationPriorityEnum } from '@/enums/enums.ts';

interface NotificationFiltersProps {
  selectedType: NotificationTypeEnum | 'all';
  selectedPriority: NotificationPriorityEnum | 'all';
  onTypeChange: (type: NotificationTypeEnum | 'all') => void;
  onPriorityChange: (priority: NotificationPriorityEnum | 'all') => void;
}

export function NotificationFilters ({
  selectedType,
  selectedPriority,
  onTypeChange,
  onPriorityChange
}: NotificationFiltersProps) {
  const { t } = useLanguage();
  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardContent className='pt-6 space-y-4'>
        <h3 className='text-sm text-gray-900 dark:text-white mb-3'>{t('notifications.filterTitle')}</h3>

        <div>
          <label className='text-xs text-gray-600 dark:text-gray-400 mb-1 block'>
            {t('notifications.type')}
          </label>
          <Select
            value={selectedType}
            onValueChange={value => onTypeChange(value as NotificationTypeEnum | 'all')}
          >
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>{t('common.all')}</SelectItem>
              <SelectItem value={NotificationTypeEnum.SUCCESS}>{t('common.success')}</SelectItem>
              <SelectItem value={NotificationTypeEnum.WARNING}>{t('notifications.warning')}</SelectItem>
              <SelectItem value={NotificationTypeEnum.INFO}>{t('notifications.info')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-xs text-gray-600 dark:text-gray-400 mb-1 block'>
            {t('notifications.priority')}
          </label>
          <Select
            value={selectedPriority}
            onValueChange={value => onPriorityChange(value as NotificationPriorityEnum | 'all')}
          >
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>{t('notifications.allPriorities')}</SelectItem>
              <SelectItem value={NotificationPriorityEnum.HIGH}>{t('notifications.high')}</SelectItem>
              <SelectItem value={NotificationPriorityEnum.MEDIUM}>{t('notifications.medium')}</SelectItem>
              <SelectItem value={NotificationPriorityEnum.LOW}>{t('notifications.low')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
