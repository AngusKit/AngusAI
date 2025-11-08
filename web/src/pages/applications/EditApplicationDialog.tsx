import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, Database, Bot, Code, Zap, Heart, Star, Users, FileText, Calendar, Settings, Bell, Globe, Lock, Mail, Phone, Camera, Image, Music, Video, BookOpen, Briefcase, Coffee, ShoppingCart, CreditCard, Gift, Trophy, Target, Rocket, Lightbulb, Brain, Cpu, Cloud, Server, Terminal, Package, Wrench, Shield, ChevronLeft, ChevronRight, } from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: number;
  name: string;
  description: string;
  icon: any;
  iconBgColor: string;
  status: '草稿' | '已发布' | '已暂停';
  isStarred: boolean;
  tags: { label: string; color: string }[];
  visits: string;
  category: string;
}

interface EditApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onSave: (updatedApp: Partial<Application>) => void;
}

const iconOptions = [
  {
    id: 'message',
    icon: MessageSquare,
    label: '消息',
    bgColor: 'bg-purple-500',
  },
  { id: 'sparkles', icon: Sparkles, label: '星星', bgColor: 'bg-purple-600' },
  { id: 'database', icon: Database, label: '数据库', bgColor: 'bg-green-500' },
  { id: 'bot', icon: Bot, label: '机器人', bgColor: 'bg-orange-500' },
  { id: 'code', icon: Code, label: '代码', bgColor: 'bg-indigo-500' },
  { id: 'zap', icon: Zap, label: '闪电', bgColor: 'bg-yellow-500' },
  { id: 'heart', icon: Heart, label: '心形', bgColor: 'bg-red-500' },
  { id: 'star', icon: Star, label: '星标', bgColor: 'bg-amber-500' },
  { id: 'users', icon: Users, label: '用户', bgColor: 'bg-blue-500' },
  { id: 'filetext', icon: FileText, label: '文件', bgColor: 'bg-slate-500' },
  { id: 'calendar', icon: Calendar, label: '日历', bgColor: 'bg-cyan-500' },
  { id: 'settings', icon: Settings, label: '设置', bgColor: 'bg-gray-500' },
  { id: 'bell', icon: Bell, label: '通知', bgColor: 'bg-rose-500' },
  { id: 'globe', icon: Globe, label: '全球', bgColor: 'bg-teal-500' },
  { id: 'lock', icon: Lock, label: '锁定', bgColor: 'bg-zinc-600' },
  { id: 'mail', icon: Mail, label: '邮件', bgColor: 'bg-sky-500' },
  { id: 'phone', icon: Phone, label: '电话', bgColor: 'bg-emerald-500' },
  { id: 'camera', icon: Camera, label: '相机', bgColor: 'bg-violet-500' },
  { id: 'image', icon: Image, label: '图片', bgColor: 'bg-fuchsia-500' },
  { id: 'music', icon: Music, label: '音乐', bgColor: 'bg-pink-500' },
  { id: 'video', icon: Video, label: '视频', bgColor: 'bg-red-600' },
  { id: 'bookopen', icon: BookOpen, label: '书籍', bgColor: 'bg-orange-600' },
  {
    id: 'briefcase',
    icon: Briefcase,
    label: '公文包',
    bgColor: 'bg-brown-500',
  },
  { id: 'coffee', icon: Coffee, label: '咖啡', bgColor: 'bg-amber-700' },
  {
    id: 'shoppingcart',
    icon: ShoppingCart,
    label: '购物车',
    bgColor: 'bg-lime-500',
  },
  {
    id: 'creditcard',
    icon: CreditCard,
    label: '信用卡',
    bgColor: 'bg-blue-600',
  },
  { id: 'gift', icon: Gift, label: '礼物', bgColor: 'bg-pink-600' },
  { id: 'trophy', icon: Trophy, label: '奖杯', bgColor: 'bg-yellow-600' },
  { id: 'target', icon: Target, label: '目标', bgColor: 'bg-red-700' },
  { id: 'rocket', icon: Rocket, label: '火箭', bgColor: 'bg-indigo-600' },
  { id: 'lightbulb', icon: Lightbulb, label: '灯泡', bgColor: 'bg-yellow-400' },
  { id: 'brain', icon: Brain, label: '大脑', bgColor: 'bg-purple-700' },
  { id: 'cpu', icon: Cpu, label: 'CPU', bgColor: 'bg-slate-600' },
  { id: 'cloud', icon: Cloud, label: '云', bgColor: 'bg-sky-400' },
  { id: 'server', icon: Server, label: '服务器', bgColor: 'bg-gray-600' },
  { id: 'terminal', icon: Terminal, label: '终端', bgColor: 'bg-green-600' },
  { id: 'package', icon: Package, label: '包裹', bgColor: 'bg-orange-700' },
  { id: 'wrench', icon: Wrench, label: '扳手', bgColor: 'bg-zinc-500' },
  { id: 'shield', icon: Shield, label: '盾牌', bgColor: 'bg-blue-700' },
];

