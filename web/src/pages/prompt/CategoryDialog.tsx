import {
  Sparkles,
  Star,
  BookOpen,
  Code,
  MessageSquare,
  TrendingUp,
  FolderPlus,
  Shield,
  Home,
  Settings,
  User,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  Download,
  Upload,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Zap,
  Rocket,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Camera,
  Mic,
  Headphones,
  Gamepad,
  ShoppingCart,
  CreditCard,
  Wallet,
  Gift,
  Award,
  Trophy,
  Target,
  Flag,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import PromptCategories from '../../services/PromptCategories';

const AVAILABLE_ICONS = [
  { name: 'Sparkles', component: Sparkles, label: '火花' },
  { name: 'Star', component: Star, label: '星星' },
  { name: 'BookOpen', component: BookOpen, label: '书本' },
  { name: 'Code', component: Code, label: '代码' },
  { name: 'MessageSquare', component: MessageSquare, label: '消息' },
  { name: 'TrendingUp', component: TrendingUp, label: '趋势上升' },
  { name: 'FolderPlus', component: FolderPlus, label: '文件夹' },
  { name: 'Shield', component: Shield, label: '盾牌' },
  { name: 'Home', component: Home, label: '首页' },
  { name: 'Settings', component: Settings, label: '设置' },
  { name: 'User', component: User, label: '用户' },
  { name: 'FileText', component: FileText, label: '文档' },
  { name: 'Image', component: Image, label: '图片' },
  { name: 'Video', component: Video, label: '视频' },
  { name: 'Music', component: Music, label: '音乐' },
  { name: 'Calendar', component: Calendar, label: '日历' },
  { name: 'Clock', component: Clock, label: '时钟' },
  { name: 'Mail', component: Mail, label: '邮件' },
  { name: 'Phone', component: Phone, label: '电话' },
  { name: 'MapPin', component: MapPin, label: '位置' },
  { name: 'Globe', component: Globe, label: '地球' },
  { name: 'Link', component: Link, label: '链接' },
  { name: 'Download', component: Download, label: '下载' },
  { name: 'Upload', component: Upload, label: '上传' },
  { name: 'Share2', component: Share2, label: '分享' },
  { name: 'Heart', component: Heart, label: '心形' },
  { name: 'ThumbsUp', component: ThumbsUp, label: '点赞' },
  { name: 'ThumbsDown', component: ThumbsDown, label: '点踩' },
  { name: 'Eye', component: Eye, label: '眼睛' },
  { name: 'EyeOff', component: EyeOff, label: '闭眼' },
  { name: 'Lock', component: Lock, label: '锁定' },
  { name: 'Unlock', component: Unlock, label: '解锁' },
  { name: 'Key', component: Key, label: '钥匙' },
  { name: 'Bell', component: Bell, label: '铃铛' },
  { name: 'AlertCircle', component: AlertCircle, label: '警告' },
  { name: 'Info', component: Info, label: '信息' },
  { name: 'CheckCircle', component: CheckCircle, label: '成功' },
  { name: 'XCircle', component: XCircle, label: '错误' },
  { name: 'Zap', component: Zap, label: '闪电' },
  { name: 'Rocket', component: Rocket, label: '火箭' },
  { name: 'Database', component: Database, label: '数据库' },
  { name: 'Server', component: Server, label: '服务器' },
  { name: 'Cloud', component: Cloud, label: '云' },
  { name: 'Wifi', component: Wifi, label: 'WiFi' },
  { name: 'Battery', component: Battery, label: '电池' },
  { name: 'Camera', component: Camera, label: '相机' },
  { name: 'Mic', component: Mic, label: '麦克风' },
  { name: 'Headphones', component: Headphones, label: '耳机' },
  { name: 'Gamepad', component: Gamepad, label: '游戏手柄' },
  { name: 'ShoppingCart', component: ShoppingCart, label: '购物车' },
  { name: 'CreditCard', component: CreditCard, label: '信用卡' },
  { name: 'Wallet', component: Wallet, label: '钱包' },
  { name: 'Gift', component: Gift, label: '礼物' },
  { name: 'Award', component: Award, label: '奖章' },
  { name: 'Trophy', component: Trophy, label: '奖杯' },
  { name: 'Target', component: Target, label: '目标' },
  { name: 'Flag', component: Flag, label: '旗帜' },
  { name: 'Compass', component: Compass, label: '指南针' },
];

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: any;
  color: string;
  parentId?: string;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSuccess: () => void;
  buildCategoryTree: (parentId: string | undefined, level: number, excludeId?: string) => Category[];
  getCategoryPath: (categoryId: string) => string[];
}

