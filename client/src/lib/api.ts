/**
 * REST API — Java Spring Boot（context-path: /api）
 * 开发环境：Vite 将 /api 代理到 http://localhost:8080
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

type ApiCallOptions = RequestInit & { skipAuth?: boolean };

/**
 * 通用 API 调用（默认附带 Bearer，除非 skipAuth）
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  const token = skipAuth ? null : localStorage.getItem("authToken");

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("authToken");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string }).error ||
        (errorData as { message?: string }).message ||
        `HTTP ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

/** 当前用户（无 token 或 401 时返回 null，不抛错） */
export type UserMe = {
  /** 雪花 ID，后端以字符串序列化 */
  id: number | string;
  openId: string;
  email: string | null;
  name: string | null;
  loginMethod: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  lastSignedIn?: string;
};

export async function fetchCurrentUser(): Promise<UserMe | null> {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem("authToken");
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error || `HTTP ${res.status}`
    );
  }

  return res.json() as Promise<UserMe>;
}

export type AuthResponse = {
  id: number | string;
  email: string;
  name: string | null;
  token: string;
};

export type PaymentOrderResponse = {
  orderId?: number;
  transactionId?: string;
  planName?: string;
  price?: number | string;
  currency?: string;
  status?: string;
  infoSubmitted?: boolean;
};

export type PricingPlanDto = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};

export type CreateOrderResponse = {
  orderId: number | string;
  paymentUrl: string;
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
};

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    targetCompanies?: string[];
    experienceYears?: number;
  }) =>
    apiCall<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  login: (data: { email: string; password: string }) =>
    apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  checkEmailExists: (email: string) =>
    apiCall<{ exists: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
      { skipAuth: true }
    ),

  logout: () => apiCall<{ success: boolean }>("/auth/logout", { method: "POST" }),
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
    apiCall<CreateOrderResponse>("/payment/createOrder", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOrder: (orderId: string) =>
    apiCall<PaymentOrderResponse>(`/payment/order/${orderId}`),

  getPricingPlans: () => apiCall<PricingPlanDto[]>("/payment/plans"),

  notifyAlipay: (params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/payment/notifyAlipay?${queryString}`, {
      method: "POST",
    });
  },

  updateUserInfo: (data: {
    orderId: string;
    bilibiliAccount: string;
    phone: string;
  }) =>
    apiCall("/payment/updateUserInfo", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
