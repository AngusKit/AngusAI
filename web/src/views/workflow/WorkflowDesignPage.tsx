import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { WorkflowEditor } from './WorkflowEditor';

interface WorkflowDesignPageProps {
  workflowId: number;
  workflowName: string;
  workflowStatus: '运行中' | '已停止';
  onBack: () => void;
}

export function WorkflowDesignPage({ workflowId, workflowName, workflowStatus, onBack }: WorkflowDesignPageProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回工作流列表
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl dark:text-white">{workflowName}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            工作流设计编辑器
          </p>
        </div>
      </div>

      {/* Workflow Editor - Full Height */}
      <div className="flex-1 overflow-hidden">
        <WorkflowEditor
          workflowId={workflowId}
          workflowName={workflowName}
          workflowStatus={workflowStatus}
          onClose={onBack}
        />
      </div>
    </div>
  );
}
