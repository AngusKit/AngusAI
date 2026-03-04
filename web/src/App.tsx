import { Sidebar } from '@/components/Sidebar.tsx';
import { Header } from '@/components/Header.tsx';
import { RecentApplications, WelcomeBanner, StatsCards, UsageDetails } from '@/pages/dashboard';
import { CreateApplication, MyApplications } from '@/pages/applications';
import { Workflow, WorkflowDesignPage } from '@/pages/workflow';
import { KnowledgeBase } from '@/pages/knowledge';
import { Dataset } from '@/pages/dataset';
import { APICollection } from '@/pages/apis/APICollection';
import { PluginMarket } from '@/pages/plugins';
import { ModelManagement } from '@/pages/models';
import { VectorStore } from '@/pages/vector/VectorStore';
import { TeamMembers, ResourceSharing, TeamSettings } from '@/pages/team';
import { AppSettingsPage, UsageAnalytics, APIKeys, BillingSubscription } from '@/pages/settings';
import { PromptLibraryPage } from '@/pages/prompt/PromptLibraryPage';
import { Chat } from '@/pages/chat';
import { ActivityLog } from '@/pages/activity/ActivityLog';
import { appContext, eventQueue } from '@xcan-angus/infra';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { LanguageProvider } from '@/components/ui/LanguageProvider';
import { Toaster } from '@/components/ui/sonner';
import { MyContext } from '@/components/ui/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export default function App() {
  eventQueue.register('http_error', (msg: string) => {
    toast.error(msg);
  });
  const [activePage, setActivePage] = useState('home');
  const appUserInfo = appContext.getUser();
  const [chatContent, setChatContent] = useState<string>('');
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

  const [selectedWorkflowForDesign, setSelectedWorkflowForDesign] = useState<{
    id: number;
    name: string;
    status: '运行中' | '已停止';
  } | null>(null);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MyContext.Provider value={{ userInfo }}>
          <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
            <Toaster richColors position='top-right' />
            {activePage !== 'chat' && <Sidebar activePage={activePage} onPageChange={(page) => {setActivePage(page); setChatContent('')}} />}
            <div className='flex-1 flex flex-col overflow-hidden'>
              {activePage !== 'chat' && <Header />}

              <main className='flex-1 overflow-y-auto hide-scrollbar'>
                {activePage === 'chat' ? (
                  <Chat content={chatContent} onBack={() => setActivePage('home')} />
                ) : (
                  <div className='px-7 py-6 space-y-6'>
                    {activePage === 'home' && (
                      <>
                        <WelcomeBanner />
                        <StatsCards />
                        <RecentApplications onNavigate={(page) => {setActivePage(page); setChatContent('')}} />
                        <UsageDetails />
                      </>
                    )}
                    {activePage === 'apps' && (
                      <MyApplications onCreateNew={() => setActivePage('create-app')} onNavigate={setActivePage} />
                    )}
                    {activePage === 'create-app' && <CreateApplication onBack={() => setActivePage('apps')} />}
                    {activePage === 'workflow' && (
                      <Workflow
                        onDesignWorkflow={workflow => {
                          setSelectedWorkflowForDesign(workflow);
                          setActivePage('workflow-design');
                        }}
                      />
                    )}
                    {activePage === 'workflow-design' && selectedWorkflowForDesign && (
                      <WorkflowDesignPage
                        workflowId={selectedWorkflowForDesign.id}
                        workflowName={selectedWorkflowForDesign.name}
                        workflowStatus={selectedWorkflowForDesign.status}
                        onBack={() => {
                          setSelectedWorkflowForDesign(null);
                          setActivePage('workflow');
                        }}
                      />
                    )}
                    {activePage === 'knowledge' && <KnowledgeBase />}
                    {activePage === 'dataset' && <Dataset />}
                    {activePage === 'api-collection' && <APICollection />}
                    {activePage === 'plugins' && <PluginMarket />}
                    {activePage === 'models' && <ModelManagement />}
                    {activePage === 'vector-store' && <VectorStore />}
                    {activePage === 'prompts' && <PromptLibraryPage goChat={(promptContent) => {
                      setChatContent(promptContent);
                      setActivePage('chat');
                      
                    }} />}
                    {activePage === 'team-members' && <TeamMembers />}
                    {activePage === 'activity-log' && <ActivityLog />}
                    {activePage === 'resource-sharing' && <ResourceSharing />}
                    {activePage === 'team-settings' && <TeamSettings />}
                    {activePage === 'individual-app-settings' && (
                      <AppSettingsPage onBack={() => setActivePage('apps')} />
                    )}
                    {activePage === 'usage-analytics' && <UsageAnalytics />}
                    {activePage === 'api-keys' && <APIKeys />}
                    {activePage === 'billing' && <BillingSubscription />}
                    {activePage !== 'home' &&
                      activePage !== 'apps' &&
                      activePage !== 'create-app' &&
                      activePage !== 'workflow' &&
                      activePage !== 'workflow-design' &&
                      activePage !== 'knowledge' &&
                      activePage !== 'dataset' &&
                      activePage !== 'api-collection' &&
                      activePage !== 'plugins' &&
                      activePage !== 'models' &&
                      activePage !== 'vector-store' &&
                      activePage !== 'prompts' &&
                      activePage !== 'team-members' &&
                      activePage !== 'resource-sharing' &&
                      activePage !== 'team-settings' &&
                      activePage !== 'individual-app-settings' &&
                      activePage !== 'usage-analytics' &&
                      activePage !== 'api-keys' &&
                      activePage !== 'billing' && (
                        <div className='text-center py-12'>
                          <h2 className='text-gray-900 dark:text-white mb-2'>页面开发中</h2>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>{activePage} 页面正在开发中...</p>
                        </div>
                      )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </MyContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
