import { MainLayout } from '@/components/layout/mainLayout';
import { ChatLayout } from '@/components/layout/chatLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import  { Home } from '@/pages/home';
import {  CreateApplication, MyApplications, Workflow, WorkflowDesignPage, KnowledgeBase, Dataset, APICollection, PluginMarket, ModelManagement, VectorStore, TeamMembers, ResourceSharing, AppSettingsPage, UsageAnalytics, APIKeys, BillingSubscription, PromptLibraryPage, Chat, ActivityLog, } from '@/pages';

export function AppRoute() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/' element={<MainLayout />}>
        <Route path='home' element={ <Home />} />
        <Route path='apps' element={<MyApplications />} />
        <Route path='create-app' element={<CreateApplication />} />
        <Route path='workflow' element={<Workflow  />} />
        <Route path='workflow-design' element={<WorkflowDesignPage  />} />
        <Route path='knowledge' element={<KnowledgeBase />} />
        <Route path='dataset' element={<Dataset />} />
        <Route path='api-collection' element={<APICollection />} />
        <Route path='plugins' element={<PluginMarket />} />
        <Route path='models' element={<ModelManagement />} />
        <Route path='vector-store' element={<VectorStore />} />
        <Route path='prompts' element={<PromptLibraryPage  />} />
        <Route path='team-members' element={<TeamMembers />} />
        <Route path='activity-log' element={<ActivityLog />} />
        <Route path='resource-sharing' element={<ResourceSharing />} />
        <Route path='individual-app-settings' element={<AppSettingsPage  />} />
        <Route path='usage-analytics' element={<UsageAnalytics />} />
        <Route path='api-keys' element={<APIKeys />} />
        <Route path='billing' element={<BillingSubscription />} />
        <Route path='*' element={(
                <div className='text-center py-12'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>页面正在开发中...</p>
                </div>
            )} />
      </Route>
      <Route path='/' element={<ChatLayout />}>
        <Route path='/chat' element={<Chat />} />
      </Route>
    </Routes>
  );
}