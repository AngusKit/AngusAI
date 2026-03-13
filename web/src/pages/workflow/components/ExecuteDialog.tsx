/**
 * 执行工作流对话框 - 输入变量表单
 */
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ExecuteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: (inputs?: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

export function ExecuteDialog({ open, onOpenChange, onExecute, loading }: ExecuteDialogProps) {
  const [inputsJson, setInputsJson] = useState('{\n  \n}');

  const handleExecute = useCallback(async () => {
    let inputs: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(inputsJson || '{}');
      if (parsed && typeof parsed === 'object') {
        inputs = parsed;
      }
    } catch {
      // 无效 JSON 时使用空对象
    }
    await onExecute(inputs);
    onOpenChange(false);
  }, [inputsJson, onExecute, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[600px]">
        <DialogHeader>
          <DialogTitle>执行工作流</DialogTitle>
          <DialogDescription>输入工作流所需的变量（JSON 格式），如 {"{ \"key\": \"value\" }"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>输入变量 (JSON)</Label>
          <Textarea
            value={inputsJson}
            onChange={e => setInputsJson(e.target.value)}
            rows={8}
            className="font-mono text-sm"
            placeholder='{\n  "param1": "value1",\n  "param2": 123\n}'
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleExecute} disabled={loading}>
            {loading ? '执行中...' : '执行'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
