import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { ICON_OPTIONS } from '../constants';

interface EmojiIconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

/**
 * 应用图标选择器：待选 emoji 网格 + 已选择图标（可编辑）
 */
export function EmojiIconSelector({ value, onChange }: EmojiIconSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map(opt => (
          <Tooltip key={opt.emoji}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onChange(opt.emoji)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  value === opt.emoji
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {opt.emoji}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{opt.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">已选择图标</span>
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="输入或选择 emoji"
          className="w-20 h-10 text-xl text-center"
        />
      </div>
    </div>
  );
}
