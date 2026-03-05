import { Loader2, Send, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RoleListVo } from '@/services/RoleTypes';

interface InviteMemberDialogProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 关闭弹窗回调 */
  onOpenChange: (open: boolean) => void;
  /** 输入的邮箱 */
  inviteEmail: string;
  /** 邮箱变更回调 */
  onEmailChange: (value: string) => void;
  /** 选中的角色 ID */
  inviteRoleId: string;
  /** 角色变更回调 */
  onRoleIdChange: (value: string) => void;
  /** 可选角色列表 */
  inviteRoles: RoleListVo[];
  /** 是否正在发送 */
  sending: boolean;
  /** 发送邀请回调 */
  onInvite: () => Promise<void>;
}

/** 邀请成员弹窗：输入邮箱、选择角色，发送邀请 */
export function InviteMemberDialog({
  open,
  onOpenChange,
  inviteEmail,
  onEmailChange,
  inviteRoleId,
  onRoleIdChange,
  inviteRoles,
  sending,
  onInvite,
}: InviteMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>邀请团队成员</DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            通过邮箱邀请新成员加入团队
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='invite-email' className='dark:text-gray-300'>邮箱地址 *</Label>
            <Input
              id='invite-email'
              type='email'
              placeholder='member@example.com'
              value={inviteEmail}
              onChange={e => onEmailChange(e.target.value)}
              className='dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='invite-role' className='dark:text-gray-300'>分配角色（可选）</Label>
            <Select value={inviteRoleId} onValueChange={onRoleIdChange}>
              <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                <SelectValue placeholder='不指定角色' />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                <SelectItem value='__none__'>不指定角色</SelectItem>
                {inviteRoles.filter(r => r?.id).map(r => (
                  <SelectItem key={r.id!} value={r.id!}>
                    {r.name ?? r.code ?? '-'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
            <div className='flex gap-2'>
              <AlertCircle className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
              <div className='text-xs text-blue-600 dark:text-blue-400'>
                邀请链接将在7天后过期，受邀者需要在过期前接受邀请。
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
          >
            取消
          </Button>
          <Button onClick={onInvite} disabled={sending} className='bg-blue-500 hover:bg-blue-600'>
            {sending ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <Send className='w-4 h-4 mr-2' />}
            发送邀请
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
