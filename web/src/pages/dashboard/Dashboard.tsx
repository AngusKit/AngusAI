import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentApplications } from '@/pages/dashboard/components/RecentApplications.tsx';
import { WelcomeBanner } from '@/pages/dashboard/components/WelcomeBanner.tsx';
import { StatsCards } from '@/pages/dashboard/components/StatsCards.tsx';
import { UsageDetails } from '@/pages/dashboard/components/UsageDetails.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className='h-40 w-full rounded-2xl dark:bg-gray-800' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className='p-5 dark:bg-gray-800'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start gap-4'>
                  <Skeleton className='w-12 h-12 rounded-xl dark:bg-gray-700 flex-shrink-0' />
                  <div>
                    <Skeleton className='h-4 w-20 mb-1 dark:bg-gray-700' />
                    <Skeleton className='h-8 w-16 mb-1 dark:bg-gray-700' />
                    <Skeleton className='h-3 w-32 dark:bg-gray-700' />
                  </div>
                </div>
                <Skeleton className='w-16 h-6 rounded dark:bg-gray-700 flex-shrink-0' />
              </div>
            </Card>
          ))}
        </div>
        <div>
          <div className='flex items-center justify-between mb-4'>
            <Skeleton className='h-6 w-32 dark:bg-gray-700' />
            <Skeleton className='h-4 w-20 dark:bg-gray-700' />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {[1, 2, 3].map(i => (
              <Card key={i} className='p-5 dark:bg-gray-800'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='w-12 h-12 rounded-xl dark:bg-gray-700' />
                    <Skeleton className='h-6 w-32 dark:bg-gray-700' />
                  </div>
                  <div className='flex gap-2'>
                    <Skeleton className='w-8 h-8 rounded-lg dark:bg-gray-700' />
                    <Skeleton className='w-8 h-8 rounded-lg dark:bg-gray-700' />
                  </div>
                </div>
                <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
                <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
                <div className='flex gap-2 mb-2'>
                  <Skeleton className='h-6 w-16 rounded-md dark:bg-gray-700' />
                  <Skeleton className='h-6 w-16 rounded-md dark:bg-gray-700' />
                </div>
                <Skeleton className='h-3 w-24 dark:bg-gray-700' />
              </Card>
            ))}
          </div>
        </div>
        <Card className='p-6 dark:bg-gray-800'>
          <div className='flex items-center gap-2 mb-4'>
            <Skeleton className='w-2 h-6 dark:bg-gray-700' />
            <Skeleton className='h-6 w-24 dark:bg-gray-700' />
          </div>
          <div className='space-y-4'>
            <Skeleton className='h-24 w-full rounded-lg dark:bg-gray-700' />
            <Skeleton className='h-24 w-full rounded-lg dark:bg-gray-700' />
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <WelcomeBanner />
      <StatsCards />
      <RecentApplications onNavigate={handleNavigate} />
      <UsageDetails />
    </>
  );
}
