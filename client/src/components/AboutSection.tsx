/*
 * About Section - 关于我们
 * Design: 白底，左侧图片 + 右侧文字，导师介绍卡片
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INTERVIEW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452981219/jKTVo2pKdeetrYkgT9nWL4/interview-prep-Gb6kihTmLjZitRVvdBThSt.webp";

const mentors = [
  {
    name: "Kevin Zhang",
    role: "首席导师 · Google L6",
    avatar: "K",
    color: "bg-blue-500",
    bio: "前 Google Senior Staff Engineer，10 年 FAANG 经验，辅导 300+ 学员成功入职顶级科技公司。",
    tags: ["算法", "系统设计", "Google 内推"],
  },
  {
    name: "Sarah Li",
    role: "求职策略导师 · Meta",
    avatar: "S",
    color: "bg-purple-500",
    bio: "前 Meta 招聘经理，深度了解大厂招聘流程，专注行为面试辅导和 Offer 谈判策略。",
    tags: ["行为面试", "Offer 谈判", "职业规划"],
  },
  {
    name: "Michael Wang",
    role: "移民规划顾问",
    avatar: "M",
    color: "bg-teal-500",
    bio: "持牌移民律师，专注 H1B / O1 / EB 绿卡申请，帮助 500+ 工程师解决签证问题。",
    tags: ["H1B", "绿卡规划", "OPT 续签"],
  },
];

export default function AboutSection() {
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
    <section id="about" className="py-20 bg-gray-50">
      <div className="container">
        {/* Top: Image + Text */}
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={INTERVIEW_IMG}
                alt="面试辅导"
                className="w-full h-80 lg:h-[420px] object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100 max-w-[200px]">
              <div className="font-serif-sc font-bold text-2xl text-[#1B2B4B]">8 年</div>
              <div className="font-dm-sans text-xs text-gray-500 mt-1">
                专注华人程序员<br />美国求职赛道
              </div>
              <div className="mt-2 flex gap-1">
                {["🇺🇸", "🇨🇳", "💻"].map((e) => (
                  <span key={e} className="text-lg">{e}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-10 bg-[#E8603C] rounded-full" />
              <span className="font-dm-sans text-sm text-[#E8603C] font-semibold uppercase tracking-wider">
                关于我们
              </span>
            </div>
            <h2 className="font-serif-sc font-bold text-3xl md:text-4xl text-gray-900 mb-5 leading-tight">
              我们懂你，
              <br />
              因为我们
              <span className="text-[#E8603C]">走过同样的路</span>
            </h2>
            <div className="space-y-4 font-dm-sans text-gray-600 leading-relaxed">
              <p>
                美职通创立于 2016 年，由一群在 FAANG 工作的华人工程师共同创办。
                我们深知华人程序员在美国求职中面临的独特挑战：
                语言障碍、文化差异、信息不对称、缺乏内推资源……
              </p>
              <p>
                我们不是传统的培训机构，而是一个由过来人组成的求职陪伴社区。
                每一位导师都曾经历过你正在经历的一切，我们用亲身经历帮你少走弯路。
              </p>
              <p>
                8 年来，我们帮助了 <strong className="text-gray-900">1200+ 华人程序员</strong>
                成功入职 Google、Meta、Amazon、Apple、Netflix、Microsoft 等顶级科技公司，
                平均薪资提升 85%。
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                className="bg-[#1B2B4B] hover:bg-[#243a63] text-white border-0 font-dm-sans"
                onClick={() => toast.info("感谢你的兴趣！请通过微信联系我们：MeiZhiTong2024")}
              >
                预约免费咨询
              </Button>
              <Button
                variant="outline"
                className="border-[#1B2B4B] text-[#1B2B4B] hover:bg-[#1B2B4B]/5 font-dm-sans"
                onClick={() => {
                  const el = document.querySelector("#testimonials");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                查看学员案例
              </Button>
            </div>
          </div>
        </div>

        {/* Mentors */}
        <div>
          <h3 className="font-serif-sc font-bold text-2xl text-gray-900 mb-8 text-center">
            核心导师团队
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor, i) => (
              <div
                key={mentor.name}
                className={`card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-600 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${mentor.color} flex items-center justify-center font-serif-sc font-bold text-white text-xl`}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <div className="font-serif-sc font-bold text-gray-900">{mentor.name}</div>
                    <div className="font-dm-sans text-xs text-gray-400">{mentor.role}</div>
                  </div>
                </div>
                <p className="font-dm-sans text-sm text-gray-500 leading-relaxed mb-4">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-dm-sans text-xs text-[#1B2B4B] bg-blue-50 px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
