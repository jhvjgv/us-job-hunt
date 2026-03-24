/**
 * 双站模式（对齐 SWE Launchpad）：
 * - 站点一：营销首页 → Join Now → 外部 $1 结账（第二个链接，如 Circle）
 * - 站点二：/program → 外部 $39 结账（第三个链接）
 *
 * 构建时注入：
 *   VITE_TRIAL_CHECKOUT_URL      — $1 结账页完整 URL
 *   VITE_FULL_PROGRAM_CHECKOUT_URL — $39 结账页完整 URL
 */

export function getTrialCheckoutUrl(): string {
  const v = import.meta.env.VITE_TRIAL_CHECKOUT_URL;
  return typeof v === "string" ? v.trim() : "";
}

export function getFullProgramCheckoutUrl(): string {
  const v = import.meta.env.VITE_FULL_PROGRAM_CHECKOUT_URL;
  return typeof v === "string" ? v.trim() : "";
}

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}
