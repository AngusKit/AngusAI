import { X, File, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';
import { Button } from '@/ui/button';
import { cn } from '@/ui/utils';

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

export function AttachmentPreview({ file, onRemove }: AttachmentPreviewProps) {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  const getFileColor = () => {
    if (file.type.startsWith('image/')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (file.type.startsWith('video/')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    if (file.type.startsWith('audio/')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (file.type.includes('pdf')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  };

  const FileIcon = getFileIcon();
  const isImage = file.type.startsWith('image/');
  const fileUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg">
        {isImage && fileUrl ? (
          <img
            src={fileUrl}
            alt={file.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className={cn('w-12 h-12 rounded flex items-center justify-center', getFileColor())}>
            <FileIcon className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm dark:text-white truncate max-w-[150px]">{file.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
