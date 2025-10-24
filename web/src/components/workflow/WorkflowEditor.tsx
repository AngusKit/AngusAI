import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../ui/button';
import { Maximize2, Minimize2, Pause, Play, Save, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface WorkflowEditorProps {
  workflowId: number;
  workflowName: string;
  workflowStatus: string;
  onClose: () => void;
}

// 初始节点数据
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '开始' },
    position: { x: 250, y: 50 },
    style: {
      background: '#3b82f6',
      color: 'white',
      border: '2px solid #2563eb',
      borderRadius: '8px',
      padding: '10px 20px',
    },
  },
  {
    id: '2',
    data: { label: 'AI处理节点' },
    position: { x: 250, y: 150 },
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '2px solid #7c3aed',
      borderRadius: '8px',
      padding: '10px 20px',
    },
  },
  {
    id: '3',
    data: { label: '条件判断' },
    position: { x: 100, y: 250 },
    style: {
      background: '#f59e0b',
      color: 'white',
      border: '2px solid #d97706',
      borderRadius: '8px',
      padding: '10px 20px',
    },
  },
  {
    id: '4',
    data: { label: '数据存储' },
    position: { x: 400, y: 250 },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '8px',
      padding: '10px 20px',
    },
  },
  {
    id: '5',
    type: 'output',
    data: { label: '结束' },
    position: { x: 250, y: 350 },
    style: {
      background: '#ef4444',
      color: 'white',
      border: '2px solid #dc2626',
      borderRadius: '8px',
      padding: '10px 20px',
    },
  },
];

// 初始连线数据
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#8b5cf6' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    animated: true,
    style: { stroke: '#8b5cf6' },
  },
  { id: 'e3-5', source: '3', target: '5', style: { stroke: '#f59e0b' } },
  { id: 'e4-5', source: '4', target: '5', style: { stroke: '#10b981' } },
];

export function WorkflowEditor({
  workflowId,
  workflowName,
  workflowStatus,
  onClose,
}: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(eds => addEdge({ ...params, animated: true }, eds));
      setHasChanges(true);
    },
    [setEdges]
  );

  const handleSave = () => {
    toast.success('工作流已保存');
    setHasChanges(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNodeChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      setHasChanges(true);
    },
    [onNodesChange]
  );

  const handleEdgeChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setHasChanges(true);
    },
    [onEdgesChange]
  );

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-white dark:bg-gray-900`}
    >
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
              disabled={!hasChanges}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              <Save className='w-4 h-4 mr-2' />
              保存
            </Button>

            <Button
              size='sm'
              variant='outline'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              {workflowStatus === '运行中' ? (
                <>
                  <Pause className='w-4 h-4 mr-2' />
                  暂停
                </>
              ) : (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  启动
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
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
              className='dark:bg-gray-900'
            />
          </ReactFlow>
        </div>

        {/* 底部信息栏 */}
        <div className='flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
          <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
            <span>节点数: {nodes.length}</span>
            <span>连线数: {edges.length}</span>
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            提示: 拖动节点可以调整位置，点击节点可以连接
          </div>
        </div>
      </Card>
    </div>
  );
}
