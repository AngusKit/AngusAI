import { Palette, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { toast } from 'sonner';

export type TemplateType = 'modern-blue' | 'minimal-gray' | 'elegant-purple' | 'warm-orange';

export interface ThemeTemplate {
  id: TemplateType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  hoverColor: string;
}

export const CHAT_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'modern-blue',
    name: '现代蓝',
    description: '专业清新的蓝色主题',
    primaryColor: 'bg-blue-500',
    secondaryColor: 'bg-blue-50 dark:bg-blue-900/20',
    accentColor: 'border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
  },
  {
    id: 'minimal-gray',
    name: '简约灰',
    description: '简洁优雅的灰色主题',
    primaryColor: 'bg-gray-700',
    secondaryColor: 'bg-gray-50 dark:bg-gray-800',
    accentColor: 'border-gray-200 dark:border-gray-700',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-750',
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    description: '高雅精致的紫色主题',
    primaryColor: 'bg-purple-500',
    secondaryColor: 'bg-purple-50 dark:bg-purple-900/20',
    accentColor: 'border-purple-200 dark:border-purple-800',
    hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
  },
  {
    id: 'warm-orange',
    name: '温暖橙',
    description: '活力温馨的橙色主题',
    primaryColor: 'bg-orange-500',
    secondaryColor: 'bg-orange-50 dark:bg-orange-900/20',
    accentColor: 'border-orange-200 dark:border-orange-800',
    hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
  },
];

interface ThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: TemplateType;
  onTemplateChange: (id: TemplateType) => void;
}

export function ThemeDialog({ open, onOpenChange, selectedTemplate, onTemplateChange }: ThemeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Palette className='w-5 h-5' />
            外观主题设置
          </DialogTitle>
          <DialogDescription>选择你喜欢的对话界面外观主题</DialogDescription>
        </DialogHeader>

        <div className='space-y-2 py-2'>
          {CHAT_TEMPLATES.map(template => (
            <div
              key={template.id}
              onClick={() => {
                onTemplateChange(template.id);
                toast.success(`已切换到${template.name}主题`);
              }}
              className={cn(
                'p-3 border-2 rounded-lg cursor-pointer transition-all',
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              )}
            >
              <div className='flex items-center justify-between mb-2'>
                <div>
                  <div className='dark:text-white'>{template.name}</div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{template.description}</div>
                </div>
                {selectedTemplate === template.id && <Check className='w-4 h-4 text-blue-500' />}
              </div>
              <div className='flex gap-1.5'>
                <div
                  className={cn('w-8 h-8 rounded border-2 border-white dark:border-gray-900', template.primaryColor)}
                ></div>
                <div className={cn('w-8 h-8 rounded border', template.secondaryColor, template.accentColor)}></div>
                <div className={cn('w-8 h-8 rounded border', template.secondaryColor, template.accentColor)}></div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
