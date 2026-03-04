import { MainLayout } from '@/components/layout/MainLayout';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/home';
import { CreateApplication, MyApplications } from '@/pages/applications';
import { Workflow, WorkflowDesignPage } from '@/pages/workflow';
import { KnowledgeBase } from '@/pages/knowledge';
import { Dataset } from '@/pages/dataset';
import { APICollection } from '@/pages/apis';
import { PluginMarket } from '@/pages/plugins';
import { ModelManagement } from '@/pages/models';
import { VectorStore } from '@/pages/vector';
import { TeamMembers, ResourceSharing } from '@/pages/team';
import { AppSettingsPage, UsageAnalytics, APIKeys, BillingSubscription } from '@/pages/settings';
import { PromptLibraryPage } from '@/pages/prompt';
import { Chat } from '@/pages/chat';
import { ActivityLog } from '@/pages/activity/ActivityLog';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { NotFoundPage } from '@/components/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' replace />} />
      <Route path='/' element={<MainLayout />}>
        <Route path='home' element={<Home />} />
        <Route path='apps' element={<MyApplications />} />
        <Route path='create-app' element={<CreateApplication />} />
        <Route path='workflow' element={<Workflow />} />
        <Route path='workflow-design' element={<WorkflowDesignPage />} />
        <Route path='knowledge' element={<KnowledgeBase />} />
        <Route path='dataset' element={<Dataset />} />
        <Route path='api-collection' element={<APICollection />} />
        <Route path='plugins' element={<PluginMarket />} />
        <Route path='models' element={<ModelManagement />} />
        <Route path='vector-store' element={<VectorStore />} />
        <Route path='prompts' element={<PromptLibraryPage />} />
        <Route path='notifications' element={<NotificationsPage />} />
        <Route path='team-members' element={<TeamMembers />} />
        <Route path='activity-log' element={<ActivityLog />} />
        <Route path='resource-sharing' element={<ResourceSharing />} />
        <Route path='individual-app-settings' element={<AppSettingsPage />} />
        <Route path='usage-analytics' element={<UsageAnalytics />} />
        <Route path='api-keys' element={<APIKeys />} />
        <Route path='billing' element={<BillingSubscription />} />
        <Route path='*' element={<NotFoundPage homePath='/home' />} />
      </Route>
      <Route path='/' element={<ChatLayout />}>
        <Route path='chat' element={<Chat />} />
      </Route>
    </Routes>
  );
}
