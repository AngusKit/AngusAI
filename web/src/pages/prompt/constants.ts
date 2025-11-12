/**
 * 提示词库相关常量
 */

import { Sparkles, Star, BookOpen, Code, MessageSquare, TrendingUp, FolderPlus, Shield, Home, Settings, User, FileText, Image, Video, Music, Calendar, Clock, Mail, Phone, MapPin, Globe, Link, Download, Upload, Share2, Heart, ThumbsUp, ThumbsDown, Eye, EyeOff, Lock, Unlock, Key, Bell, AlertCircle, Info, CheckCircle, XCircle, Zap, Rocket, Database, Server, Cloud, Wifi, Battery, Camera, Mic, Headphones, Gamepad, ShoppingCart, CreditCard, Wallet, Gift, Award, Trophy, Target, Flag, Compass, } from 'lucide-react';

// 图标名称到组件的映射
export const ICON_MAP: Record<string, any> = {
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
} as const;

// 可用图标配置 TODO 国际化
export const AVAILABLE_ICONS = [
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
] as const;

// 标签颜色配置 TODO 国际化
export const TAG_COLORS = [
  {
    name: '蓝色',
    nameEn: 'Blue',
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: '紫色',
    nameEn: 'Purple',
    value: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: '绿色',
    nameEn: 'Green',
    value: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: '橙色',
    nameEn: 'Orange',
    value: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: '红色',
    nameEn: 'Red',
    value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: '粉色',
    nameEn: 'Pink',
    value: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    name: '青色',
    nameEn: 'Cyan',
    value: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    name: '黄色',
    nameEn: 'Yellow',
    value: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: '靛青',
    nameEn: 'Indigo',
    value: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    name: '紫罗兰',
    nameEn: 'Violet',
    value: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
] as const;

// 分类颜色配置
export const CATEGORY_COLORS = [
  { value: 'text-blue-600 dark:text-blue-400', label: '蓝色', labelEn: 'Blue', colorClass: 'bg-blue-500' },
  { value: 'text-green-600 dark:text-green-400', label: '绿色', labelEn: 'Green', colorClass: 'bg-green-500' },
  { value: 'text-purple-600 dark:text-purple-400', label: '紫色', labelEn: 'Purple', colorClass: 'bg-purple-500' },
  { value: 'text-orange-600 dark:text-orange-400', label: '橙色', labelEn: 'Orange', colorClass: 'bg-orange-500' },
  { value: 'text-red-600 dark:text-red-400', label: '红色', labelEn: 'Red', colorClass: 'bg-red-500' },
  { value: 'text-pink-600 dark:text-pink-400', label: '粉色', labelEn: 'Pink', colorClass: 'bg-pink-500' },
] as const;

// 默认值配置 TODO 国际化
export const DEFAULT_VALUES = {
  CATEGORY_ICON: BookOpen,
  CATEGORY_COLOR: 'text-blue-600 dark:text-blue-400',
  TAG_COLOR: TAG_COLORS[0]?.value || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PARENT_CATEGORY_NONE: 'none',
} as const;

// 限制配置
export const LIMITS = {
  MAX_TAGS: 5,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// 系统分类ID
export const SYSTEM_CATEGORY_IDS = {
  ALL: 'all',
  FAVORITES: 'favorites',
} as const;
