/**
 * 双域名入口（同一套前端、两次构建可共用 dist）：
 * - member.athenaprogramming.com → $1 试用 / SWE 风格（参考 swelaunchpad.com）
 * - job.athenaprogramming.com   → $39 体系课 / Thinkific 风格（参考 Thinkific 课程页）
 *
 * 本地开发：在 .env 设置 VITE_SITE_ENTRY=member | job
 */

export type SiteEntry = "member" | "job";

const FORCED = import.meta.env.VITE_SITE_ENTRY;

export function getSiteEntry(): SiteEntry {
  if (FORCED === "member" || FORCED === "job") return FORCED;

  if (typeof window === "undefined") return "job";

  const host = window.location.hostname;
  if (host.startsWith("member.")) return "member";
  return "job";
}

/** $1 站公网根 URL（无尾斜杠） */
export function getMemberOrigin(): string {
  const v = import.meta.env.VITE_MEMBER_SITE_ORIGIN;
  if (typeof v === "string" && v.trim()) return v.trim().replace(/\/$/, "");
  return "https://member.athenaprogramming.com";
}

/** $39 站公网根 URL（无尾斜杠） */
export function getJobOrigin(): string {
  const v = import.meta.env.VITE_JOB_SITE_ORIGIN;
  if (typeof v === "string" && v.trim()) return v.trim().replace(/\/$/, "");
  return "https://job.athenaprogramming.com";
}
