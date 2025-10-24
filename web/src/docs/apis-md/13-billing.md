# 计费订阅模块 API

**Figma来源**：计费订阅页面、订阅计划选择、支付对话框、发票管理  
**模块说明**：订阅计划、支付处理、发票管理、使用量查询等功能

## 目录

- [获取订阅计划](#获取订阅计划)
- [获取当前订阅](#获取当前订阅)
- [创建订阅](#创建订阅)
- [更改订阅计划](#更改订阅计划)
- [取消订阅](#取消订阅)
- [支付方式管理](#支付方式管理)
- [发票管理](#发票管理)
- [使用量查询](#使用量查询)

---

## 获取订阅计划列表

**接口路径**：`GET /api/v1/billing/plans`  
**接口说明**：获取可用的订阅计划列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  billingCycle?: 'monthly' | 'quarterly' | 'yearly';  // 计费周期
}
```

**Figma对应**：

- 计费周期切换（月付/季付/年付）
- 订阅计划卡片

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: string;
        name: string;          // "免费版", "专业版", "企业版"
        nameEn: string;
        icon: string;          // 图标名称

        // 定价
        price: number;         // 月价格
        originalPrice?: number; // 原价（优惠时）
        yearlyPrice?: number;  // 年价格
        discount?: string;     // "节省20%"
        currency: string;      // "CNY"
        period: string;        // "/月"

        description: string;
        popular?: boolean;     // 是否热门

        // 功能特性
        features: string[];

        // 限制额度
        limits: {
          apiCalls: string;    // "10,000次/月"
          apiCallsRaw: number;
          tokens: string;      // "100K tokens"
          tokensRaw: number;
          models: string;      // "3个模型"
          modelsRaw: number;
          storage: string;     // "10GB"
          storageRaw: number;  // 字节
          members: string;     // "5人"
          membersRaw: number;
          support: string;     // "邮件支持"
        };

        // 附加功能
        addons?: Array<{
          id: string;
          name: string;
          price: number;
        }>;
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 订阅计划卡片网格
- 每个卡片显示：名称、价格、功能列表、限制、订阅按钮

---

## 获取当前订阅

**接口路径**：`GET /api/v1/billing/subscription`  
**接口说明**：获取用户当前的订阅信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    subscriptionId: number;
    planId: string;
    planName: string;
    status: 'active' | 'canceled' | 'expired' | 'trialing';
    statusColor: string;

    // 计费信息
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    price: number;
    currency: string;

    // 时间
    startDate: string;
    startedAt: number;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    nextBillingDate: string;  // "2024-02-15"
    nextBillingAt: number;

    canceledAt?: number;
    cancelAtPeriodEnd?: boolean;  // 是否在周期结束时取消

    // 限制和使用
    limits: {
      apiCalls: number;
      tokens: number;
      models: number;
      storage: number;
      members: number;
    };

    usage: {
      apiCalls: number;
      apiCallsPercentage: number;
      tokens: number;
      tokensPercentage: number;
      storage: number;
      storagePercentage: number;
      members: number;
    };

    // 附加服务
    addons?: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 当前订阅卡片
- 使用量进度条
- 下次续费时间

---

## 创建订阅

**接口路径**：`POST /api/v1/billing/subscriptions`  
**接口说明**：订阅新计划

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  planId: string;            // 必填|计划ID
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  paymentMethodId: string;   // 必填|支付方式ID

  // 可选：附加服务
  addonIds?: string[];

  // 可选：优惠券
  couponCode?: string;
}
```

**Figma对应**：

- 订阅计划选择
- 计费周期选择
- 支付方式选择

### 响应数据

```typescript
{
  code: 201,
  msg: "订阅创建成功",
  data: {
    subscriptionId: number;
    planId: string;
    status: 'active' | 'pending_payment';

    // 支付信息（如需要支付）
    payment?: {
      orderId: string;
      amount: number;
      currency: string;
      paymentUrl?: string;   // 支付链接（第三方支付）
      qrCode?: string;       // 二维码（微信/支付宝）
      expiresAt: number;     // 支付过期时间
    };

    createdDate: Date
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 免费版无需支付
2. 付费计划需要先添加支付方式
3. 订阅立即生效或pending_payment
4. 年付有折扣优惠

---

## 更改订阅计划

**接口路径**：`PATCH /api/v1/billing/subscription`  
**接口说明**：升级或降级订阅计划

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  newPlanId: string;         // 必填|新计划ID
  billingCycle?: 'monthly' | 'quarterly' | 'yearly';
  effectiveAt?: 'now' | 'next_period';  // 生效时间
}
```

**Figma对应**：

- 升级/降级按钮
- 确认对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "计划已更改",
  data: {
    subscriptionId: number;
    oldPlanId: string;
    newPlanId: string;
    effectiveAt: number;

    // 费用调整
    proration?: {
      creditAmount: number;  // 退款金额
      chargeAmount: number;  // 补差金额
      description: string;
    };

    // 如需补差
    payment?: {
      orderId: string;
      amount: number;
      paymentUrl?: string;
    };
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 升级立即生效，按比例退款
2. 降级默认下个周期生效
3. 计算未使用时间的退款
4. 升级需补差价

---

## 取消订阅

**接口路径**：`POST /api/v1/billing/subscription/cancel`  
**接口说明**：取消订阅

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  cancelAtPeriodEnd?: boolean;  // 默认true，周期结束时取消
  reason?: string;              // 可选|取消原因
  feedback?: string;            // 可选|反馈
}
```

**Figma对应**：

- 取消订阅按钮
- 确认对话框
- 反馈表单

### 响应数据

```typescript
{
  code: 200,
  msg: "订阅已取消",
  data: {
    subscriptionId: number;
    status: 'canceled';
    canceledAt: number;
    effectiveAt: number;       // 实际取消生效时间
    refundAmount?: number;     // 退款金额
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 默认周期结束时取消，可继续使用到期末
2. 立即取消会按比例退款
3. 免费版无需取消

---

## 重新激活订阅

**接口路径**：`POST /api/v1/billing/subscription/reactivate`  
**接口说明**：重新激活已取消的订阅

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "订阅已重新激活",
  data: {
    subscriptionId: number;
    status: 'active';
    reactivatedAt: number;
  },
  datetime: 1706889600000
}
```

---

## 获取支付方式列表

**接口路径**：`GET /api/v1/billing/payment-methods`  
**接口说明**：获取用户的支付方式列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: string;
        type: 'credit_card' | 'alipay' | 'wechat' | 'bank_transfer';
        typeLabel: string;     // "信用卡", "支付宝"

        // 卡片信息（信用卡）
        brand?: string;        // "Visa", "MasterCard"
        lastFour?: string;     // "4242"
        expiry?: string;       // "12/25"

        // 账户信息（支付宝/微信）
        account?: string;      // 部分显示

        isDefault: boolean;
        createdDate: Date
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 支付方式列表
- 每个支付方式显示：类型图标、卡号/账号、默认标记

---

## 添加支付方式

**接口路径**：`POST /api/v1/billing/payment-methods`  
**接口说明**：添加新的支付方式

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  type: 'credit_card' | 'alipay' | 'wechat';

  // 信用卡
  creditCard?: {
    number: string;          // 卡号
    expMonth: number;        // 过期月份
    expYear: number;         // 过期年份
    cvc: string;             // 安全码
    holderName: string;      // 持卡人姓名
  };

  // 支付宝/微信（需要授权）
  authCode?: string;         // 授权码

  setAsDefault?: boolean;    // 是否设为默认
}
```

**Figma对应**：

- 添加支付方式对话框
- 信用卡表单
- 第三方支付授权

### 响应数据

```typescript
{
  code: 201,
  msg: "支付方式已添加",
  data: {
    id: string;
    type: string;
    lastFour?: string;
    isDefault: boolean;
    createdDate: Date
  },
  datetime: 1706889600000
}
```

---

## 删除支付方式

**接口路径**：`DELETE /api/v1/billing/payment-methods/:id`  
**接口说明**：删除支付方式

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string; // 支付方式ID
}
```

### 响应数据

```typescript
{
  code: 204,
  msg: "删除成功",
  datetime: 1706889600000
}
```

### 业务规则

1. 不能删除默认支付方式（需先设置其他为默认）
2. 有活跃订阅时不能删除唯一的支付方式

---

## 设置默认支付方式

**接口路径**：`PATCH /api/v1/billing/payment-methods/:id/set-default`  
**接口说明**：设置默认支付方式

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string; // 支付方式ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "默认支付方式已更新",
  data: {
    id: string;
    isDefault: true;
  },
  datetime: 1706889600000
}
```

---

## 获取发票列表

**接口路径**：`GET /api/v1/billing/invoices`  
**接口说明**：获取发票列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  status?: 'paid' | 'pending' | 'failed' | 'refunded';
  startDate?: number;
  endDate?: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: string;
        invoiceNumber: string;  // "INV-2024-001"
        date: string;           // "2024-01-15"
        datedatetime: number;

        amount: number;
        currency: string;
        amountDisplay: string;  // "¥299.00"

        status: 'paid' | 'pending' | 'failed' | 'refunded';
        statusColor: string;

        description: string;    // "专业版订阅 - 月付"

        // 详细项
        items: Array<{
          description: string;
          quantity: number;
          unitPrice: number;
          amount: number;
        }>;

        // 下载链接
        pdfUrl: string;
        downloadUrl: string;

        paidAt?: number;
      }
    ],
    pagination: Pagination;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 发票列表表格
- 每行显示：发票号、日期、金额、状态、下载按钮

---

## 下载发票

**接口路径**：`GET /api/v1/billing/invoices/:id/download`  
**接口说明**：下载发票PDF

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string; // 发票ID
}
```

### 响应数据

返回PDF文件下载

---

## 获取使用量详情

**接口路径**：`GET /api/v1/billing/usage`  
**接口说明**：获取当前周期的使用量详情

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  period?: 'current' | 'last' | 'all';
  groupBy?: 'day' | 'week' | 'month';
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    period: {
      start: number;
      end: number;
    },

    // 当前使用量
    current: {
      apiCalls: {
        used: number;
        limit: number;
        percentage: number;
        unlimited: boolean;
      },
      tokens: {
        used: number;
        limit: number;
        percentage: number;
      },
      storage: {
        used: number;
        usedDisplay: string;   // "1.2GB"
        limit: number;
        limitDisplay: string;  // "10GB"
        percentage: number;
      },
      members: {
        used: number;
        limit: number;
      }
    },

    // 使用趋势
    trends: {
      apiCalls: Array<{
        date: string;
        count: number;
      }>;
      tokens: Array<{
        date: string;
        count: number;
      }>;
      storage: Array<{
        date: string;
        size: number;
      }>;
    },

    // 按资源类型分组
    byResource: {
      applications: number;
      workflows: number;
      datasets: number;
      models: number;
    },

    // 预估费用
    estimatedCost: {
      current: number;
      projected: number;       // 预计月底
      currency: string;
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 使用量详情页面
- 使用量趋势图表
- 资源使用分布
- 预估费用

---

## 应用优惠券

**接口路径**：`POST /api/v1/billing/coupons/apply`  
**接口说明**：应用优惠券码

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  couponCode: string; // 优惠券码
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "优惠券应用成功",
  data: {
    couponId: string;
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;   // 百分比或固定金额
    description: string;
    expiresAt?: number;
    appliedAt: number;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 优惠券输入框
- 应用按钮

---

## 获取付款记录

**接口路径**：`GET /api/v1/billing/payments`  
**接口说明**：获取付款历史记录

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  status?: 'success' | 'failed' | 'pending' | 'refunded';
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: string;
        orderId: string;
        amount: number;
        currency: string;
        status: string;
        statusColor: string;

        paymentMethod: string;
        description: string;

        createdDate: Date
        paidAt?: number;
        refundedAt?: number;

        invoiceId?: string;
      }
    ],
    pagination: Pagination;
  },
  datetime: 1706889600000
}
```

---

## 支付回调（Webhook）

**接口路径**：`POST /api/v1/billing/webhooks/:provider`  
**接口说明**：支付平台的回调接口

### 路径参数

```typescript
{
  provider: 'stripe' | 'alipay' | 'wechat';
}
```

### 请求参数

由支付平台定义

### 响应数据

```typescript
{
  code: 200,
  msg: "success"
}
```

### 业务规则

1. 验证签名
2. 更新订单状态
3. 激活订阅
4. 发送确认邮件

---

## 业务规则说明

### 订阅状态流转

```
trial（试用） → active（激活） → past_due（逾期） → canceled（取消）
                              ↓
                           expired（过期）
```

### 计费周期

- **月付（monthly）**：每月1号扣费
- **季付（quarterly）**：每季度1号扣费，节省10%
- **年付（yearly）**：每年1号扣费，节省20%

### 升级/降级规则

**升级（Upgrade）**

- 立即生效
- 按比例计算剩余时间
- 补差价

**降级（Downgrade）**

- 下个周期生效
- 当前周期继续享受原计划
- 无需退款

### 退款政策

- 取消订阅按比例退款
- 30天内无条件退款
- 退款原路返回

---

## 错误码

| 错误码 | 说明                 |
| ------ | -------------------- |
| 41301  | 订阅不存在           |
| 41302  | 计划不存在           |
| 41303  | 支付方式无效         |
| 41304  | 支付失败             |
| 41305  | 优惠券无效或已过期   |
| 41306  | 超过使用限额         |
| 41307  | 发票不存在           |
| 41308  | 不能删除默认支付方式 |

---

**支付安全**：

1. PCI DSS合规
2. 加密传输
3. 不存储完整卡号
4. 3D验证
5. 支付风控
6. 签名验证