export function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  onSuccess,
  buildCategoryTree,
  getCategoryPath,
}: CategoryDialogProps) {
  const { t, language } = useLanguage();
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: BookOpen,
    color: 'text-blue-600 dark:text-blue-400',
    parentId: 'none',
  });

  // 当对话框打开或编辑的分类变化时，初始化表单
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        setCategoryForm({
          name: editingCategory.name,
          icon: editingCategory.icon,
          color: editingCategory.color,
          parentId: editingCategory.parentId || 'none',
        });
      } else {
        setCategoryForm({
          name: '',
          icon: BookOpen,
          color: 'text-blue-600 dark:text-blue-400',
          parentId: 'none',
        });
      }
    }
  }, [open, editingCategory]);

  const handleSave = async () => {
    if (!categoryForm.name.trim()) {
      toast.error(language === 'zh-CN' ? '请输入分类名称' : 'Please enter category name');
      return;
    }

    try {
      // 找到图标名称
      const iconName = AVAILABLE_ICONS.find(icon => icon.component === categoryForm.icon)?.name || 'BookOpen';

      if (editingCategory) {
        await PromptCategories.updatePromptCategory(editingCategory.id, {
          name: categoryForm.name,
          icon: iconName,
          color: categoryForm.color,
          parentId: categoryForm.parentId === 'none' ? undefined : categoryForm.parentId,
        });
        toast.success(language === 'zh-CN' ? '分类已更新' : 'Category updated');
      } else {
        await PromptCategories.createPromptCategory({
          name: categoryForm.name,
          icon: iconName,
          color: categoryForm.color,
          parentId: categoryForm.parentId === 'none' ? undefined : categoryForm.parentId,
        });
        toast.success(language === 'zh-CN' ? '分类已创建' : 'Category created');
      }

      onSuccess();
      onOpenChange(false);
      setCategoryForm({
        name: '',
        icon: BookOpen,
        color: 'text-blue-600 dark:text-blue-400',
        parentId: 'none',
      });
    } catch (error: any) {
      console.error('保存分类失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '保存分类失败' : 'Failed to save category'));
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCategoryForm({
      name: '',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      parentId: 'none',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {editingCategory ? (language === 'zh-CN' ? '编辑分组' : 'Edit Category') : t('prompts.newCategory')}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? language === 'zh-CN'
                ? '修改提示词分组信息'
                : 'Edit prompt category information'
              : language === 'zh-CN'
                ? '创建一个新的提示词分组'
                : 'Create a new prompt category'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='categoryName' className='mb-1'>{t('prompts.categoryName')}</Label>
            <Input
              id='categoryName'
              value={categoryForm.name}
              onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'zh-CN' ? '输入分组名称...' : 'Enter category name...'}
              className='dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='parentCategory' className='mb-1'>
              {language === 'zh-CN' ? '父分组（可选）' : 'Parent Category (Optional)'}
            </Label>
            <Select
              value={categoryForm.parentId || 'none'}
              onValueChange={value =>
                setCategoryForm(prev => ({
                  ...prev,
                  parentId: value === 'none' ? '' : value,
                }))
              }
            >
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                <SelectItem value='none'>
                  {language === 'zh-CN' ? '无（作为顶层分组）' : 'None (Top-level category)'}
                </SelectItem>
                {buildCategoryTree(undefined, 0, editingCategory?.id).map(cat => {
                  const path = getCategoryPath(cat.id);
                  const level = path.length - 1;
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className='flex items-center gap-2'>
                        {level > 0 && (
                          <div className='flex items-center gap-1'>
                            {Array.from({ length: level }).map((_, i) => (
                              <div key={i} className='w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500' />
                            ))}
                          </div>
                        )}
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='categoryIcon' className='mb-1'>{language === 'zh-CN' ? '图标' : 'Icon'}</Label>
              <Select
                value={AVAILABLE_ICONS.find(icon => icon.component === categoryForm.icon)?.name || 'BookOpen'}
                onValueChange={value => {
                  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value);
                  if (selectedIcon) {
                    setCategoryForm(prev => ({ ...prev, icon: selectedIcon.component }));
                  }
                }}
              >
                <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                  <SelectValue placeholder={language === 'zh-CN' ? '选择图标' : 'Select icon'} />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                  <ScrollArea className='h-[250px]'>
                    <div className='grid grid-cols-2 gap-1 p-2'>
                      {AVAILABLE_ICONS.map(icon => {
                        const IconComponent = icon.component;
                        return (
                          <SelectItem key={icon.name} value={icon.name} className='cursor-pointer'>
                            <div className='flex items-center gap-2'>
                              <IconComponent className='w-4 h-4' />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='categoryColor' className='mb-1'>{language === 'zh-CN' ? '颜色' : 'Color'}</Label>
              <Select
                value={categoryForm.color}
                onValueChange={value => setCategoryForm(prev => ({ ...prev, color: value }))}
              >
                <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='text-blue-600 dark:text-blue-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-blue-500' />
                      {language === 'zh-CN' ? '蓝色' : 'Blue'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-green-600 dark:text-green-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-green-500' />
                      {language === 'zh-CN' ? '绿色' : 'Green'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-purple-600 dark:text-purple-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-purple-500' />
                      {language === 'zh-CN' ? '紫色' : 'Purple'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-orange-600 dark:text-orange-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-orange-500' />
                      {language === 'zh-CN' ? '橙色' : 'Orange'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-red-600 dark:text-red-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-red-500' />
                      {language === 'zh-CN' ? '红色' : 'Red'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-pink-600 dark:text-pink-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-pink-500' />
                      {language === 'zh-CN' ? '粉色' : 'Pink'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{editingCategory ? t('common.save') : t('common.create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

