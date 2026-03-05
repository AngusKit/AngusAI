import { Badge } from '@/components/ui/badge';

interface RoleNamesDisplayProps {
  /** 角色名称，多个用顿号或逗号分隔 */
  names: string;
}

/** 角色名称展示：多个角色用 Badge 标签展示 */
export function RoleNamesDisplay({ names }: RoleNamesDisplayProps) {
  if (!names || names === '-') {
    return <span className='text-sm text-gray-500 dark:text-gray-400'>-</span>;
  }
  const list = names.split(/[、,，]/).map(s => s.trim()).filter(Boolean);
  if (list.length === 0) {
    return <span className='text-sm text-gray-500 dark:text-gray-400'>-</span>;
  }
  return (
    <div className='flex flex-wrap gap-1'>
      {list.map((name, i) => (
        <Badge key={i} variant='secondary' className='text-xs font-normal dark:bg-gray-700 dark:text-gray-300'>
          {name}
        </Badge>
      ))}
    </div>
  );
}
