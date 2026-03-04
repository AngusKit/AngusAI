import { useState, useEffect, useCallback } from 'react';
import { appContext } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { LanguageProvider } from '@/components/LanguageProvider.tsx';
import { Sidebar } from '@/components/Sidebar';
import { SidebarToggle } from '@/components/SidebarToggle';
import { Header } from '@/components/Header';
import { MyContext } from '@/components/ui/utils';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

const SIDEBAR_COLLAPSED_KEY = 'ai_sidebar_collapsed';

export function MainLayout() {
    const userInfo = appContext.getUser();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
        } catch {
            /* ignore */
        }
    }, [sidebarCollapsed]);

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed((prev) => !prev);
    }, []);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <MyContext.Provider value={{ userInfo }}>
                <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
                    <Toaster richColors position='top-right' />
                    <Sidebar collapsed={sidebarCollapsed} />
                    <div className='flex-1 flex flex-col min-w-0 relative'>
                        <SidebarToggle collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
                        <div className='flex-1 flex flex-col overflow-hidden min-h-0'>
                            <Header />
                            <main className='flex-1 overflow-y-auto hide-scrollbar min-h-0'>
                                <div className='px-7 py-6 space-y-6'>
                                    <Outlet />
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
                </MyContext.Provider>
            </LanguageProvider>
        </ThemeProvider>
    )
}
