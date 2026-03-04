import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/ui/LanguageProvider';

/**
 * 加载状态组件
 */
export function LoadingState () {
  const { t } = useLanguage();
  return (
    <div className='text-center py-12'>
      <Loader2 className='size-8 text-gray-400 dark:text-gray-500 mx-auto mb-3 animate-spin'/>
      <p className='text-gray-500 dark:text-gray-400'>{t('common.loading')}</p>
    </div>
  );
}
