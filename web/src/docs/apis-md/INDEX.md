# AngusAI 后端接口文档索引

## 📚 已完成的API文档

### ✅ 核心模块

1. **[README.md](README.md)** - 接口文档总览
   - 设计原则、命名规范
   - 统一响应格式
   - 状态码规范
   - 认证方式

2. **[common-types.md](common-types.md)** - 公共类型定义
   - 基础类型（User、Pagination等）
   - 应用相关类型
   - 知识库相关类型
   - 数据集相关类型
   - 工作流相关类型
   - 模型相关类型
   - 枚举定义

3. **[01-auth.md](01-auth.md)** - 认证授权模块 ✅
   - 用户登录/注册
   - Token刷新
   - 用户信息管理
   - 密码修改/重置
   - 头像上传

4. **[02-dashboard.md](02-dashboard.md)** - 工作台模块 ✅
   - 工作台概览
   - 统计数据
   - 最近应用
   - 推荐工具
   - 使用分析
   - 系统通知

5. **[04-applications.md](04-applications.md)** - 应用管理模块 ✅
   - 应用CRUD操作
   - 应用配置管理
   - 发布/取消发布
   - 复制应用
   - 分享应用
   - 应用统计
   - 配置导入/导出

6. **[05-knowledge-base.md](05-knowledge-base.md)** - 知识库模块 ✅
   - 知识库CRUD操作
   - 文档上传管理
   - 文档启用/禁用
   - 文档处理状态
   - 文档检索
   - 批量操作

7. **[07-workflow.md](07-workflow.md)** - 工作流模块 ✅
   - 工作流CRUD操作
   - 节点和连线管理
   - 工作流执行控制
   - 执行日志查询
   - 版本管理
   - 统计数据

8. **[06-dataset.md](06-dataset.md)** - 数据集模块 ✅
   - 数据集CRUD操作
   - 文本/表格/数据源管理
   - 数据上传和导出
   - 数据源连接配置
   - 数据预览
   - 统计分析

9. **[08-prompt-library.md](08-prompt-library.md)** - 提示词库模块 ✅
   - 提示词CRUD操作
   - 分类管理
   - 收藏功能
   - 标签系统
   - 搜索和筛选
   - 导入导出

10. **[09-plugin-market.md](09-plugin-market.md)** - 插件市场模块 ✅
    - 插件浏览和搜索
    - 安装/卸载插件
    - 插件配置管理
    - 评价和评分
    - 插件上传
    - 健康检查

11. **[10-model-management.md](10-model-management.md)** - 模型管理模块 ✅
    - 模型CRUD操作
    - 启动/停止控制
    - 性能监控
    - 调用统计
    - 成本分析
    - 批量操作

---

12. **[03-chat.md](03-chat.md)** - AI对话模块 ✅
    - 会话管理
    - 消息发送接收
    - 流式响应（SSE）
    - 附件处理
    - 提示词应用
    - 应用/模型切换
    - 语音输入
    - 统计分析

13. **[11-api-keys.md](11-api-keys.md)** - API密钥管理模块 ✅
    - 密钥CRUD操作
    - 权限配置
    - 资源授权
    - 使用统计
    - 调用日志
    - 速率限制
    - IP白名单

14. **[12-team.md](12-team.md)** - 团队管理模块 ✅
    - 成员管理
    - 邀请机制
    - 角色权限
    - 操作日志
    - 团队设置
    - 资源共享

15. **[13-billing.md](13-billing.md)** - 计费订阅模块 ✅
    - 订阅计划管理
    - 支付处理
    - 发票管理
    - 使用量统计
    - 优惠券
    - 退款处理

16. **[14-settings.md](14-settings.md)** - 系统设置模块 ✅
    - 用户偏好
    - 通知设置
    - 安全设置
    - 双因素认证
    - 集成管理
    - 数据导出

17. **[15-analytics.md](15-analytics.md)** - 使用分析模块 ✅ **新增补充**
    - 分析概览
    - API调用趋势
    - Token使用统计
    - 响应时间分析
    - 应用/模型分布
    - Top接口统计
    - 错误分析
    - 成本分析
    - 实时监控

18. **[16-resource-sharing.md](16-resource-sharing.md)** - 资源共享模块 ✅ **新增补充**
    - 共享资源管理
    - 权限控制
    - 成员管理
    - 访问统计
    - 活动日志

---

## 🎉 全部完成！

所有16个核心模块的API文档已创建完成！包括2个补充模块！

---

## 🎯 Figma到API的映射关系

### 页面 → API模块映射

