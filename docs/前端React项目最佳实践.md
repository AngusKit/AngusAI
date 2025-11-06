# React 项目开发最佳实践示例

## 1. 项目结构

```
src/
├── components/          # 可复用组件
│   ├── common/         # 通用组件
│   ├── forms/          # 表单组件
│   └── ui/             # UI基础组件
├── hooks/              # 自定义Hooks
├── services/           # API服务
├── stores/             # 状态管理
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
├── constants/          # 常量定义
├── pages/              # 页面组件
├── layouts/            # 布局组件
└── assets/             # 静态资源
```

## 2. 组件开发最佳实践

### 2.1 函数组件与TypeScript

```tsx
// components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

### 2.2 自定义Hooks

```tsx
// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 3. 状态管理

### 3.1 Zustand Store (推荐)

```tsx
// stores/useAppStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      user: null,
      theme: 'light',
      isLoading: false,
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'app-storage',
    }
  )
);
```

### 3.2 Context API (复杂状态)

```tsx
// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_FAILURE':
      return { user: null, isAuthenticated: false, loading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 4. API服务层

```tsx
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// services/statisticsService.ts
import api from './api';
import { Overview, TopStore, PerformanceTrend } from '../types/statistics';

export const statisticsService = {
  // 获取总体统计
  getOverview: async (): Promise<Overview> => {
    const response = await api.get('/statistics/overview');
    return response.data;
  },

  // 获取使用率排行
  getTopStores: async (limit: number = 10): Promise<TopStore[]> => {
    const response = await api.get('/statistics/top-stores', {
      params: { limit },
    });
    return response.data;
  },

  // 获取性能趋势
  getPerformanceTrend: async (
    startDate: string,
    endDate: string
  ): Promise<PerformanceTrend[]> => {
    const response = await api.get('/statistics/performance-trend', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
```

## 5. 页面组件示例

```tsx
// pages/Dashboard.tsx
import React from 'react';
import { useApi } from '../hooks/useApi';
import { statisticsService } from '../services/statisticsService';
import { OverviewCard } from '../components/dashboard/OverviewCard';
import { TopStoresTable } from '../components/dashboard/TopStoresTable';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';

export const Dashboard: React.FC = () => {
  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
  } = useApi(() => statisticsService.getOverview());

  const {
    data: topStores,
    loading: topStoresLoading,
  } = useApi(() => statisticsService.getTopStores(10));

  if (overviewError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">加载失败: {overviewError.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">数据统计仪表板</h1>
      
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewCard
          title="接口集总数"
          value={overview?.apiCollectionCount}
          loading={overviewLoading}
        />
        <OverviewCard
          title="接口总数"
          value={overview?.apiTotalCount}
          loading={overviewLoading}
        />
        <OverviewCard
          title="已启用接口"
          value={overview?.enabledApiCount}
          loading={overviewLoading}
        />
        <OverviewCard
          title="总调用次数"
          value={overview?.totalCallCount}
          loading={overviewLoading}
        />
        <OverviewCard
          title="今日调用"
          value={overview?.todayCallCount}
          loading={overviewLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 使用率排行 */}
        <TopStoresTable
          data={topStores || []}
          loading={topStoresLoading}
        />

        {/* 性能趋势图表 */}
        <PerformanceChart />
      </div>
    </div>
  );
};
```

## 6. 工具函数

```tsx
// utils/formatters.ts
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(num);
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
```

## 7. 环境配置

```env
# .env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=My React App
REACT_APP_VERSION=1.0.0

# .env.production
REACT_APP_API_URL=https://api.example.com
```

## 8. 代码质量工具配置

### ESLint配置 (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb-typescript',
    'prettier'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ]
  }
};
```

## 9. 性能优化

```tsx
// 使用React.memo优化组件
export const ExpensiveComponent = React.memo(({ data }: { data: DataType }) => {
  // 组件逻辑
});

// 使用useCallback和useMemo
export const OptimizedComponent = ({ items, onItemClick }: Props) => {
  const memoizedItems = useMemo(() => items.filter(item => item.active), [items]);
  
  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {memoizedItems.map(item => (
        <Item key={item.id} item={item} onClick={handleItemClick} />
      ))}
    </div>
  );
};
```

这些最佳实践涵盖了现代React开发的主要方面，包括类型安全、状态管理、代码组织、性能优化等。
