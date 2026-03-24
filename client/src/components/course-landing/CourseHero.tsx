import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "wouter";
import { BRAND } from "@/branding";
import { TrialJoinButton } from "@/components/checkout/TrialJoinButton";
import { getJobOrigin } from "@/siteEntry";

/** 首页导师展示（示例信息可替换真人） */
const mentors = [
  {
    name: "雅典娜 Coder · Athena",
    title: "主理人 · 华人赴美求职体系课作者",
    subtitle: "聚焦简历 / 面试 / 谈判全链路",
    initial: "雅",
    imageClass: "bg-gradient-to-br from-sky-500 to-indigo-600",
  },
  {
    name: "合作导师（示例）",
    title: "Senior SWE @ US Tech",
    subtitle: "Mock 面试 · 系统设计 · 行为面",
    initial: "M",
    imageClass: "bg-gradient-to-br from-emerald-500 to-teal-700",
  },
];

export default function CourseHero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-sky-50/80 via-white to-white">
      {/* 装饰：浅色虚线感（近似参考站的 circuit 线） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 48px, oklch(0.85 0.08 240 / 0.35) 48px, oklch(0.85 0.08 240 / 0.35) 49px)",
        }}
      />

      <div className="container relative py-10 md:py-16">
        <nav className="mb-8 font-dm-sans text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            首页 Home
          </Link>
          <span className="mx-2 text-muted-foreground/50">/</span>
          <span className="text-foreground">雅典娜编程 · Athena Programming</span>
        </nav>

        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 font-dm-sans text-sm font-medium text-primary">{BRAND.siteBilingual}</p>
          <h1 className="font-serif-sc text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            学会如何
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              敲开美国科技岗大门
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-dm-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            系统化内容 + 导师答疑 + 可复用资源，面向华人程序员的美国求职路径。
            <span className="mt-2 block text-sm text-muted-foreground/90">
              Structured coaching, curated resources, and mentor support — built for Chinese-speaking engineers targeting US roles.
            </span>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <TrialJoinButton
              size="lg"
              className="h-12 rounded-full bg-sky-600 px-10 font-dm-sans text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700"
            >
              Join Now · 前往 /price
            </TrialJoinButton>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-sky-200 font-dm-sans"
              onClick={() => scrollTo("#curriculum")}
            >
              <Play className="mr-2 h-4 w-4" />
              课程大纲 · Syllabus
            </Button>
          </div>
          <p className="mt-4 font-dm-sans text-xs text-muted-foreground">
            Join 将进入 member 站内页面 <code>/price</code>。$39 体系课在{" "}
            <a href={`${getJobOrigin()}/`} className="text-primary underline">
              job.athenaprogramming.com
            </a>
            。
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {mentors.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-2xl border border-sky-100 bg-white/90 shadow-md shadow-sky-900/5 backdrop-blur-sm"
            >
              <div className="border-b border-sky-50 bg-white px-4 py-3 text-left">
                <p className="font-dm-sans text-xs font-semibold text-foreground">{m.name}</p>
                <p className="font-dm-sans text-[11px] text-muted-foreground">{m.title}</p>
                <p className="mt-0.5 font-dm-sans text-[11px] text-muted-foreground/80">{m.subtitle}</p>
              </div>
              <div className={`flex aspect-[16/10] items-center justify-center ${m.imageClass}`}>
                <span className="font-serif-sc text-5xl font-bold text-white/95">{m.initial}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
