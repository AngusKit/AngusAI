import {
  Users,
  MoreHorizontal,
  Trash2,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { XcanPagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { RoleNamesDisplay } from './RoleNamesDisplay';
import type { TeamMember } from '../types';
import { getStatusBadge } from '../utils';
import { DEFAULT_PAGE_SIZE } from '@/Constants';

interface MemberTableProps {
  /** 是否正在加载 */
  loading: boolean;
  /** 成员列表 */
  members: TeamMember[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  currentPage: number;
  /** 页码变更回调 */
  onPageChange: (pageNo: number) => void;
  /** 暂停成员回调 */
  onPause: (member: TeamMember) => void;
  /** 恢复成员回调 */
  onResume: (member: TeamMember) => void;
  /** 打开移除弹窗回调 */
  onRemove: (member: TeamMember) => void;
}

/** 成员列表表格：加载态、空态、数据表格、分页 */
export function MemberTable({
  loading,
  members,
  total,
  currentPage,
  onPageChange,
  onPause,
  onResume,
  onRemove,
}: MemberTableProps) {
  if (loading) {
    return (
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>成员</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>资源统计</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>最后活跃</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>加入时间</th>
                <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='w-10 h-10 rounded-full dark:bg-gray-700' />
                      <div>
                        <Skeleton className='h-4 w-24 mb-1 dark:bg-gray-700' />
                        <Skeleton className='h-3 w-36 dark:bg-gray-700' />
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'><Skeleton className='h-5 w-20 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-6 w-16 rounded dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-8 w-16 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-20 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-4 w-20 dark:bg-gray-700' /></td>
                  <td className='px-6 py-4'><Skeleton className='h-8 w-8 rounded dark:bg-gray-700' /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-12 text-center'>
          <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg mb-2 dark:text-white'>未找到成员</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>尝试调整搜索条件或筛选器</p>
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
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>成员</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>资源统计</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>最后活跃</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>加入时间</th>
              <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {members.map(member => {
              const statusBadge = getStatusBadge(member.status);
              const StatusIcon = statusBadge.icon;
              return (
                <tr key={member.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        {member.avatarUrl && (
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                        )}
                        <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                          {member.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='dark:text-white'>{member.name}</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <RoleNamesDisplay names={member.roleNames} />
                  </td>
                  <td className='px-6 py-4'>
                    <Badge className={`text-xs ${statusBadge.color} border-0 gap-1`}>
                      <StatusIcon className='w-3 h-3' />
                      {statusBadge.label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 text-sm dark:text-gray-300'>
                    <div className='text-xs'>
                      <div>共享: {member.resourcesShared}</div>
                      <div className='text-gray-500 dark:text-gray-400'>访问: {member.resourcesAccessed}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{member.lastActive}</td>
                  <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{member.joinedDate}</td>
                  <td className='px-6 py-4'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                          <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                        {!member.sysAdmin && (
                          <>
                            {member.status === 'active' ? (
                              <DropdownMenuItem onClick={() => onPause(member)} className='dark:text-gray-300'>
                                <PauseCircle className='w-4 h-4 mr-2' />
                                暂停成员
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onResume(member)} className='dark:text-gray-300'>
                                <PlayCircle className='w-4 h-4 mr-2' />
                                恢复成员
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => onRemove(member)} className='text-red-600 dark:text-red-400'>
                              <Trash2 className='w-4 h-4 mr-2' />
                              移除成员
                            </DropdownMenuItem>
                          </>
                        )}
                        {member.sysAdmin && (
                          <DropdownMenuItem disabled className='dark:text-gray-500'>
                            所有者无法编辑
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
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
