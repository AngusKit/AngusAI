import { MainLayout } from '@/components/layout/MainLayout';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/home';
import { CreateApplication } from '@/pages/applications/CreateApplication';
import { MyApplications } from '@/pages/applications/MyApplications';
import { Workflow } from '@/pages/workflow/Workflow';
import { WorkflowDesignPage } from '@/pages/workflow/WorkflowDesignPage';
import { WorkflowDetailPage } from '@/pages/workflow/WorkflowDetailPage';
import { KnowledgeBase } from '@/pages/knowledge/KnowledgeBase';
import { Dataset } from '@/pages/dataset/Dataset';
import { APICollection } from '@/pages/apis/APICollection';
import { PluginMarket } from '@/pages/plugins/PluginMarket';
import { ModelManagement } from '@/pages/models/ModelManagement';
import { AgentManagement } from '@/pages/agents/AgentManagement';
import { CreateAgentPage } from '@/pages/agents/CreateAgentPage';
import { EditAgentPage } from '@/pages/agents/EditAgentPage';
import { AgentDetailPage } from '@/pages/agents/AgentDetailPage';
import { VectorStore } from '@/pages/vector/VectorStore';
import { TeamMembersPage } from '@/pages/member/TeamMembersPage';
import { ResourceSharing } from '@/pages/sharding/ResourceSharing';
import { AppSettingsPage } from '@/pages/settings/AppSettingsPage';
import { UsageAnalytics } from '@/pages/settings/UsageAnalytics';
import { APIKeys } from '@/pages/settings/APIKeys';
import { BillingSubscription } from '@/pages/settings/BillingSubscription';
import { PromptLibraryPage } from '@/pages/prompt/PromptLibraryPage';
import { Chat } from '@/pages/chat/Chat';
import { ActivityLogPage } from '@/pages/activity/ActivityLogPage';
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
        <Route path='prompts' element={<PromptLibraryPage />} />
        <Route path='notifications' element={<NotificationsPage />} />
        <Route path='team-members' element={<TeamMembersPage />} />
        <Route path='activity-log' element={<ActivityLogPage />} />
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
