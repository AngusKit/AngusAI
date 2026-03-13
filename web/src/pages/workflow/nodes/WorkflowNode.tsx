/**
 * 工作流节点基础组件
 * 支持单/多 Handle、执行状态高亮
 */
import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { getNodeTypeDef } from './nodeTypes';
import { cn } from '@/components/ui/utils';

type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed';

interface WorkflowNodeData {
  label?: string;
  config?: Record<string, unknown>;
  executionStatus?: ExecutionStatus;
  executionError?: string;
}

function WorkflowNodeComponent({ data, selected, type }: NodeProps<WorkflowNodeData>) {
  const nodeType = type ?? (data as { nodeType?: string })?.nodeType ?? 'default';
  const def = getNodeTypeDef(nodeType);
  const status = (data as WorkflowNodeData).executionStatus;
  const label = (data as WorkflowNodeData).label ?? def?.label ?? nodeType;

  const baseStyle = def
    ? {
        background: def.color,
        color: 'white',
        border: `2px solid ${def.borderColor}`,
        borderRadius: '8px',
        padding: '10px 16px',
        minWidth: 120,
      }
    : {};

  const statusClass = {
    pending: '',
    running: 'animate-pulse ring-2 ring-blue-400',
    success: 'ring-2 ring-green-500',
    failed: 'ring-2 ring-red-500',
  }[status ?? 'pending'];

  const hasInput = def?.inputHandles !== undefined;
  const hasOutput = def?.outputHandles !== undefined;
  const inputHandles = hasInput ? def.inputHandles! : [{ id: 'input', label: '输入', position: 'left' as const }];
  const outputHandles = hasOutput ? def.outputHandles! : [{ id: 'output', label: '输出', position: 'right' as const }];

  return (
    <div
      className={cn(
        'rounded-lg shadow-md transition-all',
        selected && 'ring-2 ring-primary',
        statusClass
      )}
      style={baseStyle}
    >
      {inputHandles.map(h => (
        <Handle
          key={h.id}
          type="target"
          id={h.id}
          position={Position.Left}
          className="!w-3 !h-3 !border-2 !bg-white"
        />
      ))}
      <div className="text-sm font-medium flex items-center gap-2">
        {def?.icon && <def.icon className="w-4 h-4 shrink-0" />}
        <span className="truncate">{label}</span>
      </div>
      {outputHandles.map(h => (
        <Handle
          key={h.id}
          type="source"
          id={h.id}
          position={Position.Right}
          className="!w-3 !h-3 !border-2 !bg-white"
        />
      ))}
    </div>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
