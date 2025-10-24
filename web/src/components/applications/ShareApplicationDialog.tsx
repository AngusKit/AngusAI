import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Copy,
  Eye,
  Globe,
  Link2,
  Lock,
  Mail,
  QrCode,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Application {
  id: number;
  name: string;
  description: string;
  status: '草稿' | '已发布' | '已暂停';
}

interface ShareApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
}

export function ShareApplicationDialog({
  open,
  onOpenChange,
  application,
}: ShareApplicationDialogProps) {
  const [shareLink, setShareLink] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [requireAuth, setRequireAuth] = useState(false);

  // 生成分享链接
  const generateShareLink = () => {
    if (application) {
      const link = `https://angusai.app/apps/${application.id}`;
      setShareLink(link);
      return link;
    }
    return '';
  };

  // 生成嵌入代码
  const generateEmbedCode = () => {
    if (application) {
      const code = `<iframe src="https://angusai.app/embed/${application.id}" width="400" height="600" frameborder="0"></iframe>`;
      setEmbedCode(code);
      return code;
    }
    return '';
  };

  // 打开对话框时生成链接
  useState(() => {
    if (open && application) {
      generateShareLink();
      generateEmbedCode();
    }
  });

  const handleCopyLink = () => {
    const link = shareLink || generateShareLink();
    navigator.clipboard.writeText(link);
    toast.success('链接已复制到剪贴板');
  };

  const handleCopyEmbedCode = () => {
    const code = embedCode || generateEmbedCode();
    navigator.clipboard.writeText(code);
    toast.success('嵌入代码已复制到剪贴板');
  };

  const handleEmailShare = () => {
    const link = shareLink || generateShareLink();
    const subject = encodeURIComponent(`分享应用: ${application?.name}`);
    const body = encodeURIComponent(
      `查看这个AI应用: ${application?.name}\n\n${application?.description}\n\n链接: ${link}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success('已打开邮件客户端');
  };

  const handleGenerateQRCode = () => {
    toast.info('二维码生成功能即将上线');
  };

  if (!application) return null;

  const canShare = application.status === '已发布';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl dark:bg-gray-800 dark:border-gray-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>分享应用</DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            通过多种方式分享您的应用给其他人
          </DialogDescription>
        </DialogHeader>

        {!canShare && (
          <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <div className='flex items-start gap-3'>
              <Lock className='w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                  应用当前状态为「{application.status}」，需要发布后才能分享
                </p>
                <p className='text-xs text-yellow-700 dark:text-yellow-300 mt-1'>
                  请先发布应用，然后再进行分享
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue='link' className='mt-4'>
          <TabsList className='grid w-full grid-cols-3 dark:bg-gray-900'>
            <TabsTrigger
              value='link'
              className='dark:data-[state=active]:bg-gray-700 dark:text-gray-300'
            >
              <Link2 className='w-4 h-4 mr-2' />
              分享链接
            </TabsTrigger>
            <TabsTrigger
              value='embed'
              className='dark:data-[state=active]:bg-gray-700 dark:text-gray-300'
            >
              <Globe className='w-4 h-4 mr-2' />
              嵌入网页
            </TabsTrigger>
            <TabsTrigger
              value='settings'
              className='dark:data-[state=active]:bg-gray-700 dark:text-gray-300'
            >
              <Users className='w-4 h-4 mr-2' />
              访问设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value='link' className='space-y-4 mt-6'>
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>分享链接</Label>
              <div className='flex gap-2'>
                <Input
                  value={shareLink || generateShareLink()}
                  readOnly
                  className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
                />
                <Button
                  onClick={handleCopyLink}
                  disabled={!canShare}
                  className='shrink-0'
                >
                  <Copy className='w-4 h-4 mr-2' />
                  复制
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <Button
                variant='outline'
                onClick={handleEmailShare}
                disabled={!canShare}
                className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              >
                <Mail className='w-4 h-4 mr-2' />
                通过邮件分享
              </Button>
              <Button
                variant='outline'
                onClick={handleGenerateQRCode}
                disabled={!canShare}
                className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              >
                <QrCode className='w-4 h-4 mr-2' />
                生成二维码
              </Button>
            </div>

            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <Eye className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>
                    任何拥有此链接的人都可以访问您的应用
                  </p>
                  <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                    您可以在「访问设置」中配置更详细的权限控制
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='embed' className='space-y-4 mt-6'>
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>嵌入代码</Label>
              <div className='relative'>
                <Textarea
                  value={embedCode || generateEmbedCode()}
                  readOnly
                  rows={5}
                  className='dark:bg-gray-900 dark:border-gray-700 dark:text-white font-mono text-sm resize-none'
                />
                <Button
                  size='sm'
                  onClick={handleCopyEmbedCode}
                  disabled={!canShare}
                  className='absolute top-2 right-2'
                >
                  <Copy className='w-4 h-4 mr-1' />
                  复制
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              <h4 className='text-sm dark:text-white'>嵌入预览</h4>
              <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-gray-50 dark:bg-gray-900'>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md mx-auto'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg'></div>
                    <div>
                      <div className='dark:text-white'>{application.name}</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        在线
                      </div>
                    </div>
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {application.description}
                  </div>
                </div>
              </div>
            </div>

            <div className='p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <Globe className='w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm text-purple-800 dark:text-purple-200'>
                    将此代码复制到您的网站中，即可嵌入应用
                  </p>
                  <p className='text-xs text-purple-700 dark:text-purple-300 mt-1'>
                    支持自定义宽度和高度，适配任何页面布局
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='settings' className='space-y-6 mt-6'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                <div className='flex-1'>
                  <Label className='text-sm dark:text-white'>公开访问</Label>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    允许任何人通过链接访问应用
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  disabled={!canShare}
                />
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                <div className='flex-1'>
                  <Label className='text-sm dark:text-white'>匿名访问</Label>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    允许未登录用户访问应用
                  </p>
                </div>
                <Switch
                  checked={allowAnonymous}
                  onCheckedChange={setAllowAnonymous}
                  disabled={!canShare || !isPublic}
                />
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                <div className='flex-1'>
                  <Label className='text-sm dark:text-white'>需要授权</Label>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    只有授权用户才可访问
                  </p>
                </div>
                <Switch
                  checked={requireAuth}
                  onCheckedChange={setRequireAuth}
                  disabled={!canShare || !isPublic}
                />
              </div>
            </div>

            <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <Users className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm text-green-800 dark:text-green-200'>
                    当前设置：
                    {isPublic
                      ? allowAnonymous
                        ? ' 公开访问，允许匿名用户'
                        : ' 公开访问，需要登录'
                      : ' 私有应用，仅限邀请'}
                  </p>
                  <p className='text-xs text-green-700 dark:text-green-300 mt-1'>
                    您可以随时更改这些设置
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
