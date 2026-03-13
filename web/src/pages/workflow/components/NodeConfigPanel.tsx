/**
 * 节点配置面板 - 选中节点时展示配置表单
 */
import { useCallback, useMemo } from 'react';
import type { Node } from 'reactflow';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNodeTypeDef } from '../nodes/nodeTypes';
import { cn } from '@/components/ui/utils';

interface NodeConfigPanelProps {
  node: Node | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateNodeData: (nodeId: string, data: Partial<Node['data']>) => void;
}

/** 根据 config 生成简单表单 */
function ConfigFields({
  config,
  onChange,
  nodeType,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  nodeType: string;
}) {
  const def = getNodeTypeDef(nodeType);
  if (!def?.defaultConfig) return null;

  const keys = Object.keys(def.defaultConfig);
  if (keys.length === 0) return <p className="text-sm text-gray-500">此节点无需配置</p>;

  return (
    <div className="space-y-3">
      {keys.map(key => {
        const val = config[key];
        const isObject = typeof val === 'object' && val !== null && !Array.isArray(val);
        const isMultiline = key === 'prompt' || key === 'script' || key === 'message';

        return (
          <div key={key}>
            <Label className="text-sm capitalize">{key}</Label>
            {isMultiline ? (
              <Textarea
                className="mt-1"
                value={typeof val === 'string' ? val : ''}
                onChange={e => onChange(key, e.target.value)}
                rows={4}
                placeholder={`输入 ${key}`}
              />
            ) : isObject ? (
              <Input
                className="mt-1"
                value={JSON.stringify(val)}
                onChange={e => {
                  try {
                    onChange(key, JSON.parse(e.target.value || '{}'));
                  } catch {
                    onChange(key, e.target.value);
                  }
                }}
                placeholder="{}"
              />
            ) : (
              <Input
                className="mt-1"
                value={String(val ?? '')}
                onChange={e => {
                  const v = e.target.value;
                  if (typeof def.defaultConfig![key] === 'number') {
                    onChange(key, v ? Number(v) : 0);
                  } else {
                    onChange(key, v);
                  }
                }}
                placeholder={`输入 ${key}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function NodeConfigPanel({ node, open, onOpenChange, onUpdateNodeData }: NodeConfigPanelProps) {
  const def = node ? getNodeTypeDef(node.type as string) : null;
  const config = useMemo(() => {
    const c = (node?.data as { config?: Record<string, unknown> })?.config;
    return (c && typeof c === 'object' ? { ...c } : {}) as Record<string, unknown>;
  }, [node?.data]);

  const handleChange = useCallback(
    (key: string, value: unknown) => {
      if (!node) return;
      const newConfig = { ...config, [key]: value };
      onUpdateNodeData(node.id, { config: newConfig });
    },
    [node, config, onUpdateNodeData]
  );

  const handleLabelChange = useCallback(
    (label: string) => {
      if (!node) return;
      onUpdateNodeData(node.id, { label });
    },
    [node, onUpdateNodeData]
  );

  if (!node) return null;

  const label = (node.data as { label?: string })?.label ?? def?.label ?? node.type;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {def?.icon && (
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ background: def.color, color: 'white' }}
              >
                <def.icon className="w-4 h-4" />
              </div>
            )}
            节点配置
          </SheetTitle>
          <SheetDescription>{def?.description ?? node.type}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label>节点名称</Label>
              <Input
                className="mt-1"
                value={label}
                onChange={e => handleLabelChange(e.target.value)}
                placeholder="节点名称"
              />
            </div>
            <div>
              <Label>配置参数</Label>
              <div className="mt-2">
                <ConfigFields config={config} onChange={handleChange} nodeType={node.type as string} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
