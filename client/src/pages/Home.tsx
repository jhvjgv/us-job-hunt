/*
 * 首页 — 雅典娜编程 Athena Programming · 课程型落地（中英双语文案）
 */

import CourseNavbar from "@/components/course-landing/CourseNavbar";
import CourseHero from "@/components/course-landing/CourseHero";
import CourseCurriculum from "@/components/course-landing/CourseCurriculum";
import CourseAbout from "@/components/course-landing/CourseAbout";
import CourseFooter from "@/components/course-landing/CourseFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <CourseNavbar />
      <main>
        <CourseHero />
        <CourseCurriculum />
        <CourseAbout />
      </main>
      <CourseFooter />
    </div>
  );
}
