/**
 * 工作流设计器
 * 基于 ReactFlow 的节点编排，支持保存配置、启动/停止
 */
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Node, Edge, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, BackgroundVariant, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button.tsx';
import { Save, Maximize2, Minimize2, X, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows.ts';
import { WorkflowDetailVo } from '@/services/WorkflowsTypes.ts';

interface WorkflowEditorProps {
  workflowId: string;
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
    position: { x: 0, y: 0 },
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
    position: { x: 0, y: 0 },
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
    position: { x: 0, y: 0 },
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
    position: { x: 0, y: 0 },
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
    position: { x: 0, y: 0 },
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
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6' },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    style: { stroke: '#f59e0b' },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    style: { stroke: '#10b981' },
  },
];

function parseConfigToNodesEdges(config: object | undefined): { nodes: Node[]; edges: Edge[] } {
  if (!config || typeof config !== 'object') {
    return { nodes: initialNodes, edges: initialEdges };
  }
  const c = config as { nodes?: Node[]; edges?: Edge[] };
  if (Array.isArray(c.nodes) && Array.isArray(c.edges)) {
    return { nodes: c.nodes.length ? c.nodes : initialNodes, edges: c.edges };
  }
  return { nodes: initialNodes, edges: initialEdges };
}

export function WorkflowEditor({ workflowId, workflowName, workflowStatus, onClose }: WorkflowEditorProps) {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!workflowId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Workflows.getWorkflowDetail(workflowId)
      .then((res: unknown) => {
        if (cancelled) return;
        const data = (res as { data?: WorkflowDetailVo }).data;
        const cfg = data?.config;
        const { nodes: n, edges: e } = parseConfigToNodesEdges(cfg);
        setNodes(n);
        setEdges(e);
      })
      .catch(() => {
        if (!cancelled) toast.error('加载工作流配置失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [workflowId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(eds => addEdge({ ...params, animated: true }, eds));
      setHasChanges(true);
    },
    [setEdges]
  );

  const handleSave = async () => {
    if (!workflowId) return;
    setSaving(true);
    try {
      await Workflows.updateWorkflowConfig(workflowId, {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      });
      toast.success('工作流已保存');
      setHasChanges(false);
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleStartStop = async () => {
    if (!workflowId) return;
    setActionLoading(true);
    try {
      if (workflowStatus === '运行中') {
        await Workflows.stopWorkflow(workflowId);
        toast.success('工作流已停止');
      } else {
        await Workflows.startWorkflow(workflowId);
        toast.success('工作流已启动');
      }
      onClose(); // 返回列表以刷新状态
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '操作失败');
    } finally {
      setActionLoading(false);
    }
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
