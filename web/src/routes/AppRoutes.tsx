import { MainLayout } from '@/components/layout/MainLayout';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard/Dashboard.tsx';
import { CreateApplication } from '@/pages/applications/components/CreateApplication.tsx';
import { MyApplications } from '@/pages/applications/MyApplications';
import { ApplicationDetailPage } from '@/pages/applications/components/ApplicationDetailPage.tsx';
import { EditApplicationPage } from '@/pages/applications/components/EditApplicationPage.tsx';
import { Workflow } from '@/pages/workflow/Workflow';
import { WorkflowDesignPage } from '@/pages/workflow/components/WorkflowDesignPage.tsx';
import { WorkflowDetailPage } from '@/pages/workflow/components/WorkflowDetailPage.tsx';
import { CreateWorkflowPage } from '@/pages/workflow/components/CreateWorkflowPage.tsx';
import { WorkflowInfoPage } from '@/pages/workflow/components/WorkflowInfoPage.tsx';
import { KnowledgeBase } from '@/pages/knowledge/KnowledgeBase';
import { Dataset } from '@/pages/dataset/Dataset';
import { APICollection } from '@/pages/apis/APICollection';
import { PluginMarket } from '@/pages/plugins/PluginMarket';
import { ModelManagement } from '@/pages/models/ModelManagement';
import { AgentManagement } from '@/pages/agents/AgentManagement';
import { CreateAgentPage } from '@/pages/agents/components/CreateAgentPage.tsx';
import { EditAgentPage } from '@/pages/agents/components/EditAgentPage.tsx';
import { AgentDetailPage } from '@/pages/agents/components/AgentDetailPage.tsx';
import { VectorStore } from '@/pages/vector/VectorStore';
import { Members } from '@/pages/member/Members.tsx';
import { ResourceSharing } from '@/pages/sharding/ResourceSharing';
import { ApplicationSettingsPage } from '@/pages/applications/components/ApplicationSettingsPage.tsx';
import { UsageAnalytics } from '@/pages/settings/UsageAnalytics';
import { APIKeys } from '@/pages/settings/APIKeys';
import { BillingSubscription } from '@/pages/settings/BillingSubscription';
import { PromptLibrary } from '@/pages/prompt/PromptLibrary.tsx';
import { Chat } from '@/pages/chat/Chat';
import { ActivityLog } from '@/pages/activity/ActivityLog.tsx';
import { Notifications } from '@/pages/notifications/Notifications.tsx';
import { NotFoundPage } from '@/components/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route path='/' element={<MainLayout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='apps' element={<MyApplications />} />
        <Route path='apps/create' element={<CreateApplication />} />
        <Route path='apps/:id' element={<ApplicationDetailPage />} />
        <Route path='apps/:id/edit' element={<EditApplicationPage />} />
        <Route path='apps/:id/settings' element={<ApplicationSettingsPage />} />
        <Route path='create-app' element={<CreateApplication />} />
        <Route path='workflow' element={<Workflow />} />
        <Route path='workflow/create' element={<CreateWorkflowPage />} />
        <Route path='workflow/:id/info' element={<WorkflowInfoPage />} />
        <Route path='workflow/:id' element={<WorkflowDetailPage />} />
        <Route path='workflow-design' element={<WorkflowDesignPage />} />
        <Route path='knowledge' element={<KnowledgeBase />} />
        <Route path='dataset' element={<Dataset />} />
        <Route path='api-collection' element={<APICollection />} />
        <Route path='plugins' element={<PluginMarket />} />
        <Route path='models' element={<ModelManagement />} />
        <Route path='agents' element={<AgentManagement />} />
        <Route path='agents/create' element={<CreateAgentPage />} />
        <Route path='agents/:id/edit' element={<EditAgentPage />} />
        <Route path='agents/:id' element={<AgentDetailPage />} />
        <Route path='vector-store' element={<VectorStore />} />
        <Route path='prompts' element={<PromptLibrary />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path='team-members' element={<Members />} />
        <Route path='activity-log' element={<ActivityLog />} />
        <Route path='resource-sharing' element={<ResourceSharing />} />
        <Route path='usage-analytics' element={<UsageAnalytics />} />
        <Route path='api-keys' element={<APIKeys />} />
        <Route path='billing' element={<BillingSubscription />} />
        <Route path='*' element={<NotFoundPage homePath='/dashboard' />} />
      </Route>
      <Route path='/' element={<ChatLayout />}>
        <Route path='chat' element={<Chat />} />
      </Route>
    </Routes>
  );
}
