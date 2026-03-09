/**
 * 工作流设计器 Hook
 * 节点/连线状态、加载配置、保存、启动/停止
 */
import { useState, useCallback, useEffect } from 'react';
import type { Node, Edge, Connection } from 'reactflow';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowDetailVo } from '@/services/WorkflowsTypes';

/** 初始节点 */
const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: '开始' }, position: { x: 0, y: 0 }, style: { background: '#3b82f6', color: 'white', border: '2px solid #2563eb', borderRadius: '8px', padding: '10px 20px' } },
  { id: '2', data: { label: 'AI处理节点' }, position: { x: 0, y: 0 }, style: { background: '#8b5cf6', color: 'white', border: '2px solid #7c3aed', borderRadius: '8px', padding: '10px 20px' } },
  { id: '3', data: { label: '条件判断' }, position: { x: 0, y: 0 }, style: { background: '#f59e0b', color: 'white', border: '2px solid #d97706', borderRadius: '8px', padding: '10px 20px' } },
  { id: '4', data: { label: '数据存储' }, position: { x: 0, y: 0 }, style: { background: '#10b981', color: 'white', border: '2px solid #059669', borderRadius: '8px', padding: '10px 20px' } },
  { id: '5', type: 'output', data: { label: '结束' }, position: { x: 0, y: 0 }, style: { background: '#ef4444', color: 'white', border: '2px solid #dc2626', borderRadius: '8px', padding: '10px 20px' } },
];

/** 初始连线 */
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', style: { stroke: '#f59e0b' } },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: { stroke: '#10b981' } },
];

function parseConfigToNodesEdges(config: object | undefined): { nodes: Node[]; edges: Edge[] } {
  if (!config || typeof config !== 'object') return { nodes: initialNodes, edges: initialEdges };
  const c = config as { nodes?: Node[]; edges?: Edge[] };
  if (Array.isArray(c.nodes) && Array.isArray(c.edges)) {
    return { nodes: c.nodes.length ? c.nodes : initialNodes, edges: c.edges };
  }
  return { nodes: initialNodes, edges: initialEdges };
}

export function useWorkflowEditor(workflowId: string, workflowStatus: string, onClose: () => void) {
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

  const handleNodeChange = useCallback(
    (changes: unknown) => {
      onNodesChange(changes as Parameters<typeof onNodesChange>[0]);
      setHasChanges(true);
    },
    [onNodesChange]
  );

  const handleEdgeChange = useCallback(
    (changes: unknown) => {
      onEdgesChange(changes as Parameters<typeof onEdgesChange>[0]);
      setHasChanges(true);
    },
    [onEdgesChange]
  );

  const handleSave = useCallback(async () => {
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
  }, [workflowId, nodes, edges]);

  const handleStartStop = useCallback(async () => {
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
      onClose();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '操作失败');
    } finally {
      setActionLoading(false);
    }
  }, [workflowId, workflowStatus, onClose]);

  const toggleFullscreen = useCallback(() => setIsFullscreen(v => !v), []);

  return {
    loading,
    nodes,
    edges,
    onNodesChange: handleNodeChange,
    onEdgesChange: handleEdgeChange,
    onConnect,
    isFullscreen,
    hasChanges,
    saving,
    actionLoading,
    handleSave,
    handleStartStop,
    toggleFullscreen,
  };
}