const categories = [
  { value: 'chatbot', label: '聊天助手' },
  { value: 'text-generation', label: '文本生成' },
  { value: 'knowledge', label: '知识问答' },
  { value: 'other', label: '其他' },
];

export function EditApplicationDialog({ open, onOpenChange, application, onSave }: EditApplicationDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIconId, setSelectedIconId] = useState('message');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (application) {
      setName(application.name);
      setDescription(application.description);
      setCategory(application.category);
      // 找到对应的图标ID
      const iconOption = iconOptions.find(opt => opt.bgColor === application.iconBgColor);
      if (iconOption) {
        setSelectedIconId(iconOption.id);
      }
    }
  }, [application]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('请输入应用名称');
      return;
    }
    if (!description.trim()) {
      toast.error('请输入应用描述');
      return;
    }

    const selectedIcon = iconOptions.find(opt => opt.id === selectedIconId);
    onSave({
      name,
      description,
      category,
      icon: selectedIcon?.icon,
      iconBgColor: selectedIcon?.bgColor,
    });
    toast.success('应用已更新');
    onOpenChange(false);
  };

  const scrollIcons = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240; // 约4个图标的宽度 (56px * 4 + 12px gap * 3)
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>编辑应用</DialogTitle>
          <DialogDescription className='dark:text-gray-400'>修改应用的基本信息和配置</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4 overflow-x-hidden'>
          {/* 应用名称 */}
          <div className='space-y-2'>
            <Label htmlFor='name' className='dark:text-gray-300'>
              应用名称
            </Label>
            <Input
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='请输入应用名称'
              className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
            />
          </div>

          {/* 应用描述 */}
          <div className='space-y-2'>
            <Label htmlFor='description' className='dark:text-gray-300'>
              应用描述
            </Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='请输入应用描述'
              rows={4}
              className='dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none'
            />
          </div>

          {/* 应用分类 */}
          <div className='space-y-2'>
            <Label htmlFor='category' className='dark:text-gray-300'>
              应用分类
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                <SelectValue placeholder='选择分类' />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value} className='dark:text-gray-300'>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 应用图标 */}
          <div className='space-y-2'>
            <Label className='dark:text-gray-300'>应用图标</Label>
            <div className='relative group'>
              {/* 左箭头 */}
              <button
                type='button'
                onClick={() => scrollIcons('left')}
                className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <ChevronLeft className='w-5 h-5 text-gray-700 dark:text-gray-300' />
              </button>

              {/* 图标滚动容器 */}
              <div
                ref={scrollContainerRef}
                className='flex gap-3 overflow-x-auto scrollbar-hide pl-9 pr-9'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {iconOptions.map(option => {
                  const IconComp = option.icon;
                  return (
                    <button
                      type='button'
                      key={option.id}
                      onClick={() => setSelectedIconId(option.id)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedIconId === option.id
                          ? `${option.bgColor} shadow-lg scale-105 ring-2 ring-offset-2 dark:ring-offset-gray-800`
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={option.label}
                    >
                      <IconComp
                        className={`w-6 h-6 ${selectedIconId === option.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* 右箭头 */}
              <button
                type='button'
                onClick={() => scrollIcons('right')}
                className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <ChevronRight className='w-5 h-5 text-gray-700 dark:text-gray-300' />
              </button>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>悬停显示箭头按钮，点击滚动查看更多图标</p>
          </div>

          {/* 应用状态信息 */}
          <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm dark:text-gray-300 mb-1'>当前状态</div>
                <Badge
                  className={
                    application.status === '已发布'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : application.status === '已暂停'
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }
                >
                  {application.status}
                </Badge>
              </div>
              <div>
                <div className='text-sm dark:text-gray-300 mb-1'>调用次数</div>
                <div className='dark:text-white'>{application.visits || '暂无数据'}</div>
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
          <Button onClick={handleSave} className='bg-blue-500 hover:bg-blue-600 text-white'>
            保存更改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
