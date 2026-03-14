/**
 * 工作流连线连接规则校验
 * 参考《工作流设计器节点连线设计》第二节：连接规则
 */
import type { Connection, Node, Edge } from 'reactflow';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * 校验连接是否合法，并返回失败原因（用于 Toast 提示）
 */
export function validateConnection(
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): ValidationResult {
  const { source, target, sourceHandle, targetHandle } = connection;

  if (!source || !target) return { valid: false, reason: '连接不完整' };

  // 1. 禁止自环：节点不能连接自己
  if (source === target) return { valid: false, reason: '不能连接到自己' };

  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);

  if (!sourceNode || !targetNode) return { valid: false, reason: '节点不存在' };

  // 2. 节点类型约束：START 不能有入边
  if ((targetNode.type as string) === 'START') return { valid: false, reason: '开始节点不能有入边' };

  // 3. 节点类型约束：END 不能有出边
  if ((sourceNode.type as string) === 'END') return { valid: false, reason: '结束节点不能有出边' };

  // 4. 禁止重复连线：两个端口之间只能有一条线
  const isDuplicate = edges.some(
    e =>
      e.source === source &&
      e.target === target &&
      (e.sourceHandle ?? null) === (sourceHandle ?? null) &&
      (e.targetHandle ?? null) === (targetHandle ?? null)
  );
  if (isDuplicate) return { valid: false, reason: '两个端口之间已存在连线' };

  // 5. 容量限制：输入端口通常只接受 1 条连入
  const targetHandleAlreadyConnected = edges.some(
    e => e.target === target && (e.targetHandle ?? null) === (targetHandle ?? null)
  );
  if (targetHandleAlreadyConnected) return { valid: false, reason: '该输入端口已有连线' };

  // 6. 环路检测：DAG 场景不允许形成闭环
  if (wouldCreateCycle(source, target, edges)) return { valid: false, reason: '不允许形成环路' };

  return { valid: true };
}

/** 兼容旧 API：仅返回 boolean */
export function isValidConnection(
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean {
  return validateConnection(connection, nodes, edges).valid;
}

/** BFS 检测：从 start 出发能否到达 end（沿有向边） */
function canReach(start: string, end: string, edges: Edge[]): boolean {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    const list = adj.get(e.source) ?? [];
    list.push(e.target);
    adj.set(e.source, list);
  }
  const visited = new Set<string>();
  const queue = [start];
  while (queue.length > 0) {
    const u = queue.shift()!;
    if (u === end) return true;
    if (visited.has(u)) continue;
    visited.add(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) queue.push(v);
    }
  }
  return false;
}

/** 添加 source→target 是否会形成环路 */
function wouldCreateCycle(source: string, target: string, edges: Edge[]): boolean {
  return canReach(target, source, edges);
}
