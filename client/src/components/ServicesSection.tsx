/*
 * Services Section
 * Design: 非对称布局，左侧大标题 + 右侧卡片网格
 * Cards: 悬停上浮 + 橙色边框高亮
 */

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Code2,
  Network,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "简历精准优化",
    desc: "针对美国科技公司 ATS 系统深度优化，突出技术亮点，让简历通过率提升 3 倍。",
    tag: "基础必备",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Code2,
    title: "算法面试特训",
    desc: "LeetCode 高频题系统刷题 + 真题复盘，覆盖 FAANG 全套算法面试题库。",
    tag: "核心服务",
    color: "text-[#E8603C]",
    bg: "bg-orange-50",
  },
  {
    icon: Network,
    title: "系统设计进阶",
    desc: "从 URL Shortener 到分布式系统，手把手拆解 Senior / Staff 级系统设计题。",
    tag: "高阶提升",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "行为面试辅导",
    desc: "STAR 法则实战演练，针对亚裔沟通习惯定制表达策略，让 Hiring Manager 记住你。",
    tag: "软实力",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: TrendingUp,
    title: "Offer 谈判策略",
    desc: "薪资谈判话术 + 竞争 Offer 策略，平均帮学员多谈 15-30% 的薪资包。",
    tag: "增值服务",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "签证 & 移民规划",
    desc: "H1B 抽签策略、OPT 续签、绿卡路径全面解析，让你安心在美长期发展。",
    tag: "长期规划",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
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

  const Icon = service.icon;

  return (
    <div
      ref={ref}
      className={`card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-default transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center`}>
          <Icon size={22} className={service.color} />
        </div>
        <span className={`text-xs font-dm-sans font-medium px-2.5 py-1 rounded-full ${service.bg} ${service.color}`}>
          {service.tag}
        </span>
      </div>
      <h3 className="font-serif-sc font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
      <p className="font-dm-sans text-sm text-gray-500 leading-relaxed">{service.desc}</p>
    </div>
  );
}

export default function ServicesSection() {
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
    <section id="services" className="py-20 bg-gray-50">
      <div className="container">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-xl mb-14 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
            <span className="font-dm-sans text-sm text-[#E8603C] font-semibold uppercase tracking-wider">
              核心服务
            </span>
          </div>
          <h2 className="font-serif-sc font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
            求职全链路，
            <br />
            <span className="text-[#1B2B4B]">我们全程陪跑</span>
          </h2>
          <p className="font-dm-sans text-gray-500 leading-relaxed">
            从简历到 Offer，覆盖美国科技公司求职的每一个关键环节。
            不是碎片化的课程，而是系统化的求职解决方案。
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
