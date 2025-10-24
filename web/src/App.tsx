import {
  APIKeys,
  AppSettingsPage,
  BillingSubscription,
  Chat,
  CreateApplication,
  Dataset,
  Header,
  KnowledgeBase,
  LanguageProvider,
  ModelManagement,
  MyApplications,
  PluginMarket,
  PromptLibraryPage,
  RecentApplications,
  ResourceSharing,
  Sidebar,
  StatsCards,
  TeamMembers,
  TeamSettings,
  ThemeProvider,
  UsageAnalytics,
  UsageDetails,
  WelcomeBanner,
  Workflow,
} from './components';

import { Toaster } from './components/ui/sonner';
import { useState } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
          <Toaster richColors position='top-right' />
          {activePage !== 'create-app' && activePage !== 'chat' && (
            <Sidebar activePage={activePage} onPageChange={setActivePage} />
          )}

          <div className='flex-1 flex flex-col overflow-hidden'>
            {activePage !== 'create-app' && activePage !== 'chat' && <Header />}

            <main className='flex-1 overflow-y-auto hide-scrollbar'>
              {activePage === 'create-app' ? (
                <CreateApplication onBack={() => setActivePage('apps')} />
              ) : activePage === 'chat' ? (
                <Chat onBack={() => setActivePage('home')} />
              ) : (
                <div className='px-7 py-6 space-y-6'>
                  {activePage === 'home' && (
                    <>
                      <WelcomeBanner />
                      <StatsCards />
                      <RecentApplications onNavigate={setActivePage} />
                      <UsageDetails />
                    </>
                  )}
                  {activePage === 'apps' && (
                    <MyApplications
                      onCreateNew={() => setActivePage('create-app')}
                      onNavigate={setActivePage}
                    />
                  )}
                  {activePage === 'individual-app-settings' && (
                    <AppSettingsPage onBack={() => setActivePage('apps')} />
                  )}
                  {activePage === 'workflow' && <Workflow />}
                  {activePage === 'knowledge' && <KnowledgeBase />}
                  {activePage === 'dataset' && <Dataset />}
                  {activePage === 'plugins' && <PluginMarket />}
                  {activePage === 'models' && <ModelManagement />}
                  {activePage === 'prompts' && <PromptLibraryPage />}
                  {activePage === 'team-members' && <TeamMembers />}
                  {activePage === 'resource-sharing' && <ResourceSharing />}
                  {activePage === 'team-settings' && <TeamSettings />}
                  {activePage === 'usage-analytics' && <UsageAnalytics />}
                  {activePage === 'api-keys' && <APIKeys />}
                  {activePage === 'billing' && <BillingSubscription />}
                  {activePage !== 'home' &&
                    activePage !== 'apps' &&
                    activePage !== 'workflow' &&
                    activePage !== 'knowledge' &&
                    activePage !== 'dataset' &&
                    activePage !== 'plugins' &&
                    activePage !== 'models' &&
                    activePage !== 'prompts' &&
                    activePage !== 'team-members' &&
                    activePage !== 'resource-sharing' &&
                    activePage !== 'team-settings' &&
                    activePage !== 'individual-app-settings' &&
                    activePage !== 'usage-analytics' &&
                    activePage !== 'api-keys' &&
                    activePage !== 'billing' && (
                      <div className='text-center py-12'>
                        <h2 className='text-gray-900 dark:text-white mb-2'>
                          页面开发中
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {activePage} 页面正在开发中...
                        </p>
                      </div>
                    )}
                </div>
              )}
            </main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
