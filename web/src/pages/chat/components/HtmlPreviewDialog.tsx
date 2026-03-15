import { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';

interface HtmlPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  title?: string;
}

/**
 * 在沙箱 iframe 中预览 HTML 内容，不执行脚本以保证安全
 */
export function HtmlPreviewDialog({
  open,
  onOpenChange,
  html,
  title = 'HTML 预览',
}: HtmlPreviewDialogProps) {
  const url = useMemo(() => {
    if (!open || !html) return '';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [open, html]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style>{`[data-html-preview] { width: 90vw !important; height: 90vh !important; max-width: 90vw !important; max-height: 90vh !important; }`}</style>
      <DialogContent
        data-html-preview
        className="p-0 overflow-hidden border-0 !w-[90vw] !max-w-[90vw] sm:!max-w-[90vw] !h-[90vh] !min-h-[90vh] flex flex-col"
        style={{
          width: '90vw',
          maxWidth: '90vw',
          height: '90vh',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <DialogHeader className="flex flex-row items-center px-6 py-3 shrink-0">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <iframe
            src={url}
            title={title}
            className="flex-1 w-full min-h-0 border-0 rounded-b-lg"
            style={{ flex: 1, minHeight: 0 }}
            sandbox="allow-same-origin"
            referrerPolicy="no-referrer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
