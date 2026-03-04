import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider.tsx';

export function WelcomeBanner() {
  const { t } = useLanguage();

  return (
    <div className='relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute right-8 top-1/2 -translate-y-1/2 opacity-20'>
        <div className='relative'>
          <div className='w-32 h-32 rounded-full bg-white/20'></div>
          <div className='absolute top-8 left-8 w-16 h-16 rounded-full bg-white/20'></div>
          <div className='absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20'></div>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <div className='flex items-center gap-2 mb-2'>
          <Sparkles className='w-5 h-5' />
          <h1 className='text-2xl'>{t('welcome.title')}</h1>
        </div>
        <p className='text-blue-100 mb-6'>{t('welcome.subtitle')}</p>

        <div className='flex gap-3'>
          <Button className='bg-white text-blue-600 hover:bg-blue-50'>{t('welcome.quickStart')}</Button>
          <Button className='bg-white text-blue-600 hover:bg-blue-50'>{t('welcome.documentation')}</Button>
        </div>
      </div>
    </div>
  );
}
