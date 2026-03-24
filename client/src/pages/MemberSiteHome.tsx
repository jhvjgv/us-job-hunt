/*
 * member.* 域名 — $1 入口 · SWE Launchpad 风格
 */

import CourseNavbar from "@/components/course-landing/CourseNavbar";
import CourseHero from "@/components/course-landing/CourseHero";
import CourseTrialSection from "@/components/course-landing/CourseTrialSection";
import CourseCurriculum from "@/components/course-landing/CourseCurriculum";
import CourseAbout from "@/components/course-landing/CourseAbout";
import CourseFooter from "@/components/course-landing/CourseFooter";

export default function MemberSiteHome() {
  return (
    <div className="min-h-screen bg-background">
      <CourseNavbar />
      <main>
        <CourseHero />
        <CourseTrialSection />
        <CourseCurriculum />
        <CourseAbout variant="member" />
      </main>
      <CourseFooter variant="member" />
    </div>
  );
}
