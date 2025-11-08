import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { CreditCard, Download, Calendar, TrendingUp, Check, Zap, Crown, Rocket, ChevronRight, AlertCircle, FileText, DollarSign, Clock, Package, RefreshCw, Settings, Building2, Users, Plus, Smartphone, X, CheckCircle2, Loader2, QrCode, XCircle, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

interface Plan {
  id: string;
  name: string;
  icon: any;
  price: number; // 月价格
  period: string;
  description: string;
  features: string[];
  limits: {
    apiCalls: string;
    tokens: string;
    models: string;
    support: string;
  };
  popular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'alipay' | 'wechat';
  label: string;
  lastFour?: string;
  expiry?: string;
  isDefault?: boolean;
}

type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'failed' | 'timeout';

export function BillingSubscription() {
  const { t } = useLanguage();
  const [currentPlan, setCurrentPlan] = useState('enterprise');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(300); // 5分钟倒计时
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'visa',
      label: 'Visa',
      lastFour: '4242',
      expiry: '12/25',
      isDefault: true,
    },
  ]);

  // 支付表单状态
  const [visaForm, setVisaForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [alipayAccount, setAlipayAccount] = useState('');
  const [wechatAccount, setWechatAccount] = useState('');

  // 支付表单验证错误
  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // 倒计时
  useEffect(() => {
    if (paymentStatus === 'verifying' && (selectedPaymentMethod === 'alipay' || selectedPaymentMethod === 'wechat')) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setPaymentStatus('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [paymentStatus, selectedPaymentMethod]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: '免费版',
      icon: Package,
      price: 0,
      period: '永久免费',
      description: '适合个人开发者和小型项目',
      features: ['基础AI模型访问', '每月1,000次API调用', '社区支持', '基础知识库', '标准响应速度'],
      limits: {
        apiCalls: '1,000/月',
        tokens: '100K/月',
        models: 'GPT-3.5',
        support: '社区',
      },
    },
    {
      id: 'enterprise',
      name: '企业版',
      icon: Zap,
      price: 299,
      period: '每月',
      description: '适合成长型团队和中型企业',
      features: [
        '高级AI模型访问',
        '每月100,000次API调用',
        '优先技术支持',
        '高级知识库管理',
        '快速响应速度',
        '自定义工作流',
        '团队协作功能（最多50人）',
        '数据分析报告',
        'API密钥管理',
        '单点登录(SSO)',
      ],
      limits: {
        apiCalls: '100,000/月',
        tokens: '10M/月',
        models: 'GPT-4, Claude, Gemini',
        support: '邮件+电话支持',
      },
      popular: true,
    },
    {
      id: 'datacenter',
      name: '数据中心版',
      icon: Building2,
      price: 1999,
      period: '每月',
      description: '支持多租户的大型企业级解决方案',
      features: [
        '所有AI模型无限访问',
        '无限API调用',
        '7x24专属技术支持',
        '企业级安全与合规',
        '私有化部署选项',
        '专属客户经理',
        '定制化开发',
        'SLA保障（99.99%可用性）',
        '高级数据分析',
        '多区域部署',
        '多租户架构支持',
        '无限团队成员',
        '白标定制',
        '专属服务器资源',
      ],
      limits: {
        apiCalls: '无限',
        tokens: '无限',
        models: '全部模型+自定义模型',
        support: '专属支持团队',
      },
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      date: '2024-10-01',
      amount: 299,
      status: 'paid',
      description: '企业版订阅 - 10月',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-002',
      date: '2024-09-01',
      amount: 299,
      status: 'paid',
      description: '企业版订阅 - 9月',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-003',
      date: '2024-08-01',
      amount: 299,
      status: 'paid',
      description: '企业版订阅 - 8月',
      downloadUrl: '#',
    },
    {
      id: 'INV-2024-004',
      date: '2024-07-01',
      amount: 299,
      status: 'paid',
      description: '企业版订阅 - 7月',
      downloadUrl: '#',
    },
  ];

  const usageStats = {
    apiCalls: {
      used: 65430,
      limit: 100000,
      percentage: 65,
    },
    tokens: {
      used: 6400000,
      limit: 10000000,
      percentage: 64,
    },
  };

  // 计费周期配置
  const billingCycleConfig = {
    monthly: { months: 1, discount: 0, label: '按月' },
    quarterly: { months: 3, discount: 0.1, label: '按季度' }, // 9折优惠
    yearly: { months: 12, discount: 0.2, label: '按年' }, // 8折优惠
  };

  // 计算价格
  const calculatePrice = (monthlyPrice: number, cycle: BillingCycle) => {
    const config = billingCycleConfig[cycle];
    const totalMonths = config.months;
    const basePrice = monthlyPrice * totalMonths;
    const discountedPrice = basePrice * (1 - config.discount);
    return Math.round(discountedPrice);
  };

  // 获取折扣百分比
  const getDiscountPercentage = (cycle: BillingCycle) => {
    return billingCycleConfig[cycle].discount * 100;
  };

  // 获取节省金额
  const getSavings = (monthlyPrice: number, cycle: BillingCycle) => {
    const config = billingCycleConfig[cycle];
    const totalMonths = config.months;
    const basePrice = monthlyPrice * totalMonths;
    const discountedPrice = calculatePrice(monthlyPrice, cycle);
    return basePrice - discountedPrice;
  };

  // 验证信用卡表单
  const validateVisaForm = (): boolean => {
    const errors = {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    };

    // 验证卡号（简单验证16位数字）
    const cardNumberClean = visaForm.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      errors.cardNumber = '请输入卡号';
    } else if (!/^\d{13,19}$/.test(cardNumberClean)) {
      errors.cardNumber = '请输入有效的卡号';
    }

    // 验证持卡人姓名
    if (!visaForm.cardName.trim()) {
      errors.cardName = '请输入持卡人姓名';
    } else if (visaForm.cardName.length < 2) {
      errors.cardName = '姓名至少2个字符';
    }

    // 验证有效期
    if (!visaForm.expiry) {
      errors.expiry = '请输入有效期';
    } else if (!/^\d{2}\/\d{2}$/.test(visaForm.expiry)) {
      errors.expiry = '格式：MM/YY';
    }

    // 验证CVV
    if (!visaForm.cvv) {
      errors.cvv = '请输入CVV';
    } else if (!/^\d{3,4}$/.test(visaForm.cvv)) {
      errors.cvv = '请输入3-4位数字';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  // 生成二维码（模拟）
  const generateQRCode = (paymentType: 'alipay' | 'wechat'): string => {
    // 实际应用中，这里应该调用后端API生成真实的支付二维码
    const orderId = `ORDER-${Date.now()}`;
    const amount = plans.find(p => p.id === selectedPlan)?.price || 0;
    return `https://api.example.com/qr/${paymentType}?order=${orderId}&amount=${amount}`;
  };

  // 轮询支付状态（模拟）
  const startPaymentPolling = () => {
    let pollCount = 0;
    pollingIntervalRef.current = setInterval(() => {
      pollCount++;

      // 模拟：5次轮询后支付成功（实际应用中调用后端API查询状态）
      if (pollCount >= 5) {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        handlePaymentSuccess();
      }
    }, 2000);
  };

  // 处理支付成功
  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    const plan = plans.find(p => p.id === selectedPlan);

    setTimeout(() => {
      setCurrentPlan(selectedPlan || currentPlan);
      setShowPaymentDialog(false);
      setPaymentStatus('idle');
      setCountdown(300);
      toast.success(`恭喜！已成功升级到${plan?.name}`);
    }, 2000);
  };

  // 处理支付失败
  const handlePaymentFailed = (error: string) => {
    setPaymentStatus('failed');
    toast.error(error || '支付失败，请重试');
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setBillingCycle('monthly'); // 重置计费周期为月付
    if (planId === 'free') {
      // 免费计划直接显示确认对话框
      setShowUpgradeDialog(true);
    } else {
      // 付费计划先显示升级确认对话框（包含计费周期选择）
      setShowUpgradeDialog(true);
    }
  };

  const confirmUpgrade = () => {
    setShowUpgradeDialog(false);

    // 如果是免费计划，直接完成切换
    if (selectedPlan === 'free') {
      setCurrentPlan('free');
      toast.success('已切换到免费计划');
      return;
    }

    // 付费计划：打开支付弹窗
    setShowPaymentDialog(true);
    setPaymentStatus('idle');
    setCountdown(300);
  };

  // 处理支付提交
  const handlePaymentSubmit = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // Visa支付流程
    if (selectedPaymentMethod === 'visa') {
      // 验证表单
      if (!validateVisaForm()) {
        return;
      }

      setPaymentStatus('processing');

      // 模拟支付处理
      setTimeout(() => {
        // 模拟80%成功率
        if (Math.random() > 0.2) {
          handlePaymentSuccess();
        } else {
          handlePaymentFailed('银行卡验证失败，请检查卡片信息');
          setTimeout(() => {
            setPaymentStatus('idle');
          }, 3000);
        }
      }, 2000);
    }
    // 支付宝/微信支付流程
    else if (selectedPaymentMethod === 'alipay' || selectedPaymentMethod === 'wechat') {
      setPaymentStatus('processing');

      // 生成二维码
      setTimeout(() => {
        const qrUrl = generateQRCode(selectedPaymentMethod);
        setQrCodeUrl(qrUrl);
        setPaymentStatus('verifying');

        // 开始轮询支付状态
        startPaymentPolling();
      }, 1000);
    }
  };

  // 取消支付
  const handleCancelPayment = () => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setPaymentStatus('idle');
    setCountdown(300);
    setQrCodeUrl('');
  };

  // 重试支付
  const handleRetryPayment = () => {
    setPaymentStatus('idle');
    setCountdown(300);
    setQrCodeUrl('');
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: selectedPaymentMethod as 'visa' | 'alipay' | 'wechat',
      label: selectedPaymentMethod === 'visa' ? 'Visa' : selectedPaymentMethod === 'alipay' ? '支付宝' : '微信支付',
      lastFour: selectedPaymentMethod === 'visa' ? visaForm.cardNumber.slice(-4) : undefined,
      expiry: selectedPaymentMethod === 'visa' ? visaForm.expiry : undefined,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentDialog(false);

    // 重置表单
    setVisaForm({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    setAlipayAccount('');
    setWechatAccount('');

    toast.success('支付方式已添加');
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`正在下载账单 ${invoice.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return t('billing.paid');
      case 'pending':
        return t('billing.pending');
      case 'failed':
        return t('billing.failed');
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <CreditCard className='w-5 h-5 text-white' />;
      case 'alipay':
        return <Smartphone className='w-5 h-5 text-white' />;
      case 'wechat':
        return <Smartphone className='w-5 h-5 text-white' />;
      default:
        return <CreditCard className='w-5 h-5 text-white' />;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case 'visa':
        return 'from-blue-500 to-purple-600';
      case 'alipay':
        return 'from-blue-400 to-blue-600';
      case 'wechat':
        return 'from-green-400 to-green-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  // 格式化倒计时
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 渲染支付状态界面
  const renderPaymentStatusView = () => {
    const plan = plans.find(p => p.id === selectedPlan);

    // 处理中
    if (paymentStatus === 'processing') {
      return (
        <div className='py-12 text-center'>
          <Loader2 className='w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin' />
          <h3 className='text-lg dark:text-white mb-2'>正在处理支付</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>请稍候，正在与银行通讯...</p>
        </div>
      );
    }

    // 等待扫码（支付宝/微信）
    if (paymentStatus === 'verifying' && (selectedPaymentMethod === 'alipay' || selectedPaymentMethod === 'wechat')) {
      return (
        <div className='py-8 text-center'>
          <div className='mb-4'>
            <Badge className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'>
              等待支付
            </Badge>
          </div>

          <div className='w-64 h-64 mx-auto mb-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center relative'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <QrCode className='w-48 h-48 text-gray-300 dark:text-gray-600' />
            </div>
            <div className='relative z-10 bg-white dark:bg-gray-800 p-2 rounded'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {selectedPaymentMethod === 'alipay' ? '支付宝二维码' : '微信支付二维码'}
              </p>
            </div>
          </div>

          <div className='space-y-2 mb-6'>
            <p className='dark:text-white'>
              请使用{selectedPaymentMethod === 'alipay' ? '支付宝' : '微信'}
              扫码支付
            </p>
            <p className='text-2xl dark:text-white'>¥{plan?.price}</p>
            <div className='flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <Clock className='w-4 h-4' />
              <span>剩余时间: {formatCountdown(countdown)}</span>
            </div>
          </div>

          <div className='flex items-center justify-center gap-2 mb-4'>
            <Loader2 className='w-4 h-4 animate-spin text-blue-500' />
            <span className='text-sm text-gray-600 dark:text-gray-400'>正在等待支付确认...</span>
          </div>

          <Button variant='outline' onClick={handleCancelPayment} className='w-full'>
            取消支付
          </Button>
        </div>
      );
    }

    // 支付成功
    if (paymentStatus === 'success') {
      return (
        <div className='py-12 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
            <CheckCircle2 className='w-10 h-10 text-green-600 dark:text-green-400' />
          </div>
          <h3 className='text-lg dark:text-white mb-2'>支付成功！</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>已成功升级到{plan?.name}</p>
        </div>
      );
    }

    // 支付失败
    if (paymentStatus === 'failed') {
      return (
        <div className='py-12 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
            <XCircle className='w-10 h-10 text-red-600 dark:text-red-400' />
          </div>
          <h3 className='text-lg dark:text-white mb-2'>支付失败</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>抱歉，支付未能完成，请重试</p>
          <Button onClick={handleRetryPayment} className='bg-blue-500 hover:bg-blue-600'>
            重新支付
          </Button>
        </div>
      );
    }

    // 支付超时
    if (paymentStatus === 'timeout') {
      return (
        <div className='py-12 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center'>
            <Clock className='w-10 h-10 text-yellow-600 dark:text-yellow-400' />
          </div>
          <h3 className='text-lg dark:text-white mb-2'>支付超时</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>二维码已过期，请重新发起支付</p>
          <Button onClick={handleRetryPayment} className='bg-blue-500 hover:bg-blue-600'>
            重新支付
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl dark:text-white mb-2'>{t('billing.title')}</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>{t('billing.subtitle')}</p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <h2 className='text-xl dark:text-white'>当前计划: 企业版</h2>
                <Badge className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'>
                  活跃
                </Badge>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>下次续费日期: 2024-11-01</p>
            </div>
          </div>
          <Button variant='outline' className='dark:bg-gray-700 dark:border-gray-600'>
            <Settings className='w-4 h-4 mr-2' />
            管理订阅
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>API调用使用量</span>
              <span className='text-sm dark:text-white'>
                {usageStats.apiCalls.used.toLocaleString()} / {usageStats.apiCalls.limit.toLocaleString()}
              </span>
            </div>
            <Progress value={usageStats.apiCalls.percentage} className='h-2' />
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              本月已使用 {usageStats.apiCalls.percentage}%
            </p>
          </div>

          <div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>令牌使用量</span>
              <span className='text-sm dark:text-white'>
                {(usageStats.tokens.used / 1000000).toFixed(1)}M / {(usageStats.tokens.limit / 1000000).toFixed(1)}M
              </span>
            </div>
            <Progress value={usageStats.tokens.percentage} className='h-2' />
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>本月已使用 {usageStats.tokens.percentage}%</p>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className='text-xl dark:text-white mb-6'>选择适合您的计划</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`p-6 relative ${
                plan.popular ? 'border-2 border-blue-500 dark:border-blue-500' : 'dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white border-0'>
                  最受欢迎
                </Badge>
              )}

              <div className='text-center mb-6'>
                <div className='inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4'>
                  <plan.icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-xl dark:text-white mb-2'>{plan.name}</h3>
                <div className='mb-2'>
                  <span className='text-3xl dark:text-white'>{plan.price === 0 ? '免费' : `¥${plan.price}`}</span>
                  {plan.price > 0 && <span className='text-sm text-gray-600 dark:text-gray-400'>/月</span>}
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{plan.description}</p>
              </div>

              <div className='space-y-3 mb-6'>
                {plan.features.map((feature, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                    <span className='text-sm dark:text-gray-300'>{feature}</span>
                  </div>
                ))}
              </div>

              <Separator className='my-4 dark:bg-gray-700' />

              <div className='space-y-2 mb-6'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>API调用</span>
                  <span className='dark:text-gray-300'>{plan.limits.apiCalls}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>令牌</span>
                  <span className='dark:text-gray-300'>{plan.limits.tokens}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>模型</span>
                  <span className='dark:text-gray-300'>{plan.limits.models}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>支持</span>
                  <span className='dark:text-gray-300'>{plan.limits.support}</span>
                </div>
              </div>

              <Button
                className={`w-full ${
                  currentPlan === plan.id
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : plan.popular
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : ''
                }`}
                variant={currentPlan === plan.id ? 'default' : plan.popular ? 'default' : 'outline'}
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id || plan.id === 'free'}
              >
                {currentPlan === plan.id ? '当前计划' : '升级'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
              <CreditCard className='w-5 h-5 text-green-600 dark:text-green-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>支付方式</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>管理您的支付方式</p>
            </div>
          </div>
          <Button
            variant='outline'
            className='dark:bg-gray-700 dark:border-gray-600'
            onClick={() => setShowAddPaymentDialog(true)}
          >
            <Plus className='w-4 h-4 mr-2' />
            添加支付方式
          </Button>
        </div>

        <div className='space-y-4'>
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
            >
              <div className='flex items-center gap-4'>
                <div className={`p-2 rounded bg-gradient-to-br ${getPaymentMethodColor(method.type)}`}>
                  {getPaymentMethodIcon(method.type)}
                </div>
                <div>
                  <div className='dark:text-white mb-1'>
                    {method.type === 'visa' && `Visa •••• ${method.lastFour}`}
                    {method.type === 'alipay' && '支付宝'}
                    {method.type === 'wechat' && '微信支付'}
                  </div>
                  {method.expiry && (
                    <div className='text-sm text-gray-600 dark:text-gray-400'>过期日期: {method.expiry}</div>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {method.isDefault && (
                  <Badge className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'>
                    默认
                  </Badge>
                )}
                <Button variant='ghost' size='sm'>
                  编辑
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invoices */}
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
              <FileText className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            </div>
            <div>
              <h2 className='text-lg dark:text-white'>账单历史</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>查看和下载历史账单</p>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          {invoices.map(invoice => (
            <div
              key={invoice.id}
              className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900'
            >
              <div className='flex items-center gap-4'>
                <div className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700'>
                  <FileText className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='dark:text-white'>{invoice.id}</span>
                    <Badge className={`${getStatusColor(invoice.status)} border-0 text-xs`}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>{invoice.description}</div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <div className='dark:text-white'>¥{invoice.amount}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>{invoice.date}</div>
                </div>
                <Button variant='ghost' size='sm' onClick={() => handleDownloadInvoice(invoice)}>
                  <Download className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Downgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>确认订阅变更</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>您即将变更订阅计划</DialogDescription>
          </DialogHeader>

          <div className='py-4 space-y-4'>
            {/* Billing Cycle Selector - 仅付费计划显示 */}
            {selectedPlan !== 'free' && (
              <div>
                <Label className='dark:text-white mb-2 block'>选择计费周期</Label>
                <div className='flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 px-4 py-2.5 rounded text-sm transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <div className='text-center'>
                      <div>按月付</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>灵活</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('quarterly')}
                    className={`flex-1 px-4 py-2.5 rounded text-sm transition-all relative ${
                      billingCycle === 'quarterly'
                        ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <div className='text-center'>
                      <div>按季付</div>
                      <div className='text-xs text-green-600 dark:text-green-400 mt-0.5'>省10%</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 px-4 py-2.5 rounded text-sm transition-all relative ${
                      billingCycle === 'yearly'
                        ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <div className='text-center'>
                      <div>按年付</div>
                      <div className='text-xs text-blue-600 dark:text-blue-400 mt-0.5'>省20%</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 订阅详情 */}
            {selectedPlan && plans.find(p => p.id === selectedPlan) && (
              <div className='p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                <h3 className='dark:text-white mb-3'>订阅详情</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>新计划：</span>
                    <span className='dark:text-white'>{plans.find(p => p.id === selectedPlan)?.name}</span>
                  </div>
                  {selectedPlan !== 'free' && (
                    <>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>计费周期：</span>
                        <span className='dark:text-white'>{billingCycleConfig[billingCycle].label}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>费用：</span>
                        <span className='dark:text-white'>
                          ¥{calculatePrice(plans.find(p => p.id === selectedPlan)?.price || 0, billingCycle)}/
                          {billingCycleConfig[billingCycle].label}
                        </span>
                      </div>
                      {billingCycle !== 'monthly' && (
                        <div className='flex justify-between text-green-600 dark:text-green-400'>
                          <span>优惠折扣：</span>
                          <span>
                            -{getDiscountPercentage(billingCycle)}% (节省 ¥
                            {getSavings(plans.find(p => p.id === selectedPlan)?.price || 0, billingCycle)})
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5' />
                <div className='text-sm text-blue-600 dark:text-blue-400'>
                  <p className='mb-2'>订阅变更说明：</p>
                  <ul className='list-disc list-inside space-y-1 ml-2'>
                    <li>升级立即生效，费用按比例计算</li>
                    <li>可随时取消订阅，不收取额外费用</li>
                    <li>降级将在当前计费周期结束后生效</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowUpgradeDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmUpgrade} className='bg-blue-500 hover:bg-blue-600'>
              确认变更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onOpenChange={open => {
          if (!open && paymentStatus !== 'idle') {
            handleCancelPayment();
          }
          setShowPaymentDialog(open);
        }}
      >
        <DialogContent className='sm:max-w-[650px] max-h-[90vh] dark:bg-gray-800 dark:border-gray-700 flex flex-col'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle className='dark:text-white'>完成支付</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              {paymentStatus === 'idle' ? '选择支付方式完成订阅升级' : ''}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='flex-1 max-h-[calc(90vh-180px)]'>
            <div className='px-1 pb-4'>
              {/* 如果有支付状态，显示状态界面 */}
              {paymentStatus !== 'idle' ? (
                renderPaymentStatusView()
              ) : (
                <div className='space-y-3'>
                  {/* Billing Cycle Selector */}
                  <div>
                    <Label className='dark:text-white mb-2 block text-sm'>选择计费周期</Label>
                    <div className='flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`flex-1 px-4 py-2.5 rounded text-sm transition-all ${
                          billingCycle === 'monthly'
                            ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <div className='text-center'>
                          <div>按月付</div>
                          <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>灵活</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setBillingCycle('quarterly')}
                        className={`flex-1 px-4 py-2.5 rounded text-sm transition-all relative ${
                          billingCycle === 'quarterly'
                            ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <div className='text-center'>
                          <div>按季付</div>
                          <div className='text-xs text-green-600 dark:text-green-400 mt-0.5'>省10%</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`flex-1 px-4 py-2.5 rounded text-sm transition-all relative ${
                          billingCycle === 'yearly'
                            ? 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <div className='text-center'>
                          <div>按年付</div>
                          <div className='text-xs text-blue-600 dark:text-blue-400 mt-0.5'>省20%</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className='p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between text-sm mb-1.5'>
                      <span className='text-gray-600 dark:text-gray-400'>订阅计划</span>
                      <span className='dark:text-white'>{plans.find(p => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600 dark:text-gray-400'>计费周期</span>
                      <span className='dark:text-white'>{billingCycleConfig[billingCycle].label}</span>
                    </div>
                    {billingCycle !== 'monthly' && selectedPlan && plans.find(p => p.id === selectedPlan) && (
                      <div className='flex items-center justify-between text-sm mb-2'>
                        <span className='text-gray-600 dark:text-gray-400'>优惠折扣</span>
                        <span className='text-green-600 dark:text-green-400'>
                          -{getDiscountPercentage(billingCycle)}%
                        </span>
                      </div>
                    )}
                    <Separator className='my-2 dark:bg-gray-700' />
                    {selectedPlan && plans.find(p => p.id === selectedPlan) && (
                      <>
                        {billingCycle !== 'monthly' && (
                          <div className='flex items-center justify-between text-sm mb-1'>
                            <span className='text-gray-600 dark:text-gray-400'>原价</span>
                            <span className='text-gray-500 dark:text-gray-400 line-through text-sm'>
                              ¥
                              {(plans.find(p => p.id === selectedPlan)?.price || 0) *
                                billingCycleConfig[billingCycle].months}
                            </span>
                          </div>
                        )}
                        <div className='flex items-center justify-between mb-3'>
                          <span className='dark:text-white'>应付金额</span>
                          <span className='text-lg dark:text-white'>
                            ¥{calculatePrice(plans.find(p => p.id === selectedPlan)?.price || 0, billingCycle)}
                          </span>
                        </div>
                        {billingCycle !== 'monthly' && (
                          <div className='text-xs text-green-600 dark:text-green-400 mb-3 text-right'>
                            节省 ¥{getSavings(plans.find(p => p.id === selectedPlan)?.price || 0, billingCycle)}
                          </div>
                        )}
                      </>
                    )}
                    {/* Security Notice */}
                    <div className='flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800'>
                      <CheckCircle2 className='w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
                      <p className='text-xs text-green-600 dark:text-green-400 leading-tight'>
                        SSL加密传输，不存储完整卡号
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <Label className='dark:text-white mb-2 block text-sm'>选择支付方式</Label>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <div className='grid grid-cols-3 gap-2'>
                        {/* Visa */}
                        <div className='flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer'>
                          <RadioGroupItem value='visa' id='visa' className='mb-2' />
                          <label htmlFor='visa' className='flex flex-col items-center gap-2 cursor-pointer text-center'>
                            <div className='p-2 rounded bg-gradient-to-br from-blue-500 to-purple-600'>
                              <CreditCard className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <div className='dark:text-white text-sm mb-0.5'>信用卡</div>
                              <div className='text-xs text-gray-600 dark:text-gray-400'>Visa等</div>
                            </div>
                          </label>
                        </div>

                        {/* Alipay */}
                        <div className='flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer'>
                          <RadioGroupItem value='alipay' id='alipay' className='mb-2' />
                          <label
                            htmlFor='alipay'
                            className='flex flex-col items-center gap-2 cursor-pointer text-center'
                          >
                            <div className='p-2 rounded bg-gradient-to-br from-blue-400 to-blue-600'>
                              <Smartphone className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <div className='dark:text-white text-sm mb-0.5'>支付宝</div>
                              <div className='text-xs text-gray-600 dark:text-gray-400'>扫码</div>
                            </div>
                          </label>
                        </div>

                        {/* WeChat Pay */}
                        <div className='flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer'>
                          <RadioGroupItem value='wechat' id='wechat' className='mb-2' />
                          <label
                            htmlFor='wechat'
                            className='flex flex-col items-center gap-2 cursor-pointer text-center'
                          >
                            <div className='p-2 rounded bg-gradient-to-br from-green-400 to-green-600'>
                              <Smartphone className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <div className='dark:text-white text-sm mb-0.5'>微信支付</div>
                              <div className='text-xs text-gray-600 dark:text-gray-400'>扫码</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Form based on selection */}
                  {selectedPaymentMethod === 'visa' && (
                    <div className='space-y-2.5 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                      <div className='space-y-1'>
                        <Label htmlFor='cardNumber' className='dark:text-white text-sm'>
                          卡号 *
                        </Label>
                        <Input
                          id='cardNumber'
                          placeholder='1234 5678 9012 3456'
                          value={visaForm.cardNumber}
                          onChange={e => {
                            setVisaForm({
                              ...visaForm,
                              cardNumber: e.target.value,
                            });
                            setFormErrors({ ...formErrors, cardNumber: '' });
                          }}
                          className={`dark:bg-gray-800 dark:border-gray-600 ${
                            formErrors.cardNumber ? 'border-red-500' : ''
                          }`}
                          maxLength={19}
                        />
                        {formErrors.cardNumber && <p className='text-xs text-red-500'>{formErrors.cardNumber}</p>}
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor='cardName' className='dark:text-white text-sm'>
                          持卡人姓名 *
                        </Label>
                        <Input
                          id='cardName'
                          placeholder='ZHANG SAN'
                          value={visaForm.cardName}
                          onChange={e => {
                            setVisaForm({
                              ...visaForm,
                              cardName: e.target.value,
                            });
                            setFormErrors({ ...formErrors, cardName: '' });
                          }}
                          className={`dark:bg-gray-800 dark:border-gray-600 ${
                            formErrors.cardName ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.cardName && <p className='text-xs text-red-500'>{formErrors.cardName}</p>}
                      </div>
                      <div className='grid grid-cols-2 gap-2.5'>
                        <div className='space-y-1'>
                          <Label htmlFor='expiry' className='dark:text-white text-sm'>
                            有效期 *
                          </Label>
                          <Input
                            id='expiry'
                            placeholder='MM/YY'
                            value={visaForm.expiry}
                            onChange={e => {
                              setVisaForm({
                                ...visaForm,
                                expiry: e.target.value,
                              });
                              setFormErrors({ ...formErrors, expiry: '' });
                            }}
                            className={`dark:bg-gray-800 dark:border-gray-600 ${
                              formErrors.expiry ? 'border-red-500' : ''
                            }`}
                            maxLength={5}
                          />
                          {formErrors.expiry && <p className='text-xs text-red-500'>{formErrors.expiry}</p>}
                        </div>
                        <div className='space-y-1'>
                          <Label htmlFor='cvv' className='dark:text-white text-sm'>
                            CVV *
                          </Label>
                          <Input
                            id='cvv'
                            placeholder='123'
                            type='password'
                            value={visaForm.cvv}
                            onChange={e => {
                              setVisaForm({ ...visaForm, cvv: e.target.value });
                              setFormErrors({ ...formErrors, cvv: '' });
                            }}
                            className={`dark:bg-gray-800 dark:border-gray-600 ${
                              formErrors.cvv ? 'border-red-500' : ''
                            }`}
                            maxLength={4}
                          />
                          {formErrors.cvv && <p className='text-xs text-red-500'>{formErrors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'alipay' && (
                    <div className='p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center'>
                      <Smartphone className='w-8 h-8 mx-auto mb-1.5 text-blue-500' />
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                        点击"确认支付"后将生成支付宝二维码
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-500'>请准备好支付宝APP扫码支付</p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'wechat' && (
                    <div className='p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center'>
                      <Smartphone className='w-8 h-8 mx-auto mb-1.5 text-green-500' />
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                        点击"确认支付"后将生成微信支付二维码
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-500'>请准备好微信APP扫码支付</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {paymentStatus === 'idle' && (
            <DialogFooter className='flex-shrink-0'>
              <Button variant='outline' onClick={() => setShowPaymentDialog(false)}>
                取消
              </Button>
              <Button onClick={handlePaymentSubmit} className='bg-blue-500 hover:bg-blue-600'>
                {selectedPaymentMethod === 'visa' ? '立即支付' : '确认支付'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className='sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>添加支付方式</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>添加新的支付方式到您的账户</DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {/* Payment Method Type Selection */}
            <div>
              <Label className='dark:text-white mb-3 block'>支付方式类型</Label>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <RadioGroupItem value='visa' id='add-visa' />
                    <label htmlFor='add-visa' className='flex items-center gap-3 flex-1 cursor-pointer'>
                      <CreditCard className='w-5 h-5 text-blue-500' />
                      <span className='dark:text-white'>信用卡 / 借记卡</span>
                    </label>
                  </div>
                  <div className='flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <RadioGroupItem value='alipay' id='add-alipay' />
                    <label htmlFor='add-alipay' className='flex items-center gap-3 flex-1 cursor-pointer'>
                      <Smartphone className='w-5 h-5 text-blue-500' />
                      <span className='dark:text-white'>支付宝</span>
                    </label>
                  </div>
                  <div className='flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <RadioGroupItem value='wechat' id='add-wechat' />
                    <label htmlFor='add-wechat' className='flex items-center gap-3 flex-1 cursor-pointer'>
                      <Smartphone className='w-5 h-5 text-green-500' />
                      <span className='dark:text-white'>微信支付</span>
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Form based on payment type */}
            {selectedPaymentMethod === 'visa' && (
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='add-cardNumber' className='dark:text-white'>
                    卡号
                  </Label>
                  <Input
                    id='add-cardNumber'
                    placeholder='1234 5678 9012 3456'
                    value={visaForm.cardNumber}
                    onChange={e => setVisaForm({ ...visaForm, cardNumber: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='add-cardName' className='dark:text-white'>
                    持卡人姓名
                  </Label>
                  <Input
                    id='add-cardName'
                    placeholder='ZHANG SAN'
                    value={visaForm.cardName}
                    onChange={e => setVisaForm({ ...visaForm, cardName: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='add-expiry' className='dark:text-white'>
                      有效期
                    </Label>
                    <Input
                      id='add-expiry'
                      placeholder='MM/YY'
                      value={visaForm.expiry}
                      onChange={e => setVisaForm({ ...visaForm, expiry: e.target.value })}
                      className='dark:bg-gray-750 dark:border-gray-600'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-cvv' className='dark:text-white'>
                      CVV
                    </Label>
                    <Input
                      id='add-cvv'
                      placeholder='123'
                      type='password'
                      value={visaForm.cvv}
                      onChange={e => setVisaForm({ ...visaForm, cvv: e.target.value })}
                      className='dark:bg-gray-750 dark:border-gray-600'
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'alipay' && (
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='alipay-account' className='dark:text-white'>
                    支付宝账号
                  </Label>
                  <Input
                    id='alipay-account'
                    placeholder='手机号或邮箱'
                    value={alipayAccount}
                    onChange={e => setAlipayAccount(e.target.value)}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>绑定后，可以快速使用支付宝完成支付</p>
              </div>
            )}

            {selectedPaymentMethod === 'wechat' && (
              <div className='space-y-4'>
                <div className='p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center'>
                  <Smartphone className='w-12 h-12 mx-auto mb-3 text-green-500' />
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>请使用微信扫描下方二维码进行绑定</p>
                  <div className='w-32 h-32 mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center'>
                    <p className='text-xs text-gray-500'>绑定二维码</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowAddPaymentDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddPaymentMethod} className='bg-blue-500 hover:bg-blue-600'>
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
