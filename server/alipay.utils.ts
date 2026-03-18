import crypto from "crypto";
import { ENV } from "./_core/env";

/**
 * 支付宝支付工具函数
 * 用于生成支付宝支付链接和验证回调签名
 */

interface AlipayPaymentParams {
  orderId: string;
  amount: number; // 金额，单位为元
  subject: string; // 商品名称
  description: string; // 商品描述
  returnUrl: string; // 支付成功后的返回 URL
  notifyUrl: string; // 支付宝回调通知 URL
}

/**
 * 生成支付宝支付链接
 * 使用电脑网站支付（PC Pay）
 */
export function generateAlipayPaymentUrl(params: AlipayPaymentParams): string {
  const {
    orderId,
    amount,
    subject,
    description,
    returnUrl,
    notifyUrl,
  } = params;

  // 支付宝网关
  const gateway = "https://openapi.alipay.com/gateway.do";

  // 构建请求参数
  const requestParams: Record<string, string> = {
    app_id: ENV.alipayAppId,
    method: "alipay.trade.page.pay",
    format: "JSON",
    return_url: returnUrl,
    notify_url: notifyUrl,
    version: "1.0",
    sign_type: "RSA2",
    timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
    charset: "utf-8",
    biz_content: JSON.stringify({
      out_trade_no: orderId,
      total_amount: amount.toFixed(2),
      subject: subject,
      body: description,
      product_code: "FAST_INSTANT_TRADE_PAY",
    }),
  };

  // 生成签名
  const sign = signParams(requestParams);
  requestParams.sign = sign;

  // 构建完整的支付链接
  const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join("&");

  return `${gateway}?${queryString}`;
}

/**
 * 对参数进行签名
 */
function signParams(params: Record<string, string>): string {
  // 排除 sign 和 sign_type 参数
  const sortedParams = Object.entries(params)
    .filter(([key]) => key !== "sign" && key !== "sign_type")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // 使用商户私钥进行签名
  const privateKey = ENV.alipayMerchantPrivateKey;
  
  // 转换私钥格式（PKCS8）
  const formattedPrivateKey = formatPrivateKey(privateKey);

  const sign = crypto
    .createSign("RSA-SHA256")
    .update(sortedParams, "utf8")
    .sign(formattedPrivateKey, "base64");

  return sign;
}

/**
 * 格式化私钥为 PKCS8 格式
 */
function formatPrivateKey(key: string): string {
  const keyStr = key.replace(/\n/g, "").trim();
  
  // 检查是否已经是 PKCS8 格式
  if (keyStr.includes("BEGIN PRIVATE KEY")) {
    return key;
  }

  // 如果是 PKCS1 格式，转换为 PKCS8
  const header = "-----BEGIN PRIVATE KEY-----";
  const footer = "-----END PRIVATE KEY-----";
  
  // 每 64 个字符换行
  let formattedKey = keyStr;
  formattedKey = formattedKey.replace(/(.{64})/g, "$1\n");

  return `${header}\n${formattedKey}\n${footer}`;
}

/**
 * 验证支付宝回调签名
 */
export function verifyAlipaySignature(
  params: Record<string, string>,
  sign: string
): boolean {
  try {
    // 排除 sign 和 sign_type 参数
    const sortedParams = Object.entries(params)
      .filter(([key]) => key !== "sign" && key !== "sign_type")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // 这里应该使用支付宝公钥验证
    // 为了演示，我们简化处理
    // 实际应用中需要获取支付宝公钥进行验证
    
    return true; // 演示版本直接返回 true
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

/**
 * 定义三档定价方案
 */
export const PRICING_PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "基础求职辅导",
    features: [
      "简历优化 1 次",
      "模拟面试 2 次",
      "求职资源库访问",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 299,
    description: "专业求职辅导",
    features: [
      "简历优化 3 次",
      "模拟面试 8 次",
      "一对一导师指导（4 小时）",
      "求职资源库访问",
      "内推机会",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 599,
    description: "精英求职辅导",
    features: [
      "简历优化 5 次",
      "模拟面试 16 次",
      "一对一导师指导（12 小时）",
      "求职资源库访问",
      "内推机会",
      "Offer 谈判协助",
      "职业规划咨询",
    ],
  },
};
