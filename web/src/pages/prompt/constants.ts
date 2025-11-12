/**
 * 提示词库相关常量
 */

import { Sparkles, Star, BookOpen, Code, MessageSquare, TrendingUp, FolderPlus, Shield, Home, Settings, User, FileText, Image, Video, Music, Calendar, Clock, Mail, Phone, MapPin, Globe, Link, Download, Upload, Share2, Heart, ThumbsUp, ThumbsDown, Eye, EyeOff, Lock, Unlock, Key, Bell, AlertCircle, Info, CheckCircle, XCircle, Zap, Rocket, Database, Server, Cloud, Wifi, Battery, Camera, Mic, Headphones, Gamepad, ShoppingCart, CreditCard, Wallet, Gift, Award, Trophy, Target, Flag, Compass, } from 'lucide-react';
import { constantTranslation as t } from '@/lib/i18n';

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

// 可用图标配置
export const AVAILABLE_ICONS = [
  { name: 'Sparkles', component: Sparkles, label: t('common.icons.Sparkles') },
  { name: 'Star', component: Star, label: t('common.icons.Star') },
  { name: 'BookOpen', component: BookOpen, label: t('common.icons.BookOpen') },
  { name: 'Code', component: Code, label: t('common.icons.Code') },
  { name: 'MessageSquare', component: MessageSquare, label: t('common.icons.MessageSquare') },
  { name: 'TrendingUp', component: TrendingUp, label: t('common.icons.TrendingUp') },
  { name: 'FolderPlus', component: FolderPlus, label: t('common.icons.FolderPlus') },
  { name: 'Shield', component: Shield, label: t('common.icons.Shield') },
  { name: 'Home', component: Home, label: t('common.icons.Home') },
  { name: 'Settings', component: Settings, label: t('common.icons.Settings') },
  { name: 'User', component: User, label: t('common.icons.User') },
  { name: 'FileText', component: FileText, label: t('common.icons.FileText') },
  { name: 'Image', component: Image, label: t('common.icons.Image') },
  { name: 'Video', component: Video, label: t('common.icons.Video') },
  { name: 'Music', component: Music, label: t('common.icons.Music') },
  { name: 'Calendar', component: Calendar, label: t('common.icons.Calendar') },
  { name: 'Clock', component: Clock, label: t('common.icons.Clock') },
  { name: 'Mail', component: Mail, label: t('common.icons.Mail') },
  { name: 'Phone', component: Phone, label: t('common.icons.Phone') },
  { name: 'MapPin', component: MapPin, label: t('common.icons.MapPin') },
  { name: 'Globe', component: Globe, label: t('common.icons.Globe') },
  { name: 'Link', component: Link, label: t('common.icons.Link') },
  { name: 'Download', component: Download, label: t('common.icons.Download') },
  { name: 'Upload', component: Upload, label: t('common.icons.Upload') },
  { name: 'Share2', component: Share2, label: t('common.icons.Share2') },
  { name: 'Heart', component: Heart, label: t('common.icons.Heart') },
  { name: 'ThumbsUp', component: ThumbsUp, label: t('common.icons.ThumbsUp') },
  { name: 'ThumbsDown', component: ThumbsDown, label: t('common.icons.ThumbsDown') },
  { name: 'Eye', component: Eye, label: t('common.icons.Eye') },
  { name: 'EyeOff', component: EyeOff, label: t('common.icons.EyeOff') },
  { name: 'Lock', component: Lock, label: t('common.icons.Lock') },
  { name: 'Unlock', component: Unlock, label: t('common.icons.Unlock') },
  { name: 'Key', component: Key, label: t('common.icons.Key') },
  { name: 'Bell', component: Bell, label: t('common.icons.Bell') },
  { name: 'AlertCircle', component: AlertCircle, label: t('common.icons.AlertCircle') },
  { name: 'Info', component: Info, label: t('common.icons.Info') },
  { name: 'CheckCircle', component: CheckCircle, label: t('common.icons.CheckCircle') },
  { name: 'XCircle', component: XCircle, label: t('common.icons.XCircle') },
  { name: 'Zap', component: Zap, label: t('common.icons.Zap') },
  { name: 'Rocket', component: Rocket, label: t('common.icons.Rocket') },
  { name: 'Database', component: Database, label: t('common.icons.Database') },
  { name: 'Server', component: Server, label: t('common.icons.Server') },
  { name: 'Cloud', component: Cloud, label: t('common.icons.Cloud') },
  { name: 'Wifi', component: Wifi, label: t('common.icons.Wifi') },
  { name: 'Battery', component: Battery, label: t('common.icons.Battery') },
  { name: 'Camera', component: Camera, label: t('common.icons.Camera') },
  { name: 'Mic', component: Mic, label: t('common.icons.Mic') },
  { name: 'Headphones', component: Headphones, label: t('common.icons.Headphones') },
  { name: 'Gamepad', component: Gamepad, label: t('common.icons.Gamepad') },
  { name: 'ShoppingCart', component: ShoppingCart, label: t('common.icons.ShoppingCart') },
  { name: 'CreditCard', component: CreditCard, label: t('common.icons.CreditCard') },
  { name: 'Wallet', component: Wallet, label: t('common.icons.Wallet') },
  { name: 'Gift', component: Gift, label: t('common.icons.Gift') },
  { name: 'Award', component: Award, label: t('common.icons.Award') },
  { name: 'Trophy', component: Trophy, label: t('common.icons.Trophy') },
  { name: 'Target', component: Target, label: t('common.icons.Target') },
  { name: 'Flag', component: Flag, label: t('common.icons.Flag') },
  { name: 'Compass', component: Compass, label: t('common.icons.Compass') },
] as const;

// 标签颜色配置
export const TAG_COLORS = [
  {
    name: t('common.color.blue'),
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: t('common.color.purple'),
    value: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: t('common.color.green'),
    value: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: t('common.color.orange'),
    value: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: t('common.color.red'),
    value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: t('common.color.pink'),
    value: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    name: t('common.color.cyan'),
    value: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    name: t('common.color.yellow'),
    value: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: t('common.color.indigo'),
    value: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    name: t('common.color.violet'),
    value: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
] as const;

// 分类颜色配置
export const CATEGORY_COLORS = [
  { value: 'text-blue-600 dark:text-blue-400', label: t('common.color.blue'), colorClass: 'bg-blue-500' },
  { value: 'text-green-600 dark:text-green-400', label: t('common.color.green'), colorClass: 'bg-green-500' },
  { value: 'text-purple-600 dark:text-purple-400', label: t('common.color.purple'), colorClass: 'bg-purple-500' },
  { value: 'text-orange-600 dark:text-orange-400', label: t('common.color.orange'), colorClass: 'bg-orange-500' },
  { value: 'text-red-600 dark:text-red-400', label: t('common.color.red'), colorClass: 'bg-red-500' },
  { value: 'text-pink-600 dark:text-pink-400', label: t('common.color.pink'), colorClass: 'bg-pink-500' },
] as const;

// 默认值配置
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
