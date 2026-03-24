/*
 * job.* 域名 — $39 体系课入口 · Thinkific 课程页风格
 */

import CourseNavbar from "@/components/course-landing/CourseNavbar";
import ThinkificJobHero from "@/components/job-site/ThinkificJobHero";
import CourseCurriculum from "@/components/course-landing/CourseCurriculum";
import CourseAbout from "@/components/course-landing/CourseAbout";
import CourseFooter from "@/components/course-landing/CourseFooter";

export default function JobSiteHome() {
  return (
    <div className="min-h-screen bg-background">
      <CourseNavbar />
      <main>
        <ThinkificJobHero />
        <CourseCurriculum />
        <CourseAbout variant="job" />
      </main>
      <CourseFooter variant="job" />
    </div>
  );
}
