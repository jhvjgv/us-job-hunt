/*
 * Hero Section
 * Design: 全屏深色背景 + 右侧图片，大标题 Noto Serif SC，数字统计卡片浮动
 * Background: hero-bg.jpg with dark overlay
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452981219/jKTVo2pKdeetrYkgT9nWL4/hero-bg-MXwSH2FeAyo7YsPmhoFFKR.webp";

const stats = [
  { value: 1200, suffix: "+", label: "成功拿 Offer" },
  { value: 95, suffix: "%", label: "面试通过率" },
  { value: 180, suffix: "K+", label: "平均年薪 (USD)" },
  { value: 8, suffix: "年", label: "专注美国求职" },
];

function useCountUp(target: number, duration = 2000, started: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatCard({ value, suffix, label, started }: { value: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, 2000, started);
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-center min-w-[110px]">
      <div className="font-serif-sc font-bold text-2xl md:text-3xl text-white leading-none">
        {count}{suffix}
      </div>
      <div className="font-dm-sans text-xs text-white/70 mt-1">{label}</div>
    </div>
  );
}

const highlights = [
  "FAANG / 独角兽公司内推资源",
  "1v1 专属导师全程陪跑",
  "算法 + 系统设计 + 行为面试",
];

export default function HeroSection() {
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark overlay with navy gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2e]/92 via-[#1B2B4B]/85 to-[#1B2B4B]/50" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="container relative z-10 pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E8603C]/20 border border-[#E8603C]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E8603C] animate-pulse" />
            <span className="font-dm-sans text-sm text-[#E8603C] font-medium">专为华人程序员打造</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif-sc font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
            从国内到
            <span className="relative inline-block mx-2">
              <span className="text-[#E8603C]">硅谷</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0,5 Q25,0 50,5 Q75,0 100,5" stroke="#E8603C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br />最短路径
          </h1>

          <p className="font-dm-sans text-lg text-white/75 mb-6 leading-relaxed max-w-xl">
            8 年专注华人程序员赴美求职，系统化方法论 + 顶级内推网络，
            帮你高效拿下 <strong className="text-white">FAANG、独角兽</strong> 等顶级科技公司 Offer。
          </p>

          {/* Highlights */}
          <ul className="flex flex-col gap-2 mb-8">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 font-dm-sans text-sm text-white/80">
                <CheckCircle2 size={16} className="text-[#E8603C] flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              size="lg"
              className="bg-[#E8603C] hover:bg-[#d45530] text-white border-0 font-dm-sans text-base px-8 h-12 shadow-lg shadow-[#E8603C]/30 transition-all hover:scale-105"
              onClick={() => handleScroll("#pricing")}
            >
              立即免费咨询
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-transparent hover:bg-white/10 font-dm-sans text-base px-8 h-12"
              onClick={() => handleScroll("#testimonials")}
            >
              查看成功案例
            </Button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} started={statsStarted} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
