import { appContext } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { LanguageProvider } from '@/components/LanguageProvider.tsx';
import { MyContext } from '@/components/ui/utils';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

export function ChatLayout() {
    const userInfo = appContext.getUser();
    return (
        <ThemeProvider>
            <LanguageProvider>
                <MyContext.Provider value={{ userInfo }}>
                <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
                    <Toaster richColors position='top-right' />
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <main className='flex-1 overflow-y-auto hide-scrollbar'>
                            <Outlet />
                        </main>
                    </div>
                </div>
                </MyContext.Provider>
            </LanguageProvider>
        </ThemeProvider>
    )
}
