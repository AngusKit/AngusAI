import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowEditor } from './WorkflowEditor';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function WorkflowDesignPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('workflowId');
  const workflowName = searchParams.get('workflowName');
  const workflowStatus = searchParams.get('workflowStatus');
  const handleBack = () => {
    navigate('/workflow');
  };
  return (
    <div className='h-full flex flex-col'>
      {/* Header with Back Button */}
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' size='sm' onClick={handleBack} className='dark:text-gray-300 dark:hover:bg-gray-800'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回
        </Button>
        <div className='flex-1'>
          <h1 className='text-2xl dark:text-white'>{workflowName}</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>工作流设计编辑器</p>
        </div>
      </div>

      {/* Workflow Editor - Full Height */}
      <div className='flex-1 overflow-hidden'>
        <WorkflowEditor
          workflowId={workflowId || ''}
          workflowName={workflowName || ''}
          workflowStatus={workflowStatus || ''}
          onClose={handleBack}
        />
      </div>
    </div>
  );
}
