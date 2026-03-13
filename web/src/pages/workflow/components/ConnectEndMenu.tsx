/**
 * 连线拖拽到空白区域释放时的快捷创建节点菜单
 * 参考《工作流设计器节点连线设计》4.2 空白释放
 */
import { useCallback } from 'react';
import { getNodesByCategory, NODE_CATEGORIES, type NodeTypeDef } from '../nodes/nodeTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';

interface ConnectEndMenuProps {
  /** 菜单位置（flow 坐标系） */
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSelect: (nodeType: NodeTypeDef, position: { x: number; y: number }) => void;
  /** flow 坐标转屏幕坐标，用于定位弹窗 */
  flowToScreenPosition?: (pos: { x: number; y: number }) => { x: number; y: number };
}

export function ConnectEndMenu({ position, onClose, onSelect, flowToScreenPosition }: ConnectEndMenuProps) {
  const byCategory = getNodesByCategory();

  const handleSelect = useCallback(
    (def: NodeTypeDef) => {
      if (position) {
        onSelect(def, position);
        onClose();
      }
    },
    [position, onSelect, onClose]
  );

  if (!position) return null;

  const screenPos = flowToScreenPosition ? flowToScreenPosition(position) : position;

  return (
    <DropdownMenu open={!!position} onOpenChange={open => !open && onClose()}>
      <DropdownMenuTrigger asChild>
        <div
          className='absolute w-1 h-1 invisible'
          style={{
            left: screenPos.x,
            top: screenPos.y,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='w-56 max-h-80 overflow-y-auto dark:bg-gray-800 dark:border-gray-700'
      >
        <DropdownMenuLabel className='text-xs text-gray-500 dark:text-gray-400'>
          在此创建节点
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NODE_CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <div className='px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400'>
              {label}
            </div>
            {byCategory[key].map(nodeType => {
              const Icon = nodeType.icon;
              return (
                <DropdownMenuItem
                  key={nodeType.type}
                  onClick={() => handleSelect(nodeType)}
                  className='gap-2 cursor-pointer'
                >
                  <div
                    className={cn('w-6 h-6 rounded flex items-center justify-center shrink-0')}
                    style={{ background: nodeType.color, color: 'white' }}
                  >
                    <Icon className='w-3 h-3' />
                  </div>
                  <span>{nodeType.label}</span>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
