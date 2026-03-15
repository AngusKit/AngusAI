import { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Send, Paperclip, Mic, StopCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { AttachmentPreview } from './AttachmentPreview.tsx';
import { cn } from '@/components/ui/utils.ts';
import type { ThemeTemplate } from './ThemeDialog.tsx';

export interface ChatInputBarHandle {
  insertText: (text: string) => void;
  focus: () => void;
}

export interface ChatInputBarProps {
  initialContent?: string;
  onSend: (content: string, attachments: File[]) => void;
  isSending?: boolean;
  enableFileUpload?: boolean;
  enableImageInput?: boolean;
  enableVoiceInput?: boolean;
  selectedTemplateObj?: ThemeTemplate;
  onVoiceRecord?: () => void;
  isRecording?: boolean;
  /** 供父组件传入 file input ref，用于外部触发选择 */
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  /** IME 检测 ref：composition 期间为 true */
  isComposingRef?: React.MutableRefObject<boolean>;
  /** IME compositionend 时间戳，用于 120ms 兜底 */
  lastCompositionEndRef?: React.MutableRefObject<number>;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
}

export const ChatInputBar = forwardRef<ChatInputBarHandle, ChatInputBarProps>(function ChatInputBar(
  {
    initialContent = '',
    onSend,
    isSending = false,
    enableFileUpload = true,
    enableImageInput = false,
    enableVoiceInput = true,
    selectedTemplateObj,
    onVoiceRecord,
    isRecording = false,
    fileInputRef: externalFileInputRef,
    isComposingRef,
    lastCompositionEndRef,
    onCompositionStart,
    onCompositionEnd,
  },
  ref
) {
  const [input, setInput] = useState(initialContent);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = externalFileInputRef ?? internalFileInputRef;

  // 外部注入的 initialContent 变化时同步（如从分享链接进入）
  useEffect(() => {
    if (initialContent) setInput(initialContent);
  }, [initialContent]);

  useImperativeHandle(
    ref,
    () => ({
      insertText(text: string) {
        setInput((prev) => prev + text);
        queueMicrotask(() => textareaRef.current?.focus());
      },
      focus() {
        textareaRef.current?.focus();
      },
    }),
    []
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = '';
    if (files.length > 0) toast.success(`已添加 ${files.length} 个附件`);
  }, []);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = useCallback(() => {
    const content = input.trim();
    if (!content && attachments.length === 0) return;
    onSend(content, [...attachments]);
    setInput('');
    setAttachments([]);
  }, [input, attachments, onSend]);

  const canSend = (input.trim().length > 0 || attachments.length > 0) && !isSending;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (e.nativeEvent.isComposing || isComposingRef?.current) return;
        if (lastCompositionEndRef && Date.now() - lastCompositionEndRef.current < 120) return;
        const el = textareaRef.current;
        if (el && typeof el.selectionStart === 'number' && el.selectionStart !== el.selectionEnd) return;
        e.preventDefault();
        handleSend();
        return;
      }
    },
    [handleSend, isComposingRef, lastCompositionEndRef]
  );

  return (
    <div className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4'>
      <div className='max-w-4xl mx-auto'>
        {attachments.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-2'>
            {attachments.map((file, index) => (
              <AttachmentPreview key={index} file={file} onRemove={() => removeAttachment(index)} />
            ))}
          </div>
        )}

        <div className='flex-1 relative'>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder='输入消息... (Shift + Enter 换行)'
            className='min-h-[80px] max-h-[240px] resize-none pr-32 py-4 px-4 dark:bg-gray-800 dark:border-gray-700 scrollbar-hide'
            rows={1}
          />
          <div className='absolute right-3 bottom-3 flex items-center gap-1'>
            <input ref={fileInputRef} type='file' multiple className='hidden' onChange={handleFileSelect} />
            {enableFileUpload && (
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9'
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '*';
                    fileInputRef.current.click();
                  }
                }}
                title='上传文件'
              >
                <Paperclip className='w-4 h-4' />
              </Button>
            )}
            {enableImageInput && (
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9'
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                    fileInputRef.current.click();
                  }
                }}
                title='上传图片'
              >
                <ImageIcon className='w-4 h-4' />
              </Button>
            )}
            {enableVoiceInput && onVoiceRecord && (
              <Button variant='ghost' size='icon' className='h-9 w-9' onClick={onVoiceRecord}>
                {isRecording ? <StopCircle className='w-4 h-4 text-red-500' /> : <Mic className='w-4 h-4' />}
              </Button>
            )}
            <Button
              size='icon'
              onClick={handleSend}
              disabled={!canSend}
              className={cn('h-9 w-9', selectedTemplateObj?.primaryColor ?? 'bg-blue-500', 'text-white')}
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
