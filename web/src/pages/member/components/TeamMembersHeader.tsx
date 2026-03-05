interface TeamMembersHeaderProps {
  /** 标题文案（支持 i18n） */
  title: string;
  /** 副标题文案（支持 i18n） */
  subtitle: string;
}

/** 团队成员页头部：标题与描述 */
export function TeamMembersHeader({ title, subtitle }: TeamMembersHeaderProps) {
  return (
    <div>
      <h1 className='text-2xl mb-1 dark:text-white'>{title}</h1>
      <p className='text-sm text-gray-600 dark:text-gray-400'>{subtitle}</p>
    </div>
  );
}
