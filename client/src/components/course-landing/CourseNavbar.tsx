import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/branding";
import { getSiteEntry, getJobOrigin, getMemberOrigin } from "@/siteEntry";

type NavItem = {
  label: string;
  labelEn: string;
  href: string;
  external?: boolean;
};

export default function CourseNavbar() {
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navLinks = useMemo<NavItem[]>(() => {
    const jobRoot = `${getJobOrigin()}/`;
    const memberRoot = `${getMemberOrigin()}/`;
    if (getSiteEntry() === "member") {
      return [
        { label: "课程大纲", labelEn: "Curriculum", href: "#curriculum" },
        { label: "关于课程", labelEn: "About", href: "#about-course" },
        { label: "完整体系课 $39", labelEn: "job 站", href: jobRoot, external: true },
      ];
    }
    return [
      { label: "课程大纲", labelEn: "Curriculum", href: "#curriculum" },
      { label: "关于课程", labelEn: "About", href: "#about-course" },
      { label: "$1 试用入口", labelEn: "member 站", href: memberRoot, external: true },
    ];
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (item: NavItem) => {
    setOpen(false);
    if (item.external && item.href.startsWith("http")) {
      window.location.href = item.href;
      return;
    }
    if (item.href.startsWith("#")) {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setLocation(item.href);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-left"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground font-serif-sc">
              {BRAND.logoMark}
            </div>
            <span className="flex flex-col leading-tight">
              <span className="font-serif-sc text-base font-semibold text-foreground md:text-lg">{BRAND.siteZh}</span>
              <span className="font-dm-sans text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {BRAND.siteEn}
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.label + l.href}
                type="button"
                onClick={() => go(l)}
                className="group flex flex-col items-start gap-0 text-left"
              >
                <span className="font-dm-sans text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {l.label}
                </span>
                <span className="font-dm-sans text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {l.labelEn}
                </span>
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" className="font-dm-sans" asChild>
              <Link href="/login">登录 · Sign in</Link>
            </Button>
            <Button size="sm" className="font-dm-sans bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/register">注册 · Sign up</Link>
            </Button>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-foreground md:hidden"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.label + l.href}
                type="button"
                className="rounded-md py-2.5 text-left font-dm-sans text-sm text-foreground"
                onClick={() => go(l)}
              >
                {l.label}{" "}
                <span className="text-muted-foreground">({l.labelEn})</span>
              </button>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1 font-dm-sans text-xs" asChild>
                <Link href="/login">登录 Sign in</Link>
              </Button>
              <Button className="flex-1 font-dm-sans text-xs bg-accent text-accent-foreground" asChild>
                <Link href="/register">注册 Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
