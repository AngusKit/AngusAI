import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Button } from '@/components/ui/button';

interface NotFoundPageProps {
  homePath?: string;
}

export function NotFoundPage({ homePath = '/dashboard' }: NotFoundPageProps) {
  const { t } = useLanguage();

  return (
    <div className='grid flex-1 min-h-0 place-content-center px-4'>
      <div
        className='flex flex-col items-center text-center'
        style={{ gap: '1.5rem', padding: '2rem 0' }}
      >
        {/* Icon */}
        <div className='flex shrink-0 items-center justify-center'>
          <FileQuestion
            size={80}
            className='text-slate-500 dark:text-slate-400'
          />
        </div>

        {/* Title + 404 - same line */}
        <div className='flex flex-row items-baseline justify-center gap-2'>
          <h1 className='text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl'>
            {t('common.notFound.title')}
          </h1>
          <span
            className='text-2xl font-bold '
            style={{ fontFamily: 'ui-monospace, "SF Mono", Monaco, monospace' }}
          >
            404
          </span>
        </div>

        {/* Description */}
        <p className='max-w-md text-slate-600 dark:text-slate-400'>
          {t('common.notFound.description')}
        </p>

        {/* Back button */}
        <Button asChild variant='default' size='lg' className='gap-2'>
          <Link to={homePath}>
            <Home className='h-4 w-4' />
            {t('common.notFound.backHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
