import {
  Sidebar,
  Header,
  RecentApplications,
  WelcomeBanner,
  StatsCards,
  UsageDetails,
  CreateApplication,
  MyApplications,
  Workflow,
  WorkflowDesignPage,
  KnowledgeBase,
  Dataset,
  APICollection,
  PluginMarket,
  ModelManagement,
  VectorStore,
  TeamMembers,
  ResourceSharing,
  TeamSettings,
  AppSettingsPage,
  UsageAnalytics,
  APIKeys,
  BillingSubscription,
  PromptLibraryPage,
  Chat
} from './components';

import { ThemeProvider } from './components/ui/ThemeProvider';
import { LanguageProvider } from './components/ui/LanguageProvider';
import { Toaster } from './components/ui/sonner';
import { useState } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedWorkflowForDesign, setSelectedWorkflowForDesign] = useState<{
    id: number;
    name: string;
    status: '运行中' | '已停止';
  } | null>(null);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster richColors position="top-right" />
      {activePage !== 'chat' && (
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {activePage !== 'chat' && <Header />}
        
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          {activePage === 'chat' ? (
            <Chat onBack={() => setActivePage('home')} />
          ) : (
            <div className="px-7 py-6 space-y-6">
              {activePage === 'home' && (
                <>
                  <WelcomeBanner />
                  <StatsCards />
                  <RecentApplications onNavigate={setActivePage} />
                  <UsageDetails />
                </>
              )}
              {activePage === 'apps' && <MyApplications onCreateNew={() => setActivePage('create-app')} onNavigate={setActivePage} />}
              {activePage === 'create-app' && <CreateApplication onBack={() => setActivePage('apps')} />}
              {activePage === 'workflow' && <Workflow onDesignWorkflow={(workflow) => {
                setSelectedWorkflowForDesign(workflow);
                setActivePage('workflow-design');
              }} />}
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
              {activePage === 'prompts' && <PromptLibraryPage />}
              {activePage === 'team-members' && <TeamMembers />}
              {activePage === 'resource-sharing' && <ResourceSharing />}
              {activePage === 'team-settings' && <TeamSettings />}
              {activePage === 'individual-app-settings' && <AppSettingsPage onBack={() => setActivePage('apps')} />}
              {activePage === 'usage-analytics' && <UsageAnalytics />}
              {activePage === 'api-keys' && <APIKeys />}
              {activePage === 'billing' && <BillingSubscription />}
              {activePage !== 'home' && activePage !== 'apps' && activePage !== 'create-app' && activePage !== 'workflow' && activePage !== 'workflow-design' && activePage !== 'knowledge' && activePage !== 'dataset' && activePage !== 'api-collection' && activePage !== 'plugins' && activePage !== 'models' && activePage !== 'vector-store' && activePage !== 'prompts' && activePage !== 'team-members' && activePage !== 'resource-sharing' && activePage !== 'team-settings' && activePage !== 'individual-app-settings' && activePage !== 'usage-analytics' && activePage !== 'api-keys' && activePage !== 'billing' && (
                <div className="text-center py-12">
                  <h2 className="text-gray-900 dark:text-white mb-2">页面开发中</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
