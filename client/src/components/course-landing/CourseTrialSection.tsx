import { Check } from "lucide-react";
import { TRIAL_PRICE_USD } from "@/branding";
import { TrialJoinButton } from "@/components/checkout/TrialJoinButton";
import { getJobOrigin } from "@/siteEntry";

const features: { zh: string; en: string }[] = [
  { zh: "定期答疑与直播（按排期）", en: "Live Q&A sessions (scheduled)" },
  { zh: "求职专题与资料库访问", en: "Topic library & curated resources" },
  { zh: "体系课大纲与试听内容", en: "Course outline & preview lessons" },
  { zh: "简历 / 项目清单模板", en: "Resume & project checklist templates" },
  { zh: "社群互助与内推信息（不定期）", en: "Community & referral signals" },
  { zh: "与同类背景同学交流", en: "Peer network of like-minded engineers" },
];

/**
 * 站点一：仅 $1 心智；Join → member 站内 /price。$39 不从这里进。
 */
export default function CourseTrialSection() {
  return (
    <section
      id="trial"
      className="scroll-mt-20 border-b bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-900 py-16 md:py-20"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="text-white">
            <h2 className="font-serif-sc text-3xl font-bold tracking-tight md:text-4xl">敲开美国科技岗</h2>
            <p className="mt-2 font-dm-sans text-lg text-sky-100">先加入 Launch 试用 · Try the community first</p>
            <p className="mt-4 font-dm-sans text-sm leading-relaxed text-sky-200/90">
              向下滚动可查看课程大纲。$39 完整方案在{" "}
              <a href={`${getJobOrigin()}/`} className="font-medium text-white underline">
                job 站
              </a>
              （Thinkific 式入口）。
            </p>
          </div>

          <div className="rounded-2xl border-2 border-sky-300/50 bg-white p-6 shadow-2xl shadow-black/20 md:p-8">
            <p className="font-serif-sc text-lg font-semibold text-foreground">会员试用 · Membership trial</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-dm-sans text-5xl font-bold text-sky-800">${TRIAL_PRICE_USD}</span>
              <span className="font-dm-sans text-sky-600">/ 月 · per month</span>
            </div>
            <p className="mt-2 font-dm-sans text-sm text-muted-foreground">首页只展示 $1；点 Join 进入 member 站内 /price。</p>

            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f.zh} className="flex gap-3 font-dm-sans text-sm text-foreground/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2.5} />
                  <span>
                    {f.zh}
                    <span className="mt-0.5 block text-xs text-muted-foreground">{f.en}</span>
                  </span>
                </li>
              ))}
            </ul>

            <TrialJoinButton className="mt-8 h-12 w-full rounded-full bg-sky-600 font-dm-sans text-base font-semibold text-white hover:bg-sky-700">
              Join Now · $1 入口
            </TrialJoinButton>
            <p className="mt-3 text-center font-dm-sans text-[11px] text-muted-foreground">
              进入站内 /price 页面 · Internal trial entry
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
