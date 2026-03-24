import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BRAND, TRIAL_PRICE_USD } from "@/branding";
import { getJobOrigin } from "@/siteEntry";

export default function MemberPrice() {
  const jobUrl = `${getJobOrigin()}/`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-background p-8 shadow-sm">
        <p className="font-serif-sc text-2xl font-semibold text-foreground">{BRAND.siteZh}</p>
        <p className="mt-1 font-dm-sans text-sm text-muted-foreground">Membership trial checkout page</p>

        <h1 className="mt-8 font-serif-sc text-3xl font-bold text-foreground">$1 试用入口</h1>
        <p className="mt-3 font-dm-sans text-muted-foreground">
          这是 member 子域名的站内入口页：<code className="rounded bg-muted px-1.5 py-0.5">/price</code>。
          你可以把这里当作「第二个网站」的目标 URL。
        </p>

        <div className="mt-8 rounded-xl border bg-card p-6">
          <p className="font-dm-sans text-4xl font-bold text-sky-700">${TRIAL_PRICE_USD}</p>
          <p className="mt-1 font-dm-sans text-sm text-muted-foreground">per month trial</p>
          <p className="mt-4 font-dm-sans text-sm text-muted-foreground">
            当前版本为站内入口页；如果未来要真正在线收取 $1，可再接支付产品与后端订单逻辑。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">立即注册</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href={jobUrl}>去 $39 体系课站</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
