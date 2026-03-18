/*
 * Home Page - 华人程序员美国求职产品介绍网站
 * Design: 华美专业风（Premium Professional）
 * Color: 深海军蓝 #1B2B4B + 珊瑚橙 #E8603C
 * Font: Noto Serif SC + DM Sans
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LogoBar from "@/components/LogoBar";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LogoBar />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}
