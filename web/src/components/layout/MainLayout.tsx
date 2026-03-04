import { appContext } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { LanguageProvider } from '@/components/LanguageProvider.tsx';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { MyContext } from '@/components/ui/utils';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    const userInfo = appContext.getUser();
    return (
        <ThemeProvider>
            <LanguageProvider>
                <MyContext.Provider value={{ userInfo }}>
                <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
                    <Toaster richColors position='top-right' />
                    {<Sidebar />}
                    <div className='flex-1 flex flex-col overflow-hidden'>
                    {<Header />}
                    <main className='flex-1 overflow-y-auto hide-scrollbar'>
                        <div className='px-7 py-6 space-y-6'>
                            <Outlet />
                        </div>
                    </main>
                    </div>
                </div>
                </MyContext.Provider>
            </LanguageProvider>
        </ThemeProvider>
    )
}
