import { Bell, Sun, Moon, Shield, Key, MessageSquare, Copy, Check, LogOut, User, ChevronRight, GitPullRequest, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useContext, useState } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { languages, Language } from '@/lib/i18n.ts';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/clipboard.ts';
import { MyContext } from '@/components/ui/utils.ts';
import { app } from '@xcan-angus/infra';
import { getGreeting, getFormattedDate } from '@/utils/FormatUtils.ts';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { userInfo } = useContext(MyContext);

  const notifications = [
    { id: 1, type: 'success', title: '应用发布成功', description: '您的应用"客服助手"已成功发布到生产环境', time: '5分钟前', read: false },
    { id: 2, type: 'info', title: '新功能上线', description: 'AngusAI 新增智能问答优化功能', time: '2小时前', read: false },
    { id: 3, type: 'warning', title: 'API 调用即将达到限额', description: '本月API调用量已使用85%', time: '1天前', read: true },
    { id: 4, type: 'info', title: '系统维护通知', description: '系统将于10月25日凌晨2:00-4:00进行维护', time: '2天前', read: true },
  ];

  const handleCopyId = async () => {
    const success = await copyToClipboard(userInfo.id);
    if (success) {
      setCopied(true);
      toast.success(t('ui.copyIdSuccess'));
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(t('ui.copyFailed'));
    }
  };

  const handleLogout = () => {
    app.signOut();
  };

  const handleNotificationClick = (_id: number) => {
    toast.success('已标记为已读');
  };

  const handleClearAll = () => {
    toast.success('已清空所有通知');
    setNotificationOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return GitPullRequest;
      case 'warning':
        return MessageSquare;
      default:
        return Star;
    }
  };

  return (
    <header className='h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between'>
      {/* Left Section - Greeting */}
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-900 dark:text-white font-semibold'>
            {getGreeting(language)}, {userInfo.fullName?.split(' ')[0] ?? userInfo.name?.split(' ')[0]}
          </span>
          <span className='text-xl'>👋</span>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {getFormattedDate(language)}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-2 ml-6'>
        {/* Notification */}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='sm' className='relative'>
              <Bell className='size-5' />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className='absolute top-0 right-0 size-4 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 min-w-[1rem]'>
                  {notifications.filter(n => !n.read).length > 99 ? '99+' : notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
            <PopoverContent className='w-96 p-0' align='end'>
              <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-gray-900 dark:text-white'>
                    {t('ui.notifications')}
                  </h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Button variant='ghost' size='sm' onClick={handleClearAll}>
                      {t('ui.markAllAsRead')}
                    </Button>
                  )}
                </div>
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.map(notification => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className='flex gap-3'>
                        <div className='flex-shrink-0'>
                          <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                            <Icon className='size-4 text-blue-600 dark:text-blue-400' />
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-900 dark:text-white mb-1'>
                            {notification.title}
                          </p>
                          <p className='text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
                            {notification.description}
                          </p>
                          <span className='text-xs text-gray-500 dark:text-gray-500'>
                            {notification.time}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className='flex-shrink-0'>
                            <span className='size-2 bg-blue-600 dark:bg-blue-500 rounded-full block' />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {notifications.length === 0 && (
                  <div className='flex flex-col items-center justify-center py-12 px-6'>
                    <div className='size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4'>
                      <Bell className='size-8 text-gray-400 dark:text-gray-500' />
                    </div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                      {t('ui.noNotifications')}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {t('ui.noNotificationsDesc')}
                    </p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className='p-3 border-t border-gray-200 dark:border-gray-700 text-center'>
                  <Button
                    variant='ghost'
                    className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    {t('ui.viewAllNotifications')}
                  </Button>
                </div>
              )}
            </PopoverContent>
        </Popover>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='gap-1.5'>
              <svg className='size-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path
                  d='M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14.5 18h6.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{languages[language].name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-36'>
            {Object.entries(languages).map(([code, { name }]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => setLanguage(code as Language)}
                className='flex items-center justify-between cursor-pointer'
              >
                <span>{name}</span>
                {language === code && <Check className='size-4 text-blue-600' />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              {theme === 'dark' ? <Moon className='size-5' /> : <Sun className='size-5' />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-36'>
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <Sun className='size-4' />
                <span>{t('ui.lightMode')}</span>
              </div>
              {theme === 'light' && <Check className='size-4 text-blue-600' />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <Moon className='size-4' />
                <span>{t('ui.darkMode')}</span>
              </div>
              {theme === 'dark' && <Check className='size-4 text-blue-600' />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - 与主题菜单间距 16px */}
        <div className='ml-2'>
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                <Avatar className='w-8 h-8 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'>
                  <AvatarImage src={userInfo.avatar} alt={userInfo.fullName ?? userInfo.name} />
                  <AvatarFallback className='bg-blue-500 text-white'>
                    {(userInfo.fullName ?? userInfo.name)?.slice(0, 2) ?? ''}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-64 p-0 dark:bg-gray-800 dark:border-gray-700' align='end'>
              <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
                  {t('ui.adminAccount')}
                </h3>
                <div className='flex items-start gap-3'>
                  <Avatar className='w-12 h-12 ring-2 ring-blue-500'>
                    <AvatarImage src={userInfo.avatar} alt={userInfo.fullName ?? userInfo.name} />
                    <AvatarFallback className='bg-blue-500 text-white'>
                      {(userInfo.fullName ?? userInfo.name)?.slice(0, 2) ?? ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='dark:text-white truncate'>{userInfo.fullName ?? userInfo.name}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1'>
                      <span className='truncate'>ID: {userInfo.id}</span>
                      <button
                        onClick={handleCopyId}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors shrink-0'
                      >
                        {copied ? <Check className='w-3.5 h-3.5 text-blue-600' /> : <Copy className='w-3.5 h-3.5' />}
                      </button>
                    </div>
                    {userInfo.verified && (
                      <div className='flex items-center gap-1 text-xs text-green-600 dark:text-green-400'>
                        <Check className='w-3.5 h-3.5' />
                        <span>已认证</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='py-1'>
                <div className='px-3 py-2'>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {t('ui.quickAccess')}
                  </p>
                </div>
                <button className='w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <div className='flex items-center gap-3'>
                    <User className='w-4 h-4' />
                    <span>{t('ui.profile')}</span>
                  </div>
                  <ChevronRight className='w-3.5 h-3.5 text-gray-400' />
                </button>
                <button className='w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <div className='flex items-center gap-3'>
                    <Shield className='w-4 h-4' />
                    <span>{t('ui.accountSecurity')}</span>
                  </div>
                  <ChevronRight className='w-3.5 h-3.5 text-gray-400' />
                </button>
                <button className='w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <div className='flex items-center gap-3'>
                    <Key className='w-4 h-4' />
                    <span>{t('ui.userTokens')}</span>
                  </div>
                  <ChevronRight className='w-3.5 h-3.5 text-gray-400' />
                </button>
                <button className='w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <div className='flex items-center gap-3'>
                    <MessageSquare className='w-4 h-4' />
                    <span>{t('ui.notificationSettings')}</span>
                  </div>
                  <ChevronRight className='w-3.5 h-3.5 text-gray-400' />
                </button>
              </div>

              <Separator className='dark:bg-gray-700' />

              <div className='p-2'>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                >
                  <LogOut className='w-4 h-4' />
                  <span>{t('ui.logout')}</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
