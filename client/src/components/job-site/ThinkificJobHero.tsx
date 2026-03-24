import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Play } from "lucide-react";
import { Link } from "wouter";
import { BRAND, PRICE_USD } from "@/branding";
import { FullProgramCheckoutButton } from "@/components/checkout/FullProgramCheckoutButton";
import { getMemberOrigin } from "@/siteEntry";

const bullets: { zh: string; en: string }[] = [
  {
    zh: "简历 → 投递 → 行为面 → 技术面 → Offer 谈判",
    en: "Resume → apply → behavioral → technical → offer",
  },
  {
    zh: "可折叠大纲 + 试听 · 与 Thinkific 课程页同类信息架构",
    en: "Expandable syllabus & previews — course-landing style",
  },
];

/**
 * job 域名首页首屏：Thinkific 式双栏 + 右侧 $39 卡（参考 land-tech-job 结构）
 */
export default function ThinkificJobHero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const memberUrl = `${getMemberOrigin()}/`;

  return (
    <section className="border-b bg-muted/40">
      <div className="container py-8 md:py-12">
        <nav className="mb-6 font-dm-sans text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            首页 Home
          </Link>
          <span className="mx-2 text-muted-foreground/50">/</span>
          <span className="text-foreground">体系化求职课 · US Tech Offer</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
          <div>
            <p className="mb-3 font-dm-sans text-sm font-medium text-accent">
              {BRAND.siteBilingual} · 正式课入口
            </p>
            <h1 className="font-serif-sc text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.65rem]">
              拿下你的第一份美国科技岗 Offer
            </h1>
            <p className="mt-2 font-dm-sans text-base text-muted-foreground md:text-lg">
              Full US tech job program — structured path for Chinese-speaking engineers.
            </p>
            <p className="mt-4 max-w-2xl font-dm-sans text-lg leading-relaxed text-muted-foreground">
              本页为 <strong className="text-foreground">$39 体系课</strong> 主入口；$1 试用请前往{" "}
              <a href={memberUrl} className="font-medium text-primary underline">
                member.athenaprogramming.com
              </a>
              。
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map((t) => (
                <li key={t.zh} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <div className="font-dm-sans text-sm text-foreground/90">
                    <p>{t.zh}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.en}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <FullProgramCheckoutButton
                size="lg"
                className="font-dm-sans bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Join Now · 前往 $39 结账
              </FullProgramCheckoutButton>
              <Button
                size="lg"
                variant="outline"
                className="font-dm-sans border-foreground/20"
                onClick={() => scrollTo("#curriculum")}
              >
                <Play className="mr-2 h-4 w-4" />
                课程大纲 · Preview
              </Button>
            </div>
          </div>

          <Card className="border-foreground/10 shadow-lg lg:sticky lg:top-20">
            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/90 to-primary">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center text-primary-foreground">
                <Play className="mb-3 h-14 w-14 opacity-90" strokeWidth={1.25} />
                <p className="font-serif-sc text-lg font-semibold">体系课导览</p>
                <p className="mt-1 font-dm-sans text-sm text-primary-foreground/80">Program overview</p>
              </div>
            </div>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="font-dm-sans text-3xl font-semibold text-foreground">
                  ${PRICE_USD}
                  <span className="text-lg font-normal text-muted-foreground"> USD</span>
                </p>
                <p className="mt-1 font-dm-sans text-sm text-muted-foreground">
                  本域名专用于完整价 · Full price on job subdomain
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <FullProgramCheckoutButton className="w-full font-dm-sans bg-accent text-accent-foreground hover:bg-accent/90">
                  立即加入 · Join
                </FullProgramCheckoutButton>
                <Button
                  variant="outline"
                  className="w-full font-dm-sans"
                  onClick={() => scrollTo("#curriculum")}
                >
                  先看大纲 · Syllabus
                </Button>
              </div>
              <p className="text-center font-dm-sans text-xs text-muted-foreground">
                <a href={memberUrl} className="text-primary underline">
                  只要 $1 试用？去会员站
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
