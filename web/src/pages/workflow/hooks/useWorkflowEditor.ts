/**
 * 工作流设计器 Hook
 * 节点/连线、拖拽、选中、保存、执行、撤销重做
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Node, Edge, Connection } from 'reactflow';
import { useNodesState, useEdgesState, addEdge, reconnectEdge } from 'reactflow';
import { validateConnection } from '../utils/workflowConnectionValidation';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import {
  WorkflowDetailVo,
  WorkflowExecuteResultVo,
  ExecutionDetailVo,
  ExecutionLogVo,
  PageExecutionLogVo,
} from '@/services/WorkflowsTypes';
import { getNodeTypeDef } from '../nodes/nodeTypes';

/** 最小画布：仅 START + END */
const MINIMAL_NODES: Node[] = [
  {
    id: 'start',
    type: 'START',
    data: { label: '开始' },
    position: { x: 100, y: 150 },
  },
  {
    id: 'end',
    type: 'END',
    data: { label: '结束' },
    position: { x: 400, y: 150 },
  },
];

const MINIMAL_EDGES: Edge[] = [
  { id: 'e-start-end', source: 'start', target: 'end', type: 'smoothstep', animated: true },
];

function normalizeNodeType(t: string | undefined): string {
  if (t === 'input') return 'START';
  if (t === 'output') return 'END';
  return t ?? 'default';
}

function parseConfigToNodesEdges(config: object | undefined): { nodes: Node[]; edges: Edge[] } {
  if (!config || typeof config !== 'object') return { nodes: MINIMAL_NODES, edges: MINIMAL_EDGES };
  const c = config as { nodes?: Node[]; edges?: Edge[] };
  if (Array.isArray(c.nodes) && Array.isArray(c.edges)) {
    const nodes = c.nodes.length
      ? c.nodes.map(n => ({
          ...n,
          type: normalizeNodeType(n.type as string | undefined) as string,
        }))
      : MINIMAL_NODES;
    const edges = c.edges.length ? c.edges : MINIMAL_EDGES;
    return { nodes, edges };
  }
  return { nodes: MINIMAL_NODES, edges: MINIMAL_EDGES };
}

/** 生成唯一节点 ID */
let nodeIdSeq = 0;
function generateNodeId(): string {
  nodeIdSeq += 1;
  return `node-${Date.now()}-${nodeIdSeq}`;
}

export type NodeExecutionStatus = 'pending' | 'running' | 'success' | 'failed';

