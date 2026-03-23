import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Play } from "lucide-react";
import { Link } from "wouter";
import { BRAND, PRICE_USD } from "@/branding";

const bullets: { zh: string; en: string }[] = [
  {
    zh: "覆盖简历 → 投递 → 行为面 → 技术面 → Offer 谈判全链路",
    en: "Full pipeline: resume → apply → behavioral → technical → offer",
  },
  {
    zh: "1v1 导师 + 可复盘的 Mock 与资料库",
    en: "1:1 coaching, mock interviews & structured resources",
  },
  {
    zh: "面向美国科技公司岗位（含 FAANG / 独角兽）",
    en: "Focused on US tech roles (FAANG & high-growth startups)",
  },
];

export default function CourseHero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="border-b bg-muted/40">
      <div className="container py-8 md:py-12">
        <nav className="mb-6 font-dm-sans text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            首页 Home
          </Link>
          <span className="mx-2 text-muted-foreground/50">/</span>
          <span className="text-foreground">体系化求职课 · Structured Job Search</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
          <div>
            <p className="mb-3 font-dm-sans text-sm font-medium text-accent">
              {BRAND.siteBilingual} · {BRAND.personaBilingual}
            </p>
            <h1 className="font-serif-sc text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              拿下你的第一份美国科技岗 Offer
            </h1>
            <p className="mt-2 font-dm-sans text-base text-muted-foreground md:text-lg">
              Land your first US tech offer — a structured path for Chinese-speaking engineers.
            </p>
            <p className="mt-4 max-w-2xl font-dm-sans text-lg leading-relaxed text-muted-foreground">
              系统化路径 + 实战演练，专为华人程序员设计。从简历到谈判，把「不知道怎么准备」变成「每一步都有抓手」。
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
              <Button
                size="lg"
                className="font-dm-sans bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/pricing">查看方案与定价 · View pricing</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-dm-sans border-foreground/20"
                onClick={() => scrollTo("#curriculum")}
              >
                <Play className="mr-2 h-4 w-4" />
                免费试听大纲 · Preview
              </Button>
            </div>
          </div>

          <Card className="border-foreground/10 shadow-lg lg:sticky lg:top-20">
            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/90 to-primary">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center text-primary-foreground">
                <Play className="mb-3 h-14 w-14 opacity-90" strokeWidth={1.25} />
                <p className="font-serif-sc text-lg font-semibold">体系课导览</p>
                <p className="mt-1 font-dm-sans text-sm text-primary-foreground/80">Program overview · Try before you buy</p>
              </div>
            </div>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="font-dm-sans text-3xl font-semibold text-foreground">
                  ${PRICE_USD}
                  <span className="text-lg font-normal text-muted-foreground"> USD</span>
                </p>
                <p className="mt-1 font-dm-sans text-sm text-muted-foreground">
                  与定价页一致 · Same price on the pricing page
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full font-dm-sans bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/pricing">立即了解方案 · Get started</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-dm-sans"
                  onClick={() => scrollTo("#curriculum")}
                >
                  免费试听 · Free preview
                </Button>
              </div>
              <p className="text-center font-dm-sans text-xs text-muted-foreground">
                可先浏览大纲与试听 · Review the curriculum first, then pick a plan
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
