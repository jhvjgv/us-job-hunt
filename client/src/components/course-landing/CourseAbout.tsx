import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const stats = [
  { value: "30+", label: "节以上内容与任务", labelEn: "Lessons & tasks" },
  { value: "20+", label: "小时可复看辅导与录播", labelEn: "Hours of coaching & replay" },
  { value: "1v1", label: "导师陪跑（按套餐）", labelEn: "1:1 mentorship (by plan)" },
];

export default function CourseAbout() {
  return (
    <section id="about-course" className="scroll-mt-20 border-t bg-muted/30 py-14 md:py-20">
      <div className="container max-w-3xl">
        <h2 className="font-serif-sc text-2xl font-bold text-foreground md:text-3xl">关于本课程</h2>
        <p className="mt-1 font-dm-sans text-sm uppercase tracking-wide text-muted-foreground">About this program</p>
        <p className="mt-4 font-dm-sans leading-relaxed text-muted-foreground">
          上方为课程信息与方案入口，中部为可折叠大纲；此处汇总课时规模与辅导形式，便于你判断是否与当前求职阶段匹配。
        </p>
        <p className="mt-2 font-dm-sans text-sm leading-relaxed text-muted-foreground/90">
          Above: course overview & pricing entry. Middle: expandable syllabus. Here: volume & format at a glance.
        </p>

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
          <Button size="lg" className="w-full font-dm-sans sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/pricing">立即了解方案 · View plans</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full font-dm-sans sm:w-auto" asChild>
            <Link href="/register">注册并开始 · Register</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
