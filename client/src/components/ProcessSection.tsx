/*
 * Process Section - 求职路径时间轴
 * Design: 深海军蓝背景，时间轴竖线，步骤卡片交替左右
 * 右侧放配图
 */

import { useEffect, useRef, useState } from "react";

const TEAM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452981219/jKTVo2pKdeetrYkgT9nWL4/team-support-8QJtKfzhCEJFGM7p3CFxBc.webp";

const steps = [
  {
    num: "01",
    title: "免费评估诊断",
    desc: "1v1 视频通话，深度了解你的背景、目标公司和时间规划，制定个性化求职路线图。",
    duration: "第 1 周",
  },
  {
    num: "02",
    title: "简历 & 领英优化",
    desc: "资深导师逐行 Review，针对目标公司 JD 定制简历，优化 LinkedIn 关键词提升曝光。",
    duration: "第 1-2 周",
  },
  {
    num: "03",
    title: "算法 & 系统设计特训",
    desc: "按计划刷题 + 每周 Mock Interview，实时纠错，快速建立面试肌肉记忆。",
    duration: "第 2-8 周",
  },
  {
    num: "04",
    title: "内推 & 海投策略",
    desc: "匹配 500+ 内推人脉网络，同时辅助海投策略，最大化面试邀约数量。",
    duration: "第 4-10 周",
  },
  {
    num: "05",
    title: "面试全程陪跑",
    desc: "电话面试、技术面试、Onsite 全程备战，面试后复盘总结，持续优化表现。",
    duration: "第 6-12 周",
  },
  {
    num: "06",
    title: "Offer 谈判 & 入职",
    desc: "专业谈判话术辅导，竞争 Offer 策略，帮你拿到最优薪资包，顺利完成入职。",
    duration: "第 10-14 周",
  },
];

function StepItem({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex gap-6 transition-all duration-600 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline dot & line */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#E8603C] flex items-center justify-center font-dm-sans font-bold text-white text-sm flex-shrink-0 shadow-lg shadow-[#E8603C]/30">
          {step.num}
        </div>
        {index < steps.length - 1 && (
          <div className="w-px flex-1 bg-white/15 mt-2 min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-serif-sc font-bold text-white text-lg">{step.title}</h3>
          <span className="font-dm-sans text-xs text-[#E8603C] bg-[#E8603C]/15 px-2.5 py-0.5 rounded-full border border-[#E8603C]/30">
            {step.duration}
          </span>
        </div>
        <p className="font-dm-sans text-sm text-white/60 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export default function ProcessSection() {
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
    <section id="process" className="py-20 bg-[#1B2B4B]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Timeline */}
          <div>
            <div
              ref={titleRef}
              className={`mb-12 transition-all duration-700 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
                <span className="font-dm-sans text-sm text-[#E8603C] font-semibold uppercase tracking-wider">
                  求职路径
                </span>
              </div>
              <h2 className="font-serif-sc font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
                14 周系统化
                <br />
                <span className="text-[#E8603C]">求职冲刺计划</span>
              </h2>
              <p className="font-dm-sans text-white/60 leading-relaxed">
                经过 8 年打磨的标准化流程，确保每位学员都能在最短时间内
                做好充分准备，拿到心仪 Offer。
              </p>
            </div>

            <div>
              {steps.map((step, i) => (
                <StepItem key={step.num} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Image + Stats */}
          <div className="lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
              <img
                src={TEAM_IMG}
                alt="求职辅导团队"
                className="w-full h-80 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B4B]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: "500+", l: "内推人脉" },
                    { v: "1v1", l: "专属导师" },
                    { v: "24h", l: "响应时间" },
                    { v: "100%", l: "退款保障" },
                  ].map((item) => (
                    <div key={item.l} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="font-serif-sc font-bold text-xl text-white">{item.v}</div>
                      <div className="font-dm-sans text-xs text-white/70">{item.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guarantee badge */}
            <div className="mt-6 bg-[#E8603C]/10 border border-[#E8603C]/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8603C]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <div className="font-serif-sc font-bold text-white text-sm">拿 Offer 退款保障</div>
                <div className="font-dm-sans text-xs text-white/60 mt-0.5">
                  若完成全部课程后 6 个月内未拿到 Offer，全额退款，无条件。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
