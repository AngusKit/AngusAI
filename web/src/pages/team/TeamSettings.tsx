import { useState } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { Settings, Users, Shield, Bell, Palette, Tag, Save, Upload, Camera, Lock, Globe, Mail, CheckCircle, XCircle, Eye, EyeOff, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function TeamSettings() {
  const [teamName, setTeamName] = useState('AngusAI团队');
  const [teamDescription, setTeamDescription] = useState('AI应用开发与协作团队');
  const [teamEmail, setTeamEmail] = useState('team@angusai.com');
  const [teamSize, setTeamSize] = useState('small');
  const [teamIndustry, setTeamIndustry] = useState('technology');

  // 安全设置
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('24');
  const [passwordPolicy, setPasswordPolicy] = useState('strong');

  // 权限设置
  const [defaultMemberRole, setDefaultMemberRole] = useState('member');
  const [allowGuestAccess, setAllowGuestAccess] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSaveBasicInfo = () => {
    toast.success('基本信息已保存');
  };

  const handleSaveSecurity = () => {
    toast.success('安全设置已保存');
  };

  const handleSavePermissions = () => {
    toast.success('权限设置已保存');
  };

  const handleSaveNotifications = () => {
    toast.success('通知设置已保存');
  };

  const stats = [
    { label: '团队成员', value: '12', icon: Users, color: 'text-blue-600' },
    { label: '共享资源', value: '48', icon: Globe, color: 'text-green-600' },
    {
      label: '存储空间',
      value: '24.5 GB',
      subtext: '/ 100 GB',
      icon: Settings,
      color: 'text-orange-600',
    },
    {
      label: '安全评分',
      value: '92',
      subtext: '/ 100',
      icon: Shield,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>团队设置</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>管理团队配置和偏好设置</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-3'>
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className='w-5 h-5' />
                </div>
              </div>
              <div className='text-base text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='flex items-baseline gap-1'>
                <div className='text-3xl dark:text-white'>{stat.value}</div>
                {stat.subtext && <div className='text-sm text-gray-500 dark:text-gray-400'>{stat.subtext}</div>}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Settings Sections */}
      <div className='space-y-6'>
        {/* 基本信息 */}
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30'>
              <Users className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>基本信息</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>团队的基本资料和标识</p>
            </div>
          </div>

          <div className='space-y-6'>
            {/* 团队头像 */}
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>团队头像</Label>
              <div className='flex items-center gap-4'>
                <div className='w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl'>
                  AI
                </div>
                <div className='space-y-2'>
                  <Button variant='outline' className='dark:bg-gray-700 dark:border-gray-600'>
                    <Upload className='w-4 h-4 mr-2' />
                    上传头像
                  </Button>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>推荐尺寸：200x200px，支持 JPG、PNG 格式</p>
                </div>
              </div>
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='team-name' className='dark:text-gray-300'>
                  团队名称 *
                </Label>
                <Input
                  id='team-name'
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className='dark:bg-gray-700 dark:border-gray-600'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='team-email' className='dark:text-gray-300'>
                  团队邮箱
                </Label>
                <Input
                  id='team-email'
                  type='email'
                  value={teamEmail}
                  onChange={e => setTeamEmail(e.target.value)}
                  className='dark:bg-gray-700 dark:border-gray-600'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='team-description' className='dark:text-gray-300'>
                团队描述
              </Label>
              <Textarea
                id='team-description'
                value={teamDescription}
                onChange={e => setTeamDescription(e.target.value)}
                className='dark:bg-gray-700 dark:border-gray-600 min-h-[80px]'
                placeholder='简要描述你的团队...'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='team-size' className='dark:text-gray-300'>
                  团队规模
                </Label>
                <Select value={teamSize} onValueChange={setTeamSize}>
                  <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='small'>小型（1-10人）</SelectItem>
                    <SelectItem value='medium'>中型（11-50人）</SelectItem>
                    <SelectItem value='large'>大型（51-200人）</SelectItem>
                    <SelectItem value='enterprise'>企业（200+人）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='team-industry' className='dark:text-gray-300'>
                  所属行业
                </Label>
                <Select value={teamIndustry} onValueChange={setTeamIndustry}>
                  <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='technology'>科技</SelectItem>
                    <SelectItem value='finance'>金融</SelectItem>
                    <SelectItem value='education'>教育</SelectItem>
                    <SelectItem value='healthcare'>医疗</SelectItem>
                    <SelectItem value='retail'>零售</SelectItem>
                    <SelectItem value='other'>其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-end'>
              <Button onClick={handleSaveBasicInfo} className='bg-blue-500 hover:bg-blue-600'>
                <Save className='w-4 h-4 mr-2' />
                保存更改
              </Button>
            </div>
          </div>
        </Card>

        {/* 安全设置 */}
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
              <Shield className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>安全设置</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>保护你的团队数据和账户安全</p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>双重认证</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>要求团队成员启用双重认证</p>
              </div>
              <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>IP 白名单</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>仅允许特定 IP 地址访问</p>
              </div>
              <Switch checked={ipWhitelist} onCheckedChange={setIpWhitelist} />
            </div>

            {ipWhitelist && (
              <div className='ml-6 space-y-2'>
                <Label className='dark:text-gray-300'>允许的 IP 地址</Label>
                <Textarea
                  placeholder='每行一个 IP 地址或 CIDR 范围&#10;例如：192.168.1.1&#10;或：192.168.1.0/24'
                  className='dark:bg-gray-700 dark:border-gray-600 min-h-[100px]'
                />
              </div>
            )}

            <Separator className='dark:bg-gray-700' />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='session-timeout' className='dark:text-gray-300'>
                  会话超时
                </Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='1'>1 小时</SelectItem>
                    <SelectItem value='8'>8 小时</SelectItem>
                    <SelectItem value='24'>24 小时</SelectItem>
                    <SelectItem value='168'>7 天</SelectItem>
                    <SelectItem value='720'>30 天</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password-policy' className='dark:text-gray-300'>
                  密码策略
                </Label>
                <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                  <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='basic'>基础（8位以上）</SelectItem>
                    <SelectItem value='medium'>中等（含字母+数字）</SelectItem>
                    <SelectItem value='strong'>强（含大小写+数字+符号）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-end'>
              <Button onClick={handleSaveSecurity} className='bg-blue-500 hover:bg-blue-600'>
                <Save className='w-4 h-4 mr-2' />
                保存更改
              </Button>
            </div>
          </div>
        </Card>

        {/* 权限设置 */}
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
              <Lock className='w-5 h-5 text-green-600 dark:text-green-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>权限设置</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>控制成员的默认权限和访问级别</p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='default-role' className='dark:text-gray-300'>
                新成员默认角色
              </Label>
              <Select value={defaultMemberRole} onValueChange={setDefaultMemberRole}>
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='admin'>管理员</SelectItem>
                  <SelectItem value='member'>成员</SelectItem>
                  <SelectItem value='viewer'>访客</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-gray-500 dark:text-gray-400'>新成员加入团队时自动分配的角色</p>
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>允许访客访问</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>允许非团队成员以访客身份访问共享资源</p>
              </div>
              <Switch checked={allowGuestAccess} onCheckedChange={setAllowGuestAccess} />
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>邀请需要审批</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>新成员加入需要管理员审批</p>
              </div>
              <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
            </div>

            <div className='flex justify-end'>
              <Button onClick={handleSavePermissions} className='bg-blue-500 hover:bg-blue-600'>
                <Save className='w-4 h-4 mr-2' />
                保存更改
              </Button>
            </div>
          </div>
        </Card>

        {/* 通知设置 */}
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30'>
              <Bell className='w-5 h-5 text-orange-600 dark:text-orange-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>通知设置</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>管理团队通知和提醒</p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>邮件通知</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>接收重要活动的邮件通知</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>活动通知</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>成员活动和资源变更通知</p>
              </div>
              <Switch checked={activityNotifications} onCheckedChange={setActivityNotifications} />
            </div>

            <Separator className='dark:bg-gray-700' />

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='dark:text-gray-300'>每周报告</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400'>每周发送团队活动汇总报告</p>
              </div>
              <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
            </div>

            <div className='flex justify-end'>
              <Button onClick={handleSaveNotifications} className='bg-blue-500 hover:bg-blue-600'>
                <Save className='w-4 h-4 mr-2' />
                保存更改
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
