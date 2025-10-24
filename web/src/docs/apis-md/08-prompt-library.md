# 提示词库模块 API

**Figma来源**：提示词库页面、创建提示词对话框、分类管理  
**模块说明**：提示词的创建、管理、分类、搜索、收藏等功能

## 目录

- [获取提示词列表](#获取提示词列表)
- [获取提示词详情](#获取提示词详情)
- [创建提示词](#创建提示词)
- [更新提示词](#更新提示词)
- [删除提示词](#删除提示词)
- [收藏/取消收藏](#收藏取消收藏)
- [复制提示词](#复制提示词)
- [分类管理](#分类管理)
- [使用统计](#使用统计)

---

## 获取提示词列表

**接口路径**：`GET /api/v1/prompts`  
**接口说明**：获取提示词列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;           // 搜索关键词（标题、内容）
  category?: string;          // 分类ID筛选
  isFavorite?: boolean;       // 仅收藏
  tags?: string[];            // 标签筛选
  orderBy?: 'createdDate' | 'lastModifiedDate' | 'usageCount' | 'title';
  orderSort?: 'asc' | 'desc';
  isPublic?: boolean;         // 是否公开
}
```

**Figma对应**：

- `keyword` → 顶部搜索框
- `category` → 左侧分类列表选择
- `isFavorite` → "收藏"分类
- 右侧提示词网格展示

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        title: string;
        content: string;       // 提示词内容
        category: string;      // 分类ID
        categoryName: string;  // 分类名称
        tags: Array<{
          label: string;
          color: string;       // 标签颜色类名
        }>;
        isFavorite: boolean;
        usageCount: number;    // 使用次数
        isSystem: boolean;     // 是否为系统模板
        isPublic: boolean;     // 是否公开
        createdDate: Date
        lastModifiedDate: Date;
        createdBy: number;
        createdByName: string;
      }
    ],
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 提示词卡片网格
- 每个卡片显示：标题、标签、使用次数、收藏状态

---

## 获取提示词详情

**接口路径**：`GET /api/v1/prompts/:id`  
**接口说明**：获取指定提示词的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 提示词ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    title: string;
    content: string;
    description?: string;    // 详细描述
    category: string;
    categoryName: string;
    tags: Array<{
      label: string;
      color: string;
    }>;
    isFavorite: boolean;
    usageCount: number;
    isSystem: boolean;
    isPublic: boolean;

    // 变量定义（从content中提取）
    variables?: Array<{
      name: string;          // 变量名
      placeholder?: string;  // 占位符
      required: boolean;
    }>;

    // 使用示例
    examples?: Array<{
      input: Record<string, any>;  // 变量值
      output: string;              // 预期输出
    }>;

    // 创建者信息
    createdDate: Date
    lastModifiedDate: Date;
    createdBy: number;
    createdByName: string;

    // 统计信息
    stats: {
      totalUses: number;
      favorites: number;
      shares: number;
    };
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 点击提示词卡片后的详情弹窗
- 显示完整内容、标签、使用次数

---

## 创建提示词

**接口路径**：`POST /api/v1/prompts`  
**接口说明**：创建新提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  title: string;             // 必填|提示词标题|maxLength:100
  content: string;           // 必填|提示词内容|maxLength:5000
  description?: string;      // 可选|描述|maxLength:500
  category: string;          // 必填|分类ID
  tags?: Array<{
    label: string;           // 标签文本
    color: string;           // 标签颜色
  }>;                        // 可选|标签，最多10个
  isPublic?: boolean;        // 可选|是否公开，默认false

  // 可选：变量定义
  variables?: Array<{
    name: string;
    placeholder?: string;
    required?: boolean;
  }>;

  // 可选：使用示例
  examples?: Array<{
    input: Record<string, any>;
    output: string;
  }>;
}
```

**Figma对应**：

- 创建提示词对话框
- 标题、内容、分类、标签输入

### 响应数据

```typescript
{
  code: 201,
  msg: "提示词创建成功",
  data: {
    id: number;
    title: string;
    category: string;
    createdDate: Date
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 标题不能重复（同一用户）
2. 标签最多10个，每个不超过15字符
3. 内容支持变量占位符：{变量名}
4. 系统模板不能修改或删除
5. 公开的提示词所有人可见可用

---

## 更新提示词

**接口路径**：`PATCH /api/v1/prompts/:id`  
**接口说明**：更新提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 提示词ID
}
```

### 请求参数

```typescript
{
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  tags?: Array<{
    label: string;
    color: string;
  }>;
  isPublic?: boolean;
  variables?: any[];
  examples?: any[];
}
```

**Figma对应**：

- 编辑提示词对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的提示词信息
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 只能编辑自己创建的提示词
2. 系统模板不能编辑（isSystem=true）
3. 更新后自动保存版本历史

---

## 删除提示词

**接口路径**：`DELETE /api/v1/prompts/:id`  
**接口说明**：删除提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 提示词ID
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

1. 只能删除自己创建的提示词
2. 系统模板不能删除
3. 软删除，保留30天可恢复

---

## 收藏/取消收藏

**接口路径**：`POST /api/v1/prompts/:id/favorite`  
**接口说明**：收藏或取消收藏提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 提示词ID
}
```

### 请求参数

```typescript
{
  isFavorite: boolean; // true收藏，false取消收藏
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "操作成功",
  data: {
    id: number;
    isFavorite: boolean;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 提示词卡片上的星标图标
- 点击切换收藏状态

---

## 复制提示词

**接口路径**：`POST /api/v1/prompts/:id/duplicate`  
**接口说明**：复制提示词（创建副本）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 源提示词ID
}
```

### 请求参数

```typescript
{
  title?: string;            // 可选|新标题，默认为"xxx的副本"
}
```

### 响应数据

```typescript
{
  code: 201,
  msg: "复制成功",
  data: {
    // 返回新提示词的完整信息
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 提示词卡片的复制按钮

---

## 使用提示词

**接口路径**：`POST /api/v1/prompts/:id/use`  
**接口说明**：标记提示词使用，增加使用计数

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 提示词ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    usageCount: number;      // 更新后的使用次数
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 点击"复制"按钮时调用
- 使用次数+1

---

## 获取分类列表

**接口路径**：`GET /api/v1/prompts/categories`  
**接口说明**：获取提示词分类列表

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
        name: string;          // 中文名
        nameEn: string;        // 英文名
        icon: string;          // 图标组件名
        color: string;         // 颜色类名
        isSystem: boolean;     // 是否为系统分类
        promptCount: number;   // 该分类下的提示词数量
        order: number;         // 排序
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 左侧分类列表
- 全部、收藏、编程开发、写作、营销等

---

## 创建分类

**接口路径**：`POST /api/v1/prompts/categories`  
**接口说明**：创建自定义分类

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|分类名称（中文）|maxLength:20
  nameEn: string;            // 必填|分类名称（英文）|maxLength:30
  icon?: string;             // 可选|图标名称
  color?: string;            // 可选|颜色类名
}
```

**Figma对应**：

- 添加分类对话框

### 响应数据

```typescript
{
  code: 201,
  msg: "分类创建成功",
  data: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    isSystem: false;
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 分类名称不能重复
2. 最多创建20个自定义分类
3. 系统分类不能删除或修改

---

## 更新分类

**接口路径**：`PATCH /api/v1/prompts/categories/:id`  
**接口说明**：更新分类信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string; // 分类ID
}
```

### 请求参数

```typescript
{
  name?: string;
  nameEn?: string;
  icon?: string;
  color?: string;
  order?: number;            // 排序
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的分类信息
  },
  datetime: 1706889600000
}
```

---

## 删除分类

**接口路径**：`DELETE /api/v1/prompts/categories/:id`  
**接口说明**：删除自定义分类

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string; // 分类ID
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

1. 系统分类不能删除
2. 删除分类时，该分类下的提示词移至"其他"分类
3. 如果分类下有提示词，需要确认

---

## 批量导入提示词

**接口路径**：`POST /api/v1/prompts/import`  
**接口说明**：批量导入提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  file: File;                // JSON或CSV文件
  category?: string;         // 默认分类
  replaceExisting?: boolean; // 是否替换同名提示词
}
```

### 响应数据

```typescript
{
  code: 201,
  msg: "导入成功",
  data: {
    importedCount: number;
    skippedCount: number;
    errors?: Array<{
      row: number;
      error: string;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 导出提示词

**接口路径**：`GET /api/v1/prompts/export`  
**接口说明**：导出提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  format?: 'json' | 'csv';   // 导出格式
  category?: string;         // 筛选分类
  ids?: number[];            // 指定ID列表
}
```

### 响应数据

返回文件下载

---

## 搜索提示词

**接口路径**：`GET /api/v1/prompts/search`  
**接口说明**：高级搜索提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  q: string;                 // 搜索关键词
  category?: string;
  tags?: string[];
  minUsage?: number;         // 最小使用次数
  maxUsage?: number;         // 最大使用次数
  createdAfter?: number;     // 创建时间筛选
  createdBefore?: number;
  page?: number;
  pageSize?: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: Prompt[];
    pagination: Pagination;
    facets?: {               // 搜索聚合结果
      categories: Array<{
        id: string;
        name: string;
        count: number;
      }>;
      tags: Array<{
        label: string;
        count: number;
      }>;
    };
  },
  datetime: 1706889600000
}
```

---

## 获取热门提示词

**接口路径**：`GET /api/v1/prompts/trending`  
**接口说明**：获取热门/推荐提示词

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  period?: 'day' | 'week' | 'month';  // 统计周期
  limit?: number;            // 返回数量，默认10
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: Prompt[];
  },
  datetime: 1706889600000
}
```

---

## 获取提示词统计

**接口路径**：`GET /api/v1/prompts/statistics`  
**接口说明**：获取提示词模块统计数据

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
    totalPrompts: number;
    myPrompts: number;
    favoritePrompts: number;
    publicPrompts: number;
    totalUsages: number;
    categoriesCount: number;

    // 分类统计
    categoryStats: Array<{
      categoryId: string;
      categoryName: string;
      count: number;
    }>;

    // 使用趋势
    usageTrend: Array<{
      date: string;
      count: number;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 提示词变量

支持在内容中使用变量占位符：

```
{变量名} 或 [变量名] 或 {{变量名}}
```

### 标签系统

- 每个提示词最多10个标签
- 支持自定义标签颜色
- 标签可重复使用

### 分类系统

- **系统分类**：全部、收藏、编程开发、写作、营销、生产力
- **自定义分类**：用户可创建最多20个
- 删除分类不会删除提示词

### 权限控制

1. **私有提示词**：只有创建者可见可用
2. **公开提示词**：所有人可见可用可收藏
3. **系统模板**：所有人可见可用，不可编辑删除

---

## 错误码

| 错误码 | 说明               |
| ------ | ------------------ |
| 40801  | 提示词不存在       |
| 40802  | 提示词标题重复     |
| 40803  | 无权限操作该提示词 |
| 40804  | 分类不存在         |
| 40805  | 系统分类不可删除   |
| 40806  | 标签数量超过限制   |

---

**性能优化建议**：

1. 提示词列表支持虚拟滚动
2. 搜索使用全文索引
3. 热门提示词缓存1小时
4. 分类列表缓存5分钟
5. 使用计数异步更新
6. 支持批量操作接口
