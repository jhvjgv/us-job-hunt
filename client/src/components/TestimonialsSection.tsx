/*
 * Testimonials Section - 成功案例
 * Design: 白底，卡片式布局，头像 + 公司 Logo + 薪资数字
 */

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const SUCCESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452981219/jKTVo2pKdeetrYkgT9nWL4/success-story-gSfBUb6woqZs6xVbEg7byd.webp";
const INTERVIEW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452981219/jKTVo2pKdeetrYkgT9nWL4/interview-prep-Gb6kihTmLjZitRVvdBThSt.webp";

const testimonials = [
  {
    name: "张伟",
    from: "北京大学 CS 硕士",
    company: "Google",
    role: "Software Engineer L4",
    salary: "$185K",
    avatar: "张",
    color: "bg-blue-500",
    quote:
      "在美职通的帮助下，我从零开始准备，3 个月内拿到了 Google 的 Offer。导师不仅帮我刷题，还帮我彻底改变了面试思维方式。系统设计那块之前完全不懂，现在可以流畅地讲 1 小时。",
    tags: ["算法特训", "系统设计", "内推"],
  },
  {
    name: "李晓雯",
    from: "复旦大学 → 美国工作 2 年",
    company: "Meta",
    role: "Senior SWE",
    salary: "$240K",
    avatar: "李",
    color: "bg-purple-500",
    quote:
      "我之前在一家小公司工作，想跳槽到大厂但不知道从哪里入手。美职通帮我制定了完整的跳槽计划，从简历到谈判全程陪跑。最终拿到了 Meta Senior 的 Offer，薪资直接翻倍！",
    tags: ["简历优化", "行为面试", "Offer 谈判"],
  },
  {
    name: "王浩然",
    from: "清华大学 → 国内 5 年经验",
    company: "Amazon",
    role: "SDE II",
    salary: "$195K",
    avatar: "王",
    color: "bg-orange-500",
    quote:
      "国内工作 5 年想来美国，英语面试是最大的障碍。美职通的导师帮我专门训练英语表达，用 STAR 法则重构我的项目经历。面试时感觉非常自信，Amazon 一轮过！",
    tags: ["行为面试", "英语表达", "签证规划"],
  },
  {
    name: "陈思远",
    from: "上海交通大学 → OPT 在读",
    company: "Stripe",
    role: "Software Engineer",
    salary: "$175K",
    avatar: "陈",
    color: "bg-teal-500",
    quote:
      "OPT 期间找工作压力很大，时间紧迫。美职通帮我快速锁定目标公司，高效准备，在 OPT 到期前 2 个月就拿到了 Stripe 的 Offer，省去了很多焦虑。",
    tags: ["OPT 求职", "算法特训", "内推"],
  },
];

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-600 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <div className="relative mb-5">
        <Quote size={20} className="text-gray-200 absolute -top-1 -left-1" />
        <p className="font-dm-sans text-sm text-gray-600 leading-relaxed pl-4 italic">
          "{t.quote}"
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {t.tags.map((tag) => (
          <span
            key={tag}
            className="font-dm-sans text-xs text-[#1B2B4B] bg-blue-50 px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Profile */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-serif-sc font-bold text-white`}>
            {t.avatar}
          </div>
          <div>
            <div className="font-serif-sc font-bold text-gray-900 text-sm">{t.name}</div>
            <div className="font-dm-sans text-xs text-gray-400">{t.from}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-dm-sans font-bold text-[#E8603C] text-sm">{t.salary}/yr</div>
          <div className="font-dm-sans text-xs text-gray-500">{t.company} · {t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div
          ref={titleRef}
          className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
            <span className="font-dm-sans text-sm text-[#E8603C] font-semibold uppercase tracking-wider">
              成功案例
            </span>
            <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
          </div>
          <h2 className="font-serif-sc font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
            1200+ 学员已成功拿到
            <br />
            <span className="text-[#E8603C]">顶级科技公司 Offer</span>
          </h2>
          <p className="font-dm-sans text-gray-500">
            他们和你有相似的背景，也曾面临同样的困惑。看看他们是如何做到的。
          </p>
        </div>

        {/* Featured Image + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-64 lg:h-auto">
            <img
              src={SUCCESS_IMG}
              alt="成功案例"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B2B4B]/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-serif-sc font-bold text-white text-2xl mb-1">
                平均薪资提升 <span className="text-[#E8603C]">85%</span>
              </div>
              <div className="font-dm-sans text-white/70 text-sm">
                相比入学前，学员平均薪资涨幅
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { emoji: "🏆", title: "FAANG Offer 率", value: "68%", desc: "学员中拿到 FAANG 级别 Offer" },
              { emoji: "⚡", title: "平均求职周期", value: "11周", desc: "从开始准备到拿到 Offer" },
              { emoji: "💰", title: "最高年薪", value: "$380K", desc: "学员拿到的最高 TC" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-dm-sans text-xs text-gray-500">{item.title}</span>
                </div>
                <div className="font-serif-sc font-bold text-2xl text-[#1B2B4B]">{item.value}</div>
                <div className="font-dm-sans text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
