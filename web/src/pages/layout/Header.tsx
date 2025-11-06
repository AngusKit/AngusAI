import { Search, Bell, HelpCircle, Languages, Sun, Moon, User, Shield, Key, MessageSquare, Copy, Check, LogOut, FileText, Sparkles, AlertCircle, CheckCircle, Info, ExternalLink, BookOpen, Video, FileQuestion, Clock, TrendingUp, Zap, Database, GitBranch, X, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useContext, useState } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { languages, Language } from '@/lib/i18n';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/clipboard';
import { MyContext } from '@/components/ui/utils';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userInfo } = useContext(MyContext);


  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: '应用发布成功',
      description: '您的应用"客服助手"已成功发布到生产环境',
      time: '5分钟前',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      icon: Sparkles,
      title: '新功能上线',
      description: 'AngusAI 新增智能问答优化功能，快来体验吧',
      time: '2小时前',
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      icon: AlertCircle,
      title: 'API 调用即将达到限额',
      description: '本月API调用量已使用85%，建议升级套餐',
      time: '1天前',
      read: true,
    },
    {
      id: 4,
      type: 'info',
      icon: Info,
      title: '系统维护通知',
      description: '系统将于10月25日凌晨2:00-4:00进行维护',
      time: '2天前',
      read: true,
    },
  ];

  const helpItems = [
    {
      icon: BookOpen,
      title: '快速入门',
      description: '了解如何快速创建您的第一个AI应用',
      link: '#',
    },
    {
      icon: Video,
      title: '视频教程',
      description: '观看详细的功能演示和使用指南',
      link: '#',
    },
    {
      icon: FileText,
      title: '开发文档',
      description: '查看完整的API文档和开发指南',
      link: '#',
    },
    {
      icon: FileQuestion,
      title: '常见问题',
      description: '查找常见问题的解决方案',
      link: '#',
    },
    {
      icon: MessageSquare,
      title: '联系支持',
      description: '获取技术支持和帮助',
      link: '#',
    },
  ];

  const recentSearches = ['客服助手', '内容生成器', 'API 集成', '数据分析'];

  const searchSuggestions = [
    {
      category: '应用',
      items: [
        {
          name: '客服助手',
          description: 'AI智能客服对话系统',
          type: 'app',
          badge: '热门',
        },
        {
          name: '内容生成器',
          description: '自动生成营销文案',
          type: 'app',
          badge: null,
        },
        {
          name: '数据分析助手',
          description: '智能数据分析与可视化',
          type: 'app',
          badge: '新',
        },
      ],
    },
    {
      category: '工作流',
      items: [
        {
          name: 'API 自动化集成',
          description: '连接多个API服务',
          type: 'workflow',
          badge: null,
        },
        {
          name: '文档处理流程',
          description: '自动化文档解析和处理',
          type: 'workflow',
          badge: null,
        },
      ],
    },
    {
      category: '知识库',
      items: [
        {
          name: '产品知识库',
          description: '产品相关文档和资料',
          type: 'knowledge',
          badge: null,
        },
        {
          name: '技术文档库',
          description: 'API和开发文档',
          type: 'knowledge',
          badge: null,
        },
      ],
    },
  ];

  const filteredSuggestions = searchQuery
    ? searchSuggestions
        .map(category => ({
          ...category,
          items: category.items.filter(
            item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(category => category.items.length > 0)
    : searchSuggestions;

  const handleCopyId = async () => {
    const success = await copyToClipboard(userInfo.id);
    if (success) {
      setCopied(true);
      toast.success('ID 已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('复制失败');
    }
  };

  const handleLogout = () => {
    toast.success('已退出登录');
    setUserPopoverOpen(false);
  };

  const handleNotificationClick = (id: number) => {
    toast.success('已标记为已读');
  };

  const handleClearAll = () => {
    toast.success('已清空所有通知');
    setNotificationOpen(false);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app':
        return Zap;
      case 'workflow':
        return GitBranch;
      case 'knowledge':
        return Database;
      default:
        return FileText;
    }
  };

  const handleSearchSelect = (name: string) => {
    toast.success(`打开: ${name}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className='h-[57px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center'>
      <div className='flex items-center justify-between w-full'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-gray-600 dark:text-gray-300'>工作台</span>
          <span className='text-gray-400 dark:text-gray-500'>/</span>
          <span className='text-gray-600 dark:text-gray-300'>欢迎回来，{userInfo.fullName}</span>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-4'>
          {/* Search */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10' />
              <input
                type='text'
                placeholder='搜索应用、工作流...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className='pl-10 pr-10 py-2 w-64 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
            <PopoverContent
              className='w-[500px] p-0 dark:bg-gray-800 dark:border-gray-700'
              align='end'
              onOpenAutoFocus={e => e.preventDefault()}
            >
              {/* Search Results */}
              <div className='max-h-[500px] overflow-y-auto'>
                {!searchQuery && (
                  <>
                    {/* Recent Searches */}
                    <div className='p-4 border-b dark:border-gray-700'>
                      <div className='flex items-center gap-2 mb-3'>
                        <Clock className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                        <h4 className='text-sm text-gray-600 dark:text-gray-400'>最近搜索</h4>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(search);
                            }}
                            className='px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hot Searches */}
                    <div className='p-4 border-b dark:border-gray-700'>
                      <div className='flex items-center gap-2 mb-3'>
                        <TrendingUp className='w-4 h-4 text-orange-500' />
                        <h4 className='text-sm text-gray-600 dark:text-gray-400'>热门搜索</h4>
                      </div>
                      <div className='space-y-2'>
                        {['智能客服', 'GPT-4应用', '知识库管理'].map((hot, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(hot);
                            }}
                            className='flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group'
                          >
                            <span className='w-5 h-5 flex items-center justify-center text-xs text-orange-500'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                              {hot}
                            </span>
                            <Sparkles className='w-3 h-3 ml-auto text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity' />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Search Suggestions */}
                {filteredSuggestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className='p-4 border-b dark:border-gray-700 last:border-b-0'>
                    <h4 className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{category.category}</h4>
                    <div className='space-y-1'>
                      {category.items.map((item, itemIndex) => {
                        const TypeIcon = getTypeIcon(item.type);
                        return (
                          <button
                            key={itemIndex}
                            onClick={() => handleSearchSelect(item.name)}
                            className='flex items-start gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group'
                          >
                            <div className='flex-shrink-0 text-blue-500 dark:text-blue-400 mt-0.5'>
                              <TypeIcon className='w-4 h-4' />
                            </div>
                            <div className='flex-1 min-w-0 text-left'>
                              <div className='flex items-center gap-2 mb-1'>
                                <span className='text-sm dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <Badge
                                    variant={item.badge === '热门' ? 'default' : 'secondary'}
                                    className={`text-xs px-1.5 py-0 ${
                                      item.badge === '热门'
                                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    }`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>{item.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* No Results */}
                {searchQuery && filteredSuggestions.length === 0 && (
                  <div className='p-8 text-center'>
                    <Search className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>未找到相关结果</p>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>尝试使用其他关键词搜索</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750'>
                <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center gap-4'>
                    <span>
                      按{' '}
                      <kbd className='px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs'>
                        ↑
                      </kbd>{' '}
                      <kbd className='px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs'>
                        ↓
                      </kbd>{' '}
                      导航
                    </span>
                    <span>
                      按{' '}
                      <kbd className='px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs'>
                        Enter
                      </kbd>{' '}
                      选择
                    </span>
                  </div>
                  <span>
                    按{' '}
                    <kbd className='px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs'>
                      ESC
                    </kbd>{' '}
                    关闭
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Notification */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <button className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>
                <Bell className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-96 p-0 dark:bg-gray-800 dark:border-gray-700' align='end'>
              {/* Header */}
              <div className='p-4 border-b dark:border-gray-700 flex items-center justify-between'>
                <div>
                  <h3 className='dark:text-white'>通知中心</h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {notifications.filter(n => !n.read).length} 条未读通知
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClearAll}
                  className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  清空全部
                </button>
              </div>

              {/* Notifications List */}
              <div className='max-h-96 overflow-y-auto'>
                {notifications.map(notification => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className='flex gap-3'>
                        <div className={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          <Icon className='w-5 h-5' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <span className='dark:text-white'>{notification.title}</span>
                            {!notification.read && (
                              <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2'></span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{notification.description}</p>
                          <span className='text-xs text-gray-500 dark:text-gray-500'>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className='p-3 border-t dark:border-gray-700 text-center'>
                <button className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
                  查看全部通知
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help */}
          <Popover open={helpOpen} onOpenChange={setHelpOpen}>
            <PopoverTrigger asChild>
              <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>
                <HelpCircle className='w-5 h-5 text-gray-600 dark:text-gray-300' />
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-0 dark:bg-gray-800 dark:border-gray-700' align='end'>
              {/* Header */}
              <div className='p-4 border-b dark:border-gray-700'>
                <h3 className='dark:text-white'>帮助中心</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>快速找到您需要的帮助</p>
              </div>

              {/* Help Items */}
              <div className='p-2'>
                {helpItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.link}
                      className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group'
                      onClick={e => {
                        e.preventDefault();
                        toast.success(`正在打开 ${item.title}`);
                      }}
                    >
                      <div className='flex-shrink-0 text-blue-500 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                            {item.title}
                          </span>
                          <ExternalLink className='w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{item.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Footer */}
              <div className='p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-2'>需要更多帮助？</div>
                <div className='flex gap-2'>
                  <button className='flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:text-gray-300'>
                    在线客服
                  </button>
                  <button className='flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                    提交反馈
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>
                <Languages className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                <span className='text-sm text-gray-600 dark:text-gray-300'>{languages[language].name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
              {Object.entries(languages).map(([code, { name }]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={`${language === code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''} cursor-pointer`}
                >
                  <span className='flex items-center justify-between w-full'>
                    <span>{name}</span>
                    {language === code && <Check className='w-4 h-4 ml-2' />}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>
                {theme === 'light' ? (
                  <Sun className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                ) : (
                  <Moon className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className={theme === 'light' ? 'bg-blue-50 dark:bg-blue-900' : ''}
              >
                <Sun className='w-4 h-4 mr-2' />
                浅色模式
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900' : ''}
              >
                <Moon className='w-4 h-4 mr-2' />
                深色模式
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                <Avatar className='w-8 h-8 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'>
                  <AvatarImage src={userInfo.avatar} alt={userInfo.fullName} />
                  <AvatarFallback className='bg-blue-500 text-white'>
                    {userInfo.fullName ? userInfo.fullName.slice(0, 2) : ''}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-60 p-0 dark:bg-gray-800 dark:border-gray-700' align='end'>
              {/* Header */}
              <div className='p-4 border-b dark:border-gray-700'>
                <h3 className='text-sm text-gray-500 dark:text-gray-400 mb-3'>个人中心</h3>
                <div className='flex items-start gap-5'>
                  <Avatar className='w-12 h-12 ring-2 ring-blue-500'>
                    <AvatarImage src={userInfo.avatar} alt={userInfo.fullName} />
                    <AvatarFallback className='bg-blue-500 text-white'>
                      {userInfo.fullName ? userInfo.fullName.slice(0, 2) : ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='dark:text-white'>{userInfo.fullName}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                      <span>ID: {userInfo.id}</span>
                      <button
                        onClick={handleCopyId}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                      >
                        {copied ? <Check className='w-3.5 h-3.5 text-green-600' /> : <Copy className='w-3.5 h-3.5' />}
                      </button>
                    </div>
                    {userInfo.verified && (
                      <div className='flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1'>
                        <Check className='w-3.5 h-3.5' />
                        <span>已认证</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className='py-2'>
                <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <FileText className='w-4 h-4' />
                  <span>基本信息</span>
                </button>
                <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <Shield className='w-4 h-4' />
                  <span>安全设置</span>
                </button>
                <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <Key className='w-4 h-4' />
                  <span>访问令牌</span>
                </button>
                <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left dark:text-gray-300'>
                  <MessageSquare className='w-4 h-4' />
                  <span>我的消息</span>
                </button>
              </div>

              <Separator className='dark:bg-gray-700' />

              {/* Logout */}
              <div className='p-2'>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                >
                  <LogOut className='w-4 h-4' />
                  <span>退出登录</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
