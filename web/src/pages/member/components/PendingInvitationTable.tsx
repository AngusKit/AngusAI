import { Mail, Send, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { XcanPagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import type { PendingInvitation } from '../types';
import { DEFAULT_PAGE_SIZE } from '@/Constants';

interface PendingInvitationTableProps {
  /** 是否正在加载 */
  loading: boolean;
  /** 邀请列表 */
  invitations: PendingInvitation[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  currentPage: number;
  /** 页码变更回调 */
  onPageChange: (pageNo: number) => void;
  /** 重新发送邀请回调 */
  onResend: (invitation: PendingInvitation) => void;
  /** 取消邀请回调 */
  onCancel: (invitation: PendingInvitation) => void;
}

/** 待处理邀请表格：加载态、空态、数据表格、分页 */
export function PendingInvitationTable({
  loading,
  invitations,
  total,
  currentPage,
  onPageChange,
  onResend,
  onCancel,
}: PendingInvitationTableProps) {
  if (loading) {
    return (
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邮箱</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请人</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请日期</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>过期日期</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-40 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-16 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-24 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-24 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-24 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-8 rounded dark:bg-gray-700' />
                      <Skeleton className='h-8 w-8 rounded dark:bg-gray-700' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-12 text-center'>
          <Mail className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg mb-2 dark:text-white'>无待处理邀请</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>所有邀请已被接受或过期</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邮箱</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请人</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请日期</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>过期日期</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {invitations.map(invitation => (
              <tr key={invitation.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                <td className='px-6 py-4 text-sm dark:text-white'>{invitation.email}</td>
                <td className='px-6 py-4 text-sm dark:text-gray-300'>{invitation.roleName}</td>
                <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                  {invitation.invitedBy}
                </td>
                <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                  {invitation.invitedDate}
                </td>
                <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                  {invitation.expiresDate}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => onResend(invitation)}
                      className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                      title='重新发送'
                    >
                      <Send className='w-4 h-4 text-blue-500' />
                    </button>
                    <button
                      onClick={() => onCancel(invitation)}
                      className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                      title='取消邀请'
                    >
                      <XCircle className='w-4 h-4 text-red-500' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > DEFAULT_PAGE_SIZE && (
        <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
          <XcanPagination
            pageSize={DEFAULT_PAGE_SIZE}
            pageNo={currentPage}
            total={total}
            onChange={({ pageNo }) => onPageChange(pageNo)}
          />
        </div>
      )}
    </Card>
  );
}
