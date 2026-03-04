import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/ui/LanguageProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { NotificationTypeEnum, NotificationPriorityEnum } from '@/enums/enums';

interface NotificationFiltersProps {
  /** 当前选中的类型 */
  selectedType: NotificationTypeEnum | 'all';
  /** 当前选中的优先级 */
  selectedPriority: NotificationPriorityEnum | 'all';
  /** 类型改变回调 */
  onTypeChange: (type: NotificationTypeEnum | 'all') => void;
  /** 优先级改变回调 */
  onPriorityChange: (priority: NotificationPriorityEnum | 'all') => void;
}

/**
 * 通知筛选条件组件
 * 提供类型和优先级的筛选选项
 */
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
            {t('common.fields.type')}
          </label>
          <Select
            value={selectedType}
            onValueChange={value =>
              onTypeChange(value as NotificationTypeEnum | 'all')
            }
          >
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>{t('tenants.allTypes')}</SelectItem>
              <SelectItem value={NotificationTypeEnum.SUCCESS}>{t('common.success')}</SelectItem>
              <SelectItem value={NotificationTypeEnum.WARNING}>{t('systemMonitoring.warning')}</SelectItem>
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
            onValueChange={value =>
              onPriorityChange(value as NotificationPriorityEnum | 'all')
            }
          >
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>{t('notifications.allPriorities')}</SelectItem>
              <SelectItem value={NotificationPriorityEnum.HIGH}>{t('notifications.high')}</SelectItem>
              <SelectItem value={NotificationPriorityEnum.MEDIUM}>
                {t('notifications.medium')}
              </SelectItem>
              <SelectItem value={NotificationPriorityEnum.LOW}>{t('notifications.low')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
