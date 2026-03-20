import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import type { SessionConfig } from '@/services/SessionTypes';
import {
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_MAX_TOKENS,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_TEMPERATURE,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_TOP_P,
  TIMEOUT_OPTIONS,
} from '../constants.ts';
import { useState } from 'react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SessionConfig;
  onSettingsChange: (settings: SessionConfig) => void;
  /** 保存到后端，返回是否成功 */
  onSave?: (settings: SessionConfig) => Promise<boolean>;
}

export function SettingsDialog({ open, onOpenChange, settings, onSettingsChange, onSave }: SettingsDialogProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        const ok = await onSave(settings);
        if (ok) {
          onOpenChange(false);
          toast.success('设置已保存');
        }
      } finally {
        setSaving(false);
      }
    } else {
      onOpenChange(false);
      toast.success('设置已保存');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>对话设置</DialogTitle>
          <DialogDescription className='dark:text-gray-400'>调整AI对话的参数配置</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4 [&_label]:dark:text-gray-100'>
          {/* Temperature */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>温度 (Temperature)</Label>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{settings.temperature}</span>
            </div>
            <Slider
              value={[settings.temperature ?? DEFAULT_TEMPERATURE]}
              onValueChange={([value]) => onSettingsChange({ ...settings, temperature: value ?? settings.temperature ?? DEFAULT_TEMPERATURE })}
              min={0}
              max={2}
              step={0.1}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              控制输出的随机性。较高的值使输出更随机，较低的值使输出更集中和确定。
            </p>
          </div>

          {/* Max Tokens */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>最大令牌数 (Max Tokens)</Label>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{settings.maxTokens}</span>
            </div>
            <Slider
              value={[settings.maxTokens ?? DEFAULT_MAX_TOKENS]}
              onValueChange={([value]) => onSettingsChange({ ...settings, maxTokens: value ?? settings.maxTokens ?? DEFAULT_MAX_TOKENS })}
              min={100}
              max={128000}
              step={100}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>限制生成响应的最大长度。</p>
          </div>

          {/* Top P */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Top P</Label>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{settings.topP}</span>
            </div>
            <Slider
              value={[settings.topP ?? DEFAULT_TOP_P]}
              onValueChange={([value]) => onSettingsChange({ ...settings, topP: value ?? settings.topP ?? DEFAULT_TOP_P })}
              min={0}
              max={1}
              step={0.05}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>核心采样：考虑累积概率为 top_p 的标记结果。</p>
          </div>

          {/* Frequency Penalty */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>频率惩罚 (Frequency Penalty)</Label>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{settings.frequencyPenalty}</span>
            </div>
            <Slider
              value={[settings.frequencyPenalty ?? DEFAULT_FREQUENCY_PENALTY]}
              onValueChange={([value]) => onSettingsChange({ ...settings, frequencyPenalty: value ?? settings.frequencyPenalty ?? DEFAULT_FREQUENCY_PENALTY })}
              min={0}
              max={2}
              step={0.1}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>降低模型重复相同内容的可能性。</p>
          </div>

          {/* Presence Penalty */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>存在惩罚 (Presence Penalty)</Label>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{settings.presencePenalty}</span>
            </div>
            <Slider
              value={[settings.presencePenalty ?? DEFAULT_PRESENCE_PENALTY]}
              onValueChange={([value]) => onSettingsChange({ ...settings, presencePenalty: value ?? settings.presencePenalty ?? DEFAULT_PRESENCE_PENALTY })}
              min={0}
              max={2}
              step={0.1}
              className='w-full'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>增加模型谈论新话题的可能性。</p>
          </div>

          {/* Timeout */}
          <div className='space-y-2'>
            <Label>请求超时 (Timeout)</Label>
            <Select
              value={String(settings.timeoutMs ?? DEFAULT_TIMEOUT_MS)}
              onValueChange={(v) => onSettingsChange({ ...settings, timeoutMs: Number(v) })}
            >
              <SelectTrigger className='dark:border-gray-600 dark:bg-gray-900/50'>
                <SelectValue placeholder='默认 5 分钟' />
              </SelectTrigger>
              <SelectContent>
                {TIMEOUT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-xs text-gray-500 dark:text-gray-400'>模型请求超时时间，优先级高于模型默认配置。</p>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className='dark:border-gray-600 dark:bg-gray-900/40 dark:hover:bg-gray-700/70 dark:hover:text-gray-100'
          >
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
