import { AppRoutes } from '@/routes/AppRoutes.tsx';
import { appContext, eventQueue } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { LanguageProvider } from '@/components/LanguageProvider.tsx';
import { Toaster } from '@/components/ui/sonner';
import { MyContext } from '@/components/ui/utils';
import { toast } from 'sonner';

export default function App() {
  eventQueue.register('http_error', (msg: string) => {
    toast.error(msg);
  });

  const userInfo = appContext.getUser()!;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MyContext.Provider value={{ userInfo }}>
          <Toaster richColors position='top-right' />
          <AppRoutes />
        </MyContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
