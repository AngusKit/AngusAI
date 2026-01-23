import { appContext, eventQueue } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { LanguageProvider } from '@/components/ui/LanguageProvider';
import { MyContext } from '@/components/ui/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

export function ChatLayout() { 
    eventQueue.register('http_error', (msg: string) => {
    toast.error(msg);
    });
    const appUserInfo = appContext.getUser();
    const [userInfo, setUserInfo] = useState(
        appUserInfo?.id
          ? appUserInfo
          : {
              fullName: '柳小龙',
              id: '100001',
              avatar:
                'https://images.unsplash.com/photo-1652795385761-7ac287d0cd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhdmF0YXIlMjBjYXJ0b29ufGVufDF8fHx8MTc2MTEwMTExNXww&ixlib=rb-4.1.0&q=80&w=1080',
              verified: true,
            }
      );
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