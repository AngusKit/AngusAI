/**
 * 节点配置面板 - 选中节点时展示配置表单（内嵌侧边栏，无蒙版）
 */
import { useCallback, useMemo } from 'react';
import type { Node } from 'reactflow';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getNodeTypeDef, hasConfigParams } from '../nodes/nodeTypes';

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNodeData: (nodeId: string, data: Partial<Node['data']>) => void;
}

/** 解析数字，支持 min/max  clamping */
function parseNumber(v: string, min?: number, max?: number): number {
  const n = Number(v);
  if (Number.isNaN(n)) return min ?? 0;
  if (min != null && n < min) return min;
  if (max != null && n > max) return max;
  return n;
}

type ConfigFieldItem = {
  key: string;
  label: string;
  type: 'string' | 'number' | 'textarea' | 'json' | 'select' | 'array';
  required?: boolean;
  placeholder?: string;
  description?: string;
  enum?: readonly { value: string; label: string }[] | { value: string; label: string }[];
  min?: number;
  max?: number;
};

/** 根据 configParams 或 defaultConfig 生成表单 */
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
  const params = def?.configParams;
  // 有 configParams 用 configParams，否则用 defaultConfig 的 key 推导（兼容旧节点）
  const items: ConfigFieldItem[] = params?.length
    ? (params as ConfigFieldItem[])
    : def?.defaultConfig
      ? Object.keys(def.defaultConfig).map(k => ({
          key: k,
          label: k,
          type: 'string' as const,
          required: false,
          placeholder: `输入 ${k}`,
          description: undefined,
          enum: undefined,
          min: undefined,
          max: undefined,
        }))
      : [];
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map(p => {
        const key = p.key;
        const val = config[key];
        const isSelect = p.type === 'select' && p.enum?.length;
        const isTextarea =
          p.type === 'textarea' || ['prompt', 'script', 'message', 'body'].includes(key);
        const isJson =
          p.type === 'json' ||
          (typeof val === 'object' && val !== null && !Array.isArray(val));
        const isNumber = p.type === 'number' || typeof def?.defaultConfig?.[key] === 'number';
        const required = p.required ?? false;
        const isEmpty =
          val === undefined ||
          val === '' ||
          (typeof val === 'object' && val !== null && Object.keys(val).length === 0);
        const showRequiredError = required && isEmpty;

        return (
          <div key={key}>
            <Label className="text-sm">
              {p.label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {p.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.description}</p>
            )}
            {isSelect ? (
              <Select
                value={String(val ?? p.enum?.[0]?.value ?? '')}
                onValueChange={v => onChange(key, v)}
              >
                <SelectTrigger className={`mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${showRequiredError ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={p.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {p.enum?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : isTextarea ? (
              <Textarea
                className={`mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${showRequiredError ? 'border-red-500' : ''}`}
                value={typeof val === 'string' ? val : ''}
                onChange={e => onChange(key, e.target.value)}
                rows={4}
                placeholder={p.placeholder}
              />
            ) : isJson ? (
              <Input
                className={`mt-1 font-mono text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white ${showRequiredError ? 'border-red-500' : ''}`}
                value={
                  typeof val === 'string' ? val : JSON.stringify(val ?? {}, null, 2)
                }
                onChange={e => {
                  const raw = e.target.value;
                  try {
                    onChange(key, raw ? JSON.parse(raw) : {});
                  } catch {
                    onChange(key, raw);
                  }
                }}
                placeholder={p.placeholder}
              />
            ) : isNumber ? (
              <Input
                type="number"
                className={`mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${showRequiredError ? 'border-red-500' : ''}`}
                value={val !== undefined && val !== '' ? String(val) : ''}
                onChange={e => {
                  const v = e.target.value;
                  const n = parseNumber(v, p.min, p.max);
                  onChange(key, v === '' ? '' : n);
                }}
                placeholder={p.placeholder}
                min={p.min}
                max={p.max}
              />
            ) : (
              <Input
                className={`mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${showRequiredError ? 'border-red-500' : ''}`}
                value={String(val ?? '')}
                onChange={e => onChange(key, e.target.value)}
                placeholder={p.placeholder}
              />
            )}
            {showRequiredError && (
              <p className="text-xs text-red-500 mt-0.5">此项为必填</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function NodeConfigPanel({ node, onClose, onUpdateNodeData }: NodeConfigPanelProps) {
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
  const showConfigSection = hasConfigParams(node.type as string);

  return (
    <div
      className="w-80 shrink-0 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      role="complementary"
      aria-label="节点配置"
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h3 className="text-sm font-semibold dark:text-white flex items-center gap-2">
          {def?.icon && (
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: def.color, color: 'white' }}
            >
              <def.icon className="w-3 h-3" />
            </div>
          )}
          节点配置
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-4">
          <div>
            <Label className="text-sm">节点名称</Label>
            <Input
              className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={label}
              onChange={e => handleLabelChange(e.target.value)}
              placeholder="节点名称"
            />
          </div>
          {showConfigSection && (
            <div>
              <Label className="text-sm">配置参数</Label>
              <div className="mt-2">
                <ConfigFields
                  config={config}
                  onChange={handleChange}
                  nodeType={node.type as string}
                />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
