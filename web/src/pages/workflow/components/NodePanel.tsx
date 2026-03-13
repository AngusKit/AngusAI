/**
 * 节点面板 - 按分类展示可拖拽节点
 */
import { useCallback } from 'react';
import { NODE_TYPES, NODE_CATEGORIES, getNodesByCategory, type NodeTypeDef } from '../nodes/nodeTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/components/ui/utils';

interface NodePanelProps {
  className?: string;
  onDragStart?: (nodeType: NodeTypeDef, e: React.DragEvent) => void;
}

export function NodePanel({ className, onDragStart }: NodePanelProps) {
  const byCategory = getNodesByCategory();

  const handleDragStart = useCallback(
    (nodeType: NodeTypeDef) => (e: React.DragEvent) => {
      e.dataTransfer.setData('application/reactflow-node-type', nodeType.type);
      e.dataTransfer.setData('application/json', JSON.stringify({ nodeType, label: nodeType.label }));
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(nodeType, e);
    },
    [onDragStart]
  );

  return (
    <div className={cn('flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900', className)}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold dark:text-white">节点库</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">拖拽到画布添加</p>
      </div>
      <ScrollArea className="flex-1 h-full">
        <div className="p-2 space-y-4">
          {NODE_CATEGORIES.map(({ key, label }) => (
            <div key={key}>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">{label}</div>
              <div className="space-y-1">
                {byCategory[key].map(nodeType => {
                  const Icon = nodeType.icon;
                  return (
                    <div
                      key={nodeType.type}
                      draggable
                      onDragStart={handleDragStart(nodeType)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md cursor-grab active:cursor-grabbing
                        bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
                        border border-gray-200 dark:border-gray-600"
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                        style={{ background: nodeType.color, color: 'white' }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm dark:text-gray-200">{nodeType.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
