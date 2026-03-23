import { Link } from "wouter";
import { BRAND, copyrightLine } from "@/branding";

export default function CourseFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-background py-10">
      <div className="container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground font-serif-sc">
              {BRAND.logoMark}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif-sc font-semibold text-foreground">{BRAND.siteZh}</span>
              <span className="font-dm-sans text-[10px] uppercase tracking-wide text-muted-foreground">{BRAND.siteEn}</span>
            </div>
          </div>
          <p className="mt-2 font-dm-sans text-sm text-muted-foreground">{copyrightLine(year)}</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-dm-sans text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            首页 Home
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            全部产品 All plans
          </Link>
          <span className="cursor-default hover:text-foreground">隐私 Privacy</span>
          <span className="cursor-default hover:text-foreground">条款 Terms</span>
        </nav>
      </div>
    </footer>
  );
}
