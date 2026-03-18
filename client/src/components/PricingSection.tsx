/*
 * Pricing Section - 定价方案
 * Design: 深海军蓝背景，三列定价卡，中间高亮推荐方案
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const plans = [
  {
    name: "自学辅助",
    nameEn: "Starter",
    price: "¥2,999",
    period: "/月",
    desc: "适合有一定基础、需要方向指引的求职者",
    highlight: false,
    features: [
      "个性化学习路线图",
      "每周 1 次 1v1 导师答疑（1小时）",
      "简历 Review（1次）",
      "算法题库访问权限",
      "求职社群加入",
      "面试经验分享库",
    ],
    cta: "开始自学计划",
    color: "border-gray-200",
  },
  {
    name: "全程陪跑",
    nameEn: "Pro",
    price: "¥8,999",
    period: "/月",
    desc: "最受欢迎，适合认真求职、想高效拿 Offer 的人",
    highlight: true,
    features: [
      "一切 Starter 包含的内容",
      "每周 3 次 1v1 导师辅导",
      "简历 + LinkedIn 深度优化",
      "Mock Interview 无限次",
      "系统设计专项训练",
      "内推人脉匹配",
      "Offer 谈判全程支持",
      "拿 Offer 退款保障",
    ],
    cta: "立即加入 Pro 计划",
    color: "border-[#E8603C]",
    badge: "最受欢迎",
  },
  {
    name: "精英冲刺",
    nameEn: "Elite",
    price: "¥19,999",
    period: "/次",
    desc: "适合冲击 Staff / Principal 或顶级公司的资深工程师",
    highlight: false,
    features: [
      "一切 Pro 包含的内容",
      "FAANG 内部导师 1v1",
      "Staff 级系统设计专训",
      "高管行为面试辅导",
      "薪资谈判专家介入",
      "3 个月全程不限次辅导",
      "入职后 30 天跟踪支持",
    ],
    cta: "申请精英计划",
    color: "border-gray-200",
  },
];

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
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
      className={`relative rounded-2xl border-2 ${plan.color} transition-all duration-600 ${
        plan.highlight
          ? "bg-white shadow-2xl shadow-[#E8603C]/20 scale-105 z-10"
          : "bg-white/5 backdrop-blur-sm"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-[#E8603C] text-white text-xs font-dm-sans font-semibold px-4 py-1.5 rounded-full shadow-lg">
            <Zap size={12} />
            {plan.badge}
          </div>
        </div>
      )}

      <div className="p-7">
        {/* Plan header */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`font-serif-sc font-bold text-xl ${plan.highlight ? "text-gray-900" : "text-white"}`}>
              {plan.name}
            </span>
            <span className={`font-dm-sans text-xs ${plan.highlight ? "text-gray-400" : "text-white/40"}`}>
              {plan.nameEn}
            </span>
          </div>
          <p className={`font-dm-sans text-xs leading-relaxed ${plan.highlight ? "text-gray-500" : "text-white/50"}`}>
            {plan.desc}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1 mb-7 pb-7 border-b border-current/10">
          <span className={`font-serif-sc font-bold text-4xl ${plan.highlight ? "text-gray-900" : "text-white"}`}>
            {plan.price}
          </span>
          <span className={`font-dm-sans text-sm mb-1 ${plan.highlight ? "text-gray-400" : "text-white/50"}`}>
            {plan.period}
          </span>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check
                size={15}
                className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-[#E8603C]" : "text-[#E8603C]"}`}
              />
              <span className={`font-dm-sans text-sm ${plan.highlight ? "text-gray-700" : "text-white/70"}`}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          className={`w-full h-11 font-dm-sans font-semibold ${
            plan.highlight
              ? "bg-[#E8603C] hover:bg-[#d45530] text-white border-0 shadow-lg shadow-[#E8603C]/30"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
          }`}
          onClick={() => window.location.href = "/pricing"}
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  );
}

export default function PricingSection() {
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
    <section id="pricing" className="py-20 bg-[#1B2B4B]">
      <div className="container">
        {/* Header */}
        <div
          ref={titleRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
            <span className="font-dm-sans text-sm text-[#E8603C] font-semibold uppercase tracking-wider">
              定价方案
            </span>
            <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
          </div>
          <h2 className="font-serif-sc font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
            投资自己，
            <span className="text-[#E8603C]">回报丰厚</span>
          </h2>
          <p className="font-dm-sans text-white/60">
            一次 Offer 谈判多出来的薪资，往往就能覆盖全部学费。
            选择最适合你的方案，我们承诺物超所值。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="font-dm-sans text-sm text-white/40">
            所有方案均支持分期付款 · 不满意随时退款 · 微信咨询：<span className="text-white/60">MeiZhiTong2024</span>
          </p>
        </div>
      </div>
    </section>
  );
}
