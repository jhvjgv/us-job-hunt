/**
 * 雅典娜编程 Athena Programming — 品牌与双语文案
 * 展示策略：中文为主，关键位置附英文（非完整逐句翻译）
 */

export const BRAND = {
  siteZh: "雅典娜编程",
  siteEn: "Athena Programming",
  /** 一行展示 */
  siteBilingual: "雅典娜编程 · Athena Programming",
  /** 个人 IP */
  personaZh: "雅典娜 Coder",
  personaEn: "Athena",
  personaBilingual: "雅典娜 Coder · Athena",
  /** Logo 角标单字 */
  logoMark: "雅",
} as const;

export function copyrightLine(year: number) {
  return `© ${year} ${BRAND.siteZh} ${BRAND.siteEn}. All rights reserved.`;
}

/** 联系信息占位 — 上线后替换为真实渠道 */
export const CONTACT = {
  wechat: "AthenaProgramming",
  email: "hello@athenaprogramming.com",
} as const;

/** 正式课 / 会员价：与后端 PaymentService 一致，仅在定价页展示 */
export const PRICE_USD = 39 as const;

/** 首页展示的试用价（Landing 用，不参与后端订单逻辑，除非你以后单独接 $1 产品） */
export const TRIAL_PRICE_USD = 1 as const;