| Figma页面 | API模块                | 状态 |
| --------- | ---------------------- | ---- |
| 登录页面  | 01-auth.md             | ✅   |
| 工作台    | 02-dashboard.md        | ✅   |
| AI Chat   | 03-chat.md             | ⏳   |
| 我的应用  | 04-applications.md     | ✅   |
| 应用设置  | 04-applications.md     | ✅   |
| 知识库    | 05-knowledge-base.md   | ✅   |
| 数据集    | 06-dataset.md          | ⏳   |
| 工作流    | 07-workflow.md         | ✅   |
| 提示词库  | 08-prompt-library.md   | ⏳   |
| 插件市场  | 09-plugin-market.md    | ⏳   |
| 模型管理  | 10-model-management.md | ⏳   |
| API密钥   | 11-api-keys.md         | ⏳   |
| 团队设置  | 12-team.md             | ⏳   |
| 计费订阅  | 13-billing.md          | ⏳   |
| 系统设置  | 14-settings.md         | ⏳   |

### UI组件 → API映射

| UI组件         | 对应API                                    | Figma位置    |
| -------------- | ------------------------------------------ | ------------ |
| 应用列表卡片   | GET /api/v1/applications                   | 我的应用页   |
| 创建应用对话框 | POST /api/v1/applications                  | 顶部+按钮    |
| 知识库卡片     | GET /api/v1/knowledge-bases                | 知识库页     |
| 文档上传区     | POST /api/v1/knowledge-bases/:id/documents | 选中知识库后 |
| 统计卡片       | GET /api/v1/dashboard/stats                | 工作台页     |
| 聊天消息       | POST /api/v1/chat/messages                 | Chat页       |
| 工作流画布     | GET/PUT /api/v1/workflows/:id              | 工作流编辑器 |

---

## 🔗 快速导航

### 按功能分类

#### 用户相关

- [用户认证](01-auth.md)
- [用户设置](14-settings.md)
- [团队管理](12-team.md)

#### 应用开发

- [应用管理](04-applications.md)
- [工作流](07-workflow.md)
- [提示词库](08-prompt-library.md)

#### 数据管理

- [知识库](05-knowledge-base.md)
- [数据集](06-dataset.md)

#### AI功能

- [对话](03-chat.md)
- [模型管理](10-model-management.md)

#### 系统功能

- [工作台](02-dashboard.md)
- [API密钥](11-api-keys.md)
- [插件市场](09-plugin-market.md)
- [计费订阅](13-billing.md)

---

## 📖 使用指南

### 1. 查看接口规范

每个模块文档包含：

- 接口路径和方法
- 请求参数详细说明
- 响应数据结构
- 错误响应示例
- 业务规则说明
- Figma对应关系

### 2. 参数命名规则

- 所有参数使用小驼峰命名：`pageSize`, `createdDate`
- 路径使用连字符：`/api/v1/knowledge-bases`
- 枚举值使用下划线：`CUSTOMER_SERVICE`

### 3. 时间格式

- 统一使用Unix时间戳（毫秒）
- 示例：`1706889600000`

### 4. 分页规范

```typescript
{
  pageNo: 1,
  pageSize: 20,
  orderBy: 'createdDate',
  orderSort: 'desc'
}
```

### 5. 响应格式

```typescript
{
  code: 200,
  msg: "success",
  data: { ... },
  datetime: 1706889600000
}
```

---

## 🚀 开发建议

### API开发优先级

#### 第一阶段（MVP）

1. ✅ 认证授权
2. ✅ 工作台
3. ⏳ AI对话
4. ✅ 应用管理
5. ✅ 知识库

#### 第二阶段（完善）

6. ⏳ 数据集
7. ⏳ 工作流
8. ⏳ 提示词库
9. ⏳ API密钥

#### 第三阶段（增强）

10. ⏳ 插件市场
11. ⏳ 模型管理
12. ⏳ 团队管理
13. ⏳ 计费订阅

---

## 📋 检查清单

在实现每个API时，请确认：

- [ ] 接口路径符合RESTful规范
- [ ] 参数名称使用小驼峰
- [ ] 枚举值已在common-types.md中定义
- [ ] 响应格式统一
- [ ] 错误处理完整
- [ ] 权限验证正确
- [ ] 与Figma设计一致
- [ ] 业务规则明确
- [ ] 性能优化建议
- [ ] 文档注释完整

---

## 🔄 更新记录

| 日期       | 版本   | 更新内容                                                                                  |
| ---------- | ------ | ----------------------------------------------------------------------------------------- |
| 2024-02-02 | v2.0.0 | 🎉 完成所有14个模块！新增AI对话、API密钥、团队管理、计费订阅、系统设置5个模块（88个接口） |
| 2024-02-02 | v1.2.0 | 新增数据集、提示词库、插件市场、模型管理4个模块（71个接口）                               |
| 2024-02-02 | v1.1.0 | 新增工作流模块API文档（15个接口）                                                         |
| 2024-02-02 | v1.0.0 | 初始版本，完成核心模块（47个接口）                                                        |

---

## 📞 联系方式

如有疑问或建议，请联系开发团队。

**文档维护**：AngusAI开发团队  
**最后更新**：2024-02-02
