/*
 * Footer — 雅典娜编程 Athena Programming
 */

import { BRAND, copyrightLine } from "@/branding";

const footerLinks = {
  服务: [
    { label: "简历优化", href: "#services" },
    { label: "算法特训", href: "#services" },
    { label: "系统设计", href: "#services" },
    { label: "行为面试", href: "#services" },
    { label: "Offer 谈判", href: "#services" },
  ],
  资源: [
    { label: "求职路径", href: "#process" },
    { label: "成功案例", href: "#testimonials" },
    { label: "定价方案", href: "#pricing" },
    { label: "关于我们", href: "#about" },
  ],
  联系: [
    { label: "微信：AthenaProgramming", href: "#" },
    { label: "邮箱：hello@athenaprogramming.com", href: "#" },
    { label: "公众号：雅典娜编程", href: "#" },
    { label: "小红书：雅典娜编程", href: "#" },
  ],
};

export default function Footer() {
  const handleClick = (href: string) => {
    if (href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d1a2e] text-white">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E8603C] flex items-center justify-center font-bold text-white text-sm font-serif-sc">
                {BRAND.logoMark}
              </div>
              <span className="font-serif-sc font-bold text-white text-lg">{BRAND.siteZh}</span>
            </div>
            <p className="font-dm-sans text-xs text-white/40 mb-1">{BRAND.siteEn}</p>
            <p className="font-dm-sans text-sm text-white/50 leading-relaxed mb-5">
              雅典娜 Coder · Athena — 华人程序员赴美求职全流程
              <br />
              <span className="text-white/40">Structured US tech job search for Chinese-speaking engineers.</span>
            </p>
            <div className="flex gap-3">
              {["微信", "知乎", "小红书"].map((platform) => (
                <div
                  key={platform}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/60 hover:bg-white/20 transition-colors cursor-pointer font-dm-sans"
                >
                  {platform[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-serif-sc font-bold text-white text-sm mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleClick(link.href)}
                      className="font-dm-sans text-sm text-white/50 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-dm-sans text-xs text-white/30">
            {copyrightLine(new Date().getFullYear())}
          </p>
          <div className="flex gap-6">
            {["隐私政策", "服务条款", "退款政策"].map((item) => (
              <span key={item} className="font-dm-sans text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
