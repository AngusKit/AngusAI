/**
 * 工作流设计器
 * 基于 ReactFlow 的节点编排，支持保存配置、启动/停止
 */
import ReactFlow, { Controls, Background, Connection, BackgroundVariant, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button.tsx';
import { Save, Maximize2, Minimize2, X, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useWorkflowEditor } from '../hooks/useWorkflowEditor';

interface WorkflowEditorProps {
  workflowId: string;
  workflowName: string;
  workflowStatus: string;
  onClose: () => void;
}

export function WorkflowEditor({ workflowId, workflowName, workflowStatus, onClose }: WorkflowEditorProps) {
  const {
    loading,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isFullscreen,
    hasChanges,
    saving,
    actionLoading,
    handleSave,
    handleStartStop,
    toggleFullscreen,
  } = useWorkflowEditor(workflowId, workflowStatus, onClose);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[600px] bg-white dark:bg-gray-900'>
        <span className='text-gray-500 dark:text-gray-400'>加载工作流配置中...</span>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-white dark:bg-gray-900`}>
      <Card
        className={`${isFullscreen ? 'h-screen rounded-none' : 'h-[600px]'} border-gray-200 dark:border-gray-700 flex flex-col`}
      >
        {/* 头部工具栏 */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-4'>
            <h3 className='text-lg dark:text-white'>{workflowName}</h3>
            <Badge
              className={`${
                workflowStatus === '运行中'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
              } border-0`}
            >
              {workflowStatus}
            </Badge>
            {hasChanges && (
              <Badge className='bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0'>
                未保存
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <Save className='w-4 h-4 mr-2' />
              {saving ? '保存中...' : '保存'}
            </Button>

            <Button
              size='sm'
              variant='outline'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              onClick={handleStartStop}
              disabled={actionLoading}
            >
              {workflowStatus === '运行中' ? (
                <>
                  <Pause className='w-4 h-4 mr-2' />
                  {actionLoading ? '处理中...' : '暂停'}
                </>
              ) : (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  {actionLoading ? '处理中...' : '启动'}
                </>
              )}
            </Button>

            <Button
              size='sm'
              variant='outline'
              onClick={toggleFullscreen}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className='w-4 h-4 mr-2' />
                  退出全屏
                </>
              ) : (
                <>
                  <Maximize2 className='w-4 h-4 mr-2' />
                  全屏
                </>
              )}
            </Button>

            <Button
              size='sm'
              variant='outline'
              onClick={onClose}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* 流程图画布 */}
        <div className='flex-1 relative'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodeChange}
            onEdgesChange={handleEdgeChange}
            onConnect={onConnect}
            fitView
            className='dark:bg-gray-900'
          >
            <Controls className='dark:bg-gray-800 dark:border-gray-700' />
            <MiniMap
              className='dark:bg-gray-800 dark:border-gray-700'
              nodeColor={node => {
                if (node.type === 'input') return '#3b82f6';
                if (node.type === 'output') return '#ef4444';
                return '#8b5cf6';
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} className='dark:bg-gray-900' />
          </ReactFlow>
        </div>

        {/* 底部信息栏 */}
        <div className='flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
          <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
            <span>节点数: {nodes.length}</span>
            <span>连线数: {edges.length}</span>
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>提示: 拖动节点可以调整位置，点击节点可以连接</div>
        </div>
      </Card>
    </div>
  );
}
