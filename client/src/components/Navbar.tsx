/*
 * Navbar Component
 * Design: 深海军蓝背景，固定顶部，滚动后增加阴影
 * Font: DM Sans for nav items
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "服务介绍", href: "#services" },
  { label: "求职路径", href: "#process" },
  { label: "成功案例", href: "#testimonials" },
  { label: "定价方案", href: "#pricing" },
  { label: "关于我们", href: "#about" },
];

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1B2B4B]/95 backdrop-blur-md shadow-lg shadow-[#1B2B4B]/20"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8603C] flex items-center justify-center font-bold text-white text-sm font-serif-sc">
              职
            </div>
            <span className="font-serif-sc font-bold text-white text-lg leading-tight">
              美职通
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-dm-sans text-sm text-white/80 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E8603C] after:transition-all hover:after:w-full"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white bg-transparent hover:bg-white/10 font-dm-sans"
              onClick={() => setLocation("/login")}
            >
              登录
            </Button>
            <Button
              size="sm"
              className="bg-[#E8603C] hover:bg-[#d45530] text-white border-0 font-dm-sans"
              onClick={() => setLocation("/register")}
            >
              注册
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1B2B4B]/98 backdrop-blur-md border-t border-white/10">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-3 px-2 text-white/80 hover:text-white font-dm-sans text-sm border-b border-white/5"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/30 text-white bg-transparent hover:bg-white/10"
                onClick={() => setLocation("/login")}
              >
                登录
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#E8603C] hover:bg-[#d45530] text-white border-0"
                onClick={() => setLocation("/register")}
              >
                注册
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
