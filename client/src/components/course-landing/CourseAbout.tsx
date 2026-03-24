import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FullProgramCheckoutButton } from "@/components/checkout/FullProgramCheckoutButton";
import { getJobOrigin, getMemberOrigin } from "@/siteEntry";

const stats = [
  { value: "30+", label: "节以上内容与任务", labelEn: "Lessons & tasks" },
  { value: "20+", label: "小时可复看辅导与录播", labelEn: "Hours of coaching & replay" },
  { value: "1v1", label: "导师陪跑（按套餐）", labelEn: "1:1 mentorship (by plan)" },
];

export default function CourseAbout({ variant }: { variant: "member" | "job" }) {
  const jobUrl = `${getJobOrigin()}/`;
  const memberUrl = `${getMemberOrigin()}/`;

  return (
    <section id="about-course" className="scroll-mt-20 border-t bg-muted/30 py-14 md:py-20">
      <div className="container max-w-3xl">
        <h2 className="font-serif-sc text-2xl font-bold text-foreground md:text-3xl">关于本课程</h2>
        <p className="mt-1 font-dm-sans text-sm uppercase tracking-wide text-muted-foreground">About this program</p>

        {variant === "member" ? (
          <>
            <p className="mt-4 font-dm-sans leading-relaxed text-muted-foreground">
              当前为 <strong className="text-foreground">$1 试用入口站</strong>（member 域名）。完整体系课与 $39 标价在{" "}
              <a href={jobUrl} className="text-primary underline">
                job.athenaprogramming.com
              </a>{" "}
              展示与结账。
            </p>
            <p className="mt-2 font-dm-sans text-sm leading-relaxed text-muted-foreground/90">
              Member subdomain = trial / SWE-style landing. Full program lives on the job subdomain.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 font-dm-sans leading-relaxed text-muted-foreground">
              当前为 <strong className="text-foreground">$39 体系课入口站</strong>（job 域名）。$1 试用请前往{" "}
              <a href={memberUrl} className="text-primary underline">
                member.athenaprogramming.com
              </a>
              。
            </p>
            <p className="mt-2 font-dm-sans text-sm leading-relaxed text-muted-foreground/90">
              Job subdomain = Thinkific-style course page & full-price checkout.
            </p>
          </>
        )}

        <ul className="mt-8 divide-y rounded-xl border bg-background">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col gap-1 px-5 py-4 font-dm-sans sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-muted-foreground">{s.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground/80">{s.labelEn}</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{s.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {variant === "member" ? (
            <Button size="lg" className="w-full font-dm-sans sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href={jobUrl}>前往 $39 体系课站 · Open job site</a>
            </Button>
          ) : (
            <FullProgramCheckoutButton
              size="lg"
              className="w-full font-dm-sans sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
            >
              $39 完整方案结账 · Checkout
            </FullProgramCheckoutButton>
          )}
          <Button size="lg" variant="outline" className="w-full font-dm-sans sm:w-auto" asChild>
            <Link href="/register">注册并开始 · Register</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
