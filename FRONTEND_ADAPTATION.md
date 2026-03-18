# 前端适配指南 - 从 tRPC 到 REST API

本文档说明如何将前端从 tRPC 调用改为 REST API 调用以适配新的 Java Spring Boot 后端。

## 概述

原始项目使用 tRPC 框架进行类型安全的 RPC 通信，新的 Java 后端使用标准 REST API。前端需要进行以下主要改动：

1. 替换 tRPC 客户端为 Fetch API 或 Axios
2. 更新 API 端点 URL
3. 调整请求/响应处理逻辑

## API 端点映射

### 认证模块

| 原始 tRPC 调用 | 新 REST API | 方法 | 说明 |
|---------------|-----------|------|------|
| `trpc.auth.local.register` | `/api/auth/register` | POST | 用户注册 |
| `trpc.auth.local.login` | `/api/auth/login` | POST | 用户登录 |
| `trpc.auth.local.checkEmailExists` | `/api/auth/check-email` | GET | 检查邮箱 |
| `trpc.auth.logout` | `/api/auth/logout` | POST | 用户登出 |
| `trpc.auth.me` | `/api/auth/me` | GET | 获取当前用户信息 |

### 支付模块

| 原始 tRPC 调用 | 新 REST API | 方法 | 说明 |
|---------------|-----------|------|------|
| `trpc.payment.createOrder` | `/api/payment/createOrder` | POST | 创建订单 |
| `trpc.payment.getOrder` | `/api/payment/order/{orderId}` | GET | 获取订单详情 |
| `trpc.payment.notifyAlipay` | `/api/payment/notifyAlipay` | POST | 支付宝回调 |
| `trpc.payment.getPricingPlans` | `/api/payment/plans` | GET | 获取定价方案 |

## 前端代码改动示例

### 1. 创建 API 客户端工具

创建 `src/lib/api.ts`：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || 'API Error');
  }

  return response.json();
}

// 认证相关
export const authApi = {
  register: (data: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkEmailExists: (email: string) =>
    apiCall(`/auth/check-email?email=${encodeURIComponent(email)}`),

  logout: () =>
    apiCall('/auth/logout', { method: 'POST' }),
};

// 支付相关
export const paymentApi = {
  createOrder: (data: any) =>
    apiCall('/payment/createOrder', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrder: (orderId: string) =>
    apiCall(`/payment/order/${orderId}`),

  getPricingPlans: () =>
    apiCall('/payment/plans'),

  notifyAlipay: (params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/payment/notifyAlipay?${queryString}`, {
      method: 'POST',
    });
  },
};
```

### 2. 更新 Pricing 页面

修改 `client/src/pages/Pricing.tsx`：

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // 在组件挂载时获取定价方案
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await paymentApi.getPricingPlans();
        setPlans(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load pricing plans");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (planId: string) => {
    if (!email || !name) {
      toast.error("请填写邮箱和姓名");
      return;
    }

    setIsLoading(true);
    try {
      const result = await paymentApi.createOrder({
        planId,
        email,
        name,
      });

      // 重定向到支付宝支付页面
      window.location.href = result.paymentUrl;
    } catch (error: any) {
      toast.error(error.message || "创建订单失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">选择你的求职套餐</h1>
          <p className="text-xl text-slate-600">
            专业的求职辅导，帮助你成功拿到美国科技公司 Offer
          </p>
        </div>

        {/* 用户信息表单 */}
        <Card className="mb-12 bg-white border-slate-200">
          <CardHeader>
            <CardTitle>你的信息</CardTitle>
            <CardDescription>请填写你的基本信息以完成购买</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  placeholder="张三"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white border-2 transition-all ${
                selectedPlan === plan.id
                  ? "border-orange-500 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* 推荐标签 */}
              {plan.id === "pro" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    推荐
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 价格 */}
                <div>
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600 ml-2">USD</span>
                </div>

                {/* 功能列表 */}
                <ul className="space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 购买按钮 */}
                <Button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handlePayment(plan.id);
                  }}
                  disabled={isLoading}
                  className={`w-full h-12 text-base font-semibold ${
                    plan.id === "pro"
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    "立即购买"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="mt-16 bg-white rounded-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">可以升级或降级套餐吗？</h3>
              <p className="text-slate-600">
                可以。购买后 7 天内可以无条件升级到更高级套餐，差价按比例退款。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">套餐有有效期吗？</h3>
              <p className="text-slate-600">
                所有套餐自购买之日起有效期为 6 个月。期间可以无限次使用所有服务。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">支持哪些支付方式？</h3>
              <p className="text-slate-600">
                目前支持支付宝支付。我们将很快支持微信支付和信用卡支付。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. 更新环境变量配置

修改 `.env.local`：

```env
VITE_API_URL=http://localhost:8080/api
```

或在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

## 认证令牌处理

### 存储 JWT 令牌

在登录成功后存储令牌：

```typescript
const response = await authApi.login({ email, password });
localStorage.setItem('authToken', response.token);
```

### 在请求中使用令牌

修改 `src/lib/api.ts` 中的 `apiCall` 函数：

```typescript
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // 令牌过期，清除并重定向到登录
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || 'API Error');
  }

  return response.json();
}
```

## 错误处理

API 响应的错误格式：

```json
{
  "error": "邮箱格式不正确"
}
```

或

```json
{
  "message": "Order not found"
}
```

前端应统一处理这些错误格式。

## 跨域配置

Java 后端已配置 CORS，允许来自前端的跨域请求。如果前端和后端在不同的端口运行，确保在 `application.yml` 中配置了正确的 CORS 设置。

## 完整的 API 调用示例

### 注册新用户

```typescript
try {
  const response = await authApi.register({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: '张三',
    targetCompanies: ['Google', 'Meta'],
    experienceYears: 3,
  });
  
  localStorage.setItem('authToken', response.token);
  toast.success('注册成功');
  navigate('/dashboard');
} catch (error) {
  toast.error(error.message);
}
```

### 登录用户

```typescript
try {
  const response = await authApi.login({
    email: 'user@example.com',
    password: 'SecurePass123',
  });
  
  localStorage.setItem('authToken', response.token);
  toast.success('登录成功');
  navigate('/dashboard');
} catch (error) {
  toast.error(error.message);
}
```

### 创建订单

```typescript
try {
  const response = await paymentApi.createOrder({
    planId: 'pro',
    email: 'user@example.com',
    name: '张三',
  });
  
  // 重定向到支付宝支付
  window.location.href = response.paymentUrl;
} catch (error) {
  toast.error(error.message);
}
```

## 测试

使用 Postman 或 curl 测试 API 端点：

```bash
# 注册
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'

# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# 获取定价方案
curl -X GET http://localhost:8080/api/payment/plans

# 创建订单
curl -X POST http://localhost:8080/api/payment/createOrder \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "pro",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

## 总结

主要改动点：

1. 将 tRPC 调用替换为 Fetch API 调用
2. 更新 API 端点 URL 格式
3. 处理 JWT 令牌的存储和使用
4. 统一错误处理逻辑
5. 配置 CORS 和代理

完成这些改动后，前端应能正常与新的 Java Spring Boot 后端通信。
