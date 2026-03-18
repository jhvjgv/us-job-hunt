/**
 * REST API 客户端工具
 * 用于与 Java Spring Boot 后端通信
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 通用 API 调用函数
 */
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * 认证相关 API
 */
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    targetCompanies?: string[];
    experienceYears?: number;
  }) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkEmailExists: (email: string) =>
    apiCall(`/auth/check-email?email=${encodeURIComponent(email)}`),

  logout: () =>
    apiCall('/auth/logout', { method: 'POST' }),

  me: () =>
    apiCall('/auth/me'),
};

/**
 * 支付相关 API
 */
export const paymentApi = {
  createOrder: (data: {
    planId: string;
    email: string;
    name: string;
  }) =>
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

  updateUserInfo: (data: {
    orderId: string;
    bilibiliAccount: string;
    phone: string;
  }) =>
    apiCall('/payment/updateUserInfo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