export function useWorkflowEditor(workflowId: string, workflowStatus: string, onClose: () => void) {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(MINIMAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MINIMAL_EDGES);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeExecutions, setNodeExecutions] = useState<Record<string, NodeExecutionStatus>>({});
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<WorkflowExecuteResultVo | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogVo[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [connectEndMenu, setConnectEndMenu] = useState<{ x: number; y: number } | null>(null);

  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const lastInvalidReasonRef = useRef<string | null>(null);
  const connectionMadeRef = useRef(false);

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
        historyRef.current = [{ nodes: n, edges: e }];
        historyIndexRef.current = 0;
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

  const pushHistory = useCallback(() => {
    const snapshot = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
    };
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current -= 1;
    } else {
      historyIndexRef.current = historyRef.current.length - 1;
    }
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      connectionMadeRef.current = true;
      lastInvalidReasonRef.current = null;
      pushHistory();
      setEdges(eds => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds));
      setHasChanges(true);
    },
    [setEdges, pushHistory]
  );

  const isValidConnection = useCallback(
    (params: Connection) => {
      const result = validateConnection(params, nodes, edges);
      if (!result.valid) {
        lastInvalidReasonRef.current = result.reason ?? null;
        return false;
      }
      lastInvalidReasonRef.current = null;
      return true;
    },
    [nodes, edges]
  );

  const handleConnectStart = useCallback(() => {
    connectionMadeRef.current = false;
    lastInvalidReasonRef.current = null;
  }, []);

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number }) => {
      if (connectionMadeRef.current) return;
      const reason = lastInvalidReasonRef.current;
      lastInvalidReasonRef.current = null;
      if (reason) {
        toast.error(reason);
        return;
      }
      // 空白释放：弹出快捷创建节点菜单
      const clientX = 'touches' in event ? event.changedTouches[0]?.clientX : event.clientX;
      const clientY = 'touches' in event ? event.changedTouches[0]?.clientY : event.clientY;
      if (clientX != null && clientY != null) {
        setConnectEndMenu(screenToFlowPosition({ x: clientX, y: clientY }));
      }
    },
    []
  );

  const handleNodeChange = useCallback(
    (changes: unknown) => {
      pushHistory();
      onNodesChange(changes as Parameters<typeof onNodesChange>[0]);
      setHasChanges(true);
    },
    [onNodesChange, pushHistory]
  );

  const handleEdgeChange = useCallback(
    (changes: unknown) => {
      pushHistory();
      onEdgesChange(changes as Parameters<typeof onEdgesChange>[0]);
      setHasChanges(true);
    },
    [onEdgesChange, pushHistory]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // 校验时排除当前边，否则会误判「目标已有连线」
      const otherEdges = edges.filter(e => e.id !== oldEdge.id);
      const result = validateConnection(newConnection, nodes, otherEdges);
      if (!result.valid) {
        toast.error(result.reason ?? '无法重连');
        return;
      }
      pushHistory();
      setEdges(eds => reconnectEdge(oldEdge, newConnection, eds));
      setHasChanges(true);
    },
    [nodes, edges, setEdges, pushHistory]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number }) => {
      e.preventDefault();
      const typeStr = e.dataTransfer.getData('application/reactflow-node-type');
      if (!typeStr) return;
      const def = getNodeTypeDef(typeStr);
      if (!def) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id = generateNodeId();
      const newNode: Node = {
        id,
        type: def.type,
        data: { label: def.label, config: def.defaultConfig ? { ...def.defaultConfig } : {} },
        position,
      };
      setNodes(nds => [...nds, newNode]);
      setHasChanges(true);
    },
    [setNodes]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSelectionChange = useCallback(
    ({ nodes: selNodes }: { nodes: Node[] }) => {
      setSelectedNodeId(selNodes.length === 1 ? selNodes[0]?.id ?? null : null);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!workflowId) return;
    setSaving(true);
    try {
      await Workflows.updateWorkflowConfig(workflowId, {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          data: n.data,
          position: n.position,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
        })),
      });
      toast.success('工作流已保存');
      setHasChanges(false);
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  }, [workflowId, nodes, edges]);

  const handleExecute = useCallback(
    async (inputs?: Record<string, unknown>) => {
      if (!workflowId) return;
      setExecutionLoading(true);
      setNodeExecutions({});
      setExecuteResult(null);
      try {
        const res = await Workflows.executeWorkflow(workflowId, {
          inputs: inputs ?? {},
          mode: 'sync',
        });
        const data = (res as { data?: WorkflowExecuteResultVo }).data;
        if (data) {
          setExecuteResult(data);
          setExecutionId(data.executionId ?? null);
          if (data.executionId) {
            try {
              const detailRes = await Workflows.getExecutionDetail(data.executionId);
              const detail = (detailRes as { data?: ExecutionDetailVo }).data;
              const ne = detail?.nodeExecutions as Record<string, { status?: string }> | undefined;
              if (ne) {
                const statusMap: Record<string, NodeExecutionStatus> = {};
                for (const [nodeId, info] of Object.entries(ne)) {
                  const s = info?.status?.toUpperCase();
                  if (s === 'SUCCESS') statusMap[nodeId] = 'success';
                  else if (s === 'FAILED') statusMap[nodeId] = 'failed';
                  else if (s === 'RUNNING') statusMap[nodeId] = 'running';
                  else statusMap[nodeId] = 'pending';
                }
                setNodeExecutions(statusMap);
              }
            } catch {
              // ignore
            }
          }
          toast.success(data.status === 'COMPLETED' ? '执行成功' : `执行完成: ${data.status}`);
        }
      } catch (e: unknown) {
        toast.error((e as { message?: string })?.message ?? '执行失败');
      } finally {
        setExecutionLoading(false);
      }
    },
    [workflowId]
  );

  const loadExecutionLogs = useCallback(async () => {
    if (!workflowId) return;
    setLogsLoading(true);
    try {
      const res = await Workflows.getExecutionLogs({ workflowId, pageNo: 1, pageSize: 20 });
      const data = (res as { data?: PageExecutionLogVo }).data;
      const list = data?.list ?? [];
      setExecutionLogs(list);
    } catch {
      setExecutionLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, [workflowId]);

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

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const snap = historyRef.current[historyIndexRef.current];
    if (snap) {
      setNodes(snap.nodes);
      setEdges(snap.edges);
      setHasChanges(true);
    }
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snap = historyRef.current[historyIndexRef.current];
    if (snap) {
      setNodes(snap.nodes);
      setEdges(snap.edges);
      setHasChanges(true);
    }
  }, [setNodes, setEdges]);

  const handleAddNodeAt = useCallback(
    (def: { type: string; label: string; defaultConfig?: Record<string, unknown> }, position: { x: number; y: number }) => {
      const id = generateNodeId();
      const newNode: Node = {
        id,
        type: def.type,
        data: { label: def.label, config: def.defaultConfig ? { ...def.defaultConfig } : {} },
        position,
      };
      pushHistory();
      setNodes(nds => [...nds, newNode]);
      setConnectEndMenu(null);
      setHasChanges(true);
    },
    [setNodes, pushHistory]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<Node['data']>) => {
      setNodes(nds =>
        nds.map(n => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n))
      );
      setHasChanges(true);
    },
    [setNodes]
  );

  const nodesWithStatus = nodes.map(n => {
    const status = nodeExecutions[n.id];
    return {
      ...n,
      data: {
        ...n.data,
        executionStatus: status,
      },
    };
  });

  return {
    loading,
    nodes: nodesWithStatus,
    edges,
    onNodesChange: handleNodeChange,
    onEdgesChange: handleEdgeChange,
    onConnect,
    isValidConnection,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onSelectionChange: handleSelectionChange,
    isFullscreen,
    hasChanges,
    saving,
    actionLoading,
    handleSave,
    handleStartStop,
    toggleFullscreen,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode: nodes.find(n => n.id === selectedNodeId) ?? null,
    handleExecute,
    executionLoading,
    executeResult,
    nodeExecutions,
    executionId,
    showExecuteDialog,
    setShowExecuteDialog,
    showLogsPanel,
    setShowLogsPanel,
    executionLogs,
    logsLoading,
    loadExecutionLogs,
    updateNodeData,
    onConnectStart: handleConnectStart,
    onConnectEnd: handleConnectEnd,
    onReconnect,
    connectEndMenu,
    setConnectEndMenu,
    handleAddNodeAt,
    handleUndo,
    handleRedo,
  };
}
