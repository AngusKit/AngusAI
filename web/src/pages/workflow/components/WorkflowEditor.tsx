/**
 * 工作流设计器
 * 完整功能：节点面板、画布拖拽、节点配置、执行、执行日志
 */
import { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, Maximize2, Minimize2, X, Play, Pause, Zap, List } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkflowEditor } from '../hooks/useWorkflowEditor';
import { NodePanel } from './NodePanel';
import { NodeConfigPanel } from './NodeConfigPanel';
import { ExecuteDialog } from './ExecuteDialog';
import { ExecutionLogsPanel } from './ExecutionLogsPanel';
import { WorkflowNode } from '../nodes';
import { NODE_TYPES } from '../nodes/nodeTypes';

const nodeTypes = Object.fromEntries([
  ...NODE_TYPES.map(n => [n.type, WorkflowNode]),
  ['default', WorkflowNode],
  ['input', WorkflowNode],
  ['output', WorkflowNode],
]);

interface WorkflowEditorProps {
  workflowId: string;
  workflowName: string;
  workflowStatus: string;
  onClose: () => void;
}

function WorkflowEditorContent({ workflowId, workflowName, workflowStatus, onClose }: WorkflowEditorProps) {
  const { screenToFlowPosition } = useReactFlow();
  const {
    loading,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onSelectionChange,
    isFullscreen,
    hasChanges,
    saving,
    actionLoading,
    handleSave,
    handleStartStop,
    toggleFullscreen,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    handleExecute,
    executionLoading,
    showExecuteDialog,
    setShowExecuteDialog,
    showLogsPanel,
    setShowLogsPanel,
    executionLogs,
    logsLoading,
    loadExecutionLogs,
    updateNodeData,
  } = useWorkflowEditor(workflowId, workflowStatus, onClose);

  const handleDropWithPosition = useCallback(
    (e: React.DragEvent) => {
      onDrop(e, screenToFlowPosition);
    },
    [onDrop, screenToFlowPosition]
  );

  const configPanelOpen = !!selectedNodeId;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[600px] bg-white dark:bg-gray-900'>
        <span className='text-gray-500 dark:text-gray-400'>加载工作流配置中...</span>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-white dark:bg-gray-900 flex flex-col h-full`}>
      <Card
        className={`${isFullscreen ? 'h-screen rounded-none' : 'min-h-[500px] flex-1 h-full'} border-gray-200 dark:border-gray-700 flex flex-col`}
      >
        {/* 头部工具栏 */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0'>
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
              onClick={() => setShowExecuteDialog(true)}
              disabled={executionLoading}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <Zap className='w-4 h-4 mr-2' />
              {executionLoading ? '执行中...' : '执行'}
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setShowLogsPanel(true)}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <List className='w-4 h-4 mr-2' />
              执行日志
            </Button>
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
              {isFullscreen ? <Minimize2 className='w-4 h-4 mr-2' /> : <Maximize2 className='w-4 h-4 mr-2' />}
              {isFullscreen ? '退出全屏' : '全屏'}
            </Button>
            <Button size='sm' variant='outline' onClick={onClose} className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* 主体：节点面板 + 画布 */}
        <div className='flex flex-1 min-h-0'>
          <NodePanel className='w-56 shrink-0' />
          <div className='flex-1 relative' onDragOver={onDragOver} onDrop={handleDropWithPosition}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={params => onConnect({ ...params, type: 'smoothstep', animated: true })}
              onSelectionChange={onSelectionChange}
              onPaneClick={() => setSelectedNodeId(null)}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              nodeTypes={nodeTypes}
              fitView
              className='dark:bg-gray-900'
              connectionLineStyle={{ stroke: '#3b82f6' }}
            >
              <Controls className='dark:bg-gray-800 dark:border-gray-700' />
              <MiniMap
                className='dark:bg-gray-800 dark:border-gray-700'
                nodeColor={node => {
                  const def = NODE_TYPES.find(n => n.type === node.type);
                  return def?.color ?? '#8b5cf6';
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} className='dark:bg-gray-900' />
            </ReactFlow>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className='flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0'>
          <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
            <span>节点数: {nodes.length}</span>
            <span>连线数: {edges.length}</span>
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            从左侧拖拽节点到画布 · 点击节点配置 · 点击空白取消选择
          </div>
        </div>
      </Card>

      <NodeConfigPanel
        node={selectedNode}
        open={configPanelOpen}
        onOpenChange={open => !open && setSelectedNodeId(null)}
        onUpdateNodeData={updateNodeData}
      />
      <ExecuteDialog
        open={showExecuteDialog}
        onOpenChange={setShowExecuteDialog}
        onExecute={handleExecute}
        loading={executionLoading}
      />
      <ExecutionLogsPanel
        open={showLogsPanel}
        onOpenChange={setShowLogsPanel}
        logs={executionLogs}
        loading={logsLoading}
        onLoad={loadExecutionLogs}
      />
    </div>
  );
}

export function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent {...props} />
    </ReactFlowProvider>
  );
}
