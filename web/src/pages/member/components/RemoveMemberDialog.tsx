import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string | null;
  memberName: string;
  deleting: boolean;
  onConfirm: () => Promise<void>;
}

/**
 * 移除成员对话框 - 确认删除用户账号
 * 参考 AngusGit RemoveMemberDialog，需输入成员姓名以确认
 */
export function RemoveMemberDialog({
  open,
  onOpenChange,
  memberId,
  memberName,
  deleting,
  onConfirm,
}: RemoveMemberDialogProps) {
  const [confirmName, setConfirmName] = useState('');
  const isNameMatched = confirmName.trim() === memberName;

  useEffect(() => {
    if (open) setConfirmName('');
  }, [open, memberName]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>移除成员</AlertDialogTitle>
          <AlertDialogDescription>
            移除成员将删除该用户账号，此操作不可恢复。请输入成员姓名以确认。
          </AlertDialogDescription>
        </AlertDialogHeader>
        {memberId && (
          <div className='mt-3 space-y-2'>
            <Label>请输入成员姓名以确认</Label>
            <Input
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              placeholder={memberName}
              className='border-red-200 dark:border-red-800'
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deleting || !isNameMatched}
            className='bg-red-600 hover:bg-red-700 text-white'
          >
            {deleting && <Loader2 className='size-4 mr-2 animate-spin' />}
            移除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
