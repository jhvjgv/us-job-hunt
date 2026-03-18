/*
 * CTA Section - 行动召唤
 * Design: 珊瑚橙渐变背景，大标题，双按钮
 */

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#E8603C] via-[#d45530] to-[#c04020] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-dm-sans text-sm text-white font-medium">现在报名，立享早鸟优惠</span>
          </div>

          <h2 className="font-serif-sc font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
            你距离硅谷 Offer，
            <br />
            只差一个决定
          </h2>

          <p className="font-dm-sans text-lg text-white/80 mb-10 leading-relaxed">
            每年只接受 <strong className="text-white">200 名</strong> 学员，确保每位学员都能得到充分的关注。
            <br />
            名额有限，现在预约免费评估，锁定你的席位。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#E8603C] hover:bg-gray-50 border-0 font-dm-sans text-base px-10 h-14 shadow-xl font-semibold transition-all hover:scale-105"
              onClick={() => toast.success("已提交申请！我们将在 24 小时内联系你。")}
            >
              立即申请免费评估
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white/15 font-dm-sans text-base px-10 h-14"
              onClick={() => toast.info("微信号：MeiZhiTong2024，添加后发送「求职」即可。")}
            >
              <MessageCircle size={18} className="mr-2" />
              微信咨询
            </Button>
          </div>

          <p className="font-dm-sans text-sm text-white/50 mt-8">
            免费评估 · 无需付费 · 不满意不报名
          </p>
        </div>
      </div>
    </section>
  );
}
