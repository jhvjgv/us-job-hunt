import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Lesson = { title: string; preview?: boolean };

type Module = { title: string; lessons: Lesson[] };

const modules: Module[] = [
  {
    title: "简历与在线形象",
    lessons: [
      { title: "简历结构与美国 ATS 关键词", preview: true },
      { title: "简历模板与修改清单", preview: true },
      { title: "简历 1v1 深度批改（录播 + 反馈）" },
      { title: "LinkedIn 与 GitHub 展示要点" },
    ],
  },
  {
    title: "投递与内推",
    lessons: [
      { title: "岗位渠道：Where & HOW 投递", preview: true },
      { title: "内推逻辑与沟通话术（含 Demo）" },
      { title: "申请追踪表与周复盘" },
    ],
  },
  {
    title: "行为面试",
    lessons: [
      { title: "STAR 与故事库搭建", preview: true },
      { title: "Mock 行为面试（上 / 下）" },
      { title: "高频行为题题库（含技能标签）" },
    ],
  },
  {
    title: "技术面试",
    lessons: [
      { title: "算法面试路径与刷题策略" },
      { title: "一轮技术面试全真模拟" },
      { title: "系统设计专题（分布式 / 缓存等）" },
      { title: "附加：数据结构巩固资源索引" },
    ],
  },
  {
    title: "加餐：Offer 之后",
    lessons: [
      { title: "薪资谈判与总包拆解" },
      { title: "入职前准备与答疑" },
    ],
  },
];

export default function CourseCurriculum() {
  return (
    <section id="curriculum" className="scroll-mt-20 py-14 md:py-20">
      <div className="container max-w-3xl">
        <h2 className="font-serif-sc text-2xl font-bold text-foreground md:text-3xl">课程大纲</h2>
        <p className="mt-1 font-dm-sans text-sm uppercase tracking-wide text-muted-foreground">Curriculum</p>
        <p className="mt-3 font-dm-sans text-muted-foreground">
          按模块展开；标有「免费试听 / Free preview」的条目可先体验风格与深度。
        </p>

        <Accordion type="multiple" defaultValue={[modules[0].title]} className="mt-8">
          {modules.map((mod) => (
            <AccordionItem key={mod.title} value={mod.title} className="border-border">
              <AccordionTrigger className="font-serif-sc text-base hover:no-underline md:text-lg">
                {mod.title}
              </AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal space-y-2 pl-5 font-dm-sans text-sm text-foreground/90">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.title} className="flex flex-wrap items-center gap-2">
                      <span>{lesson.title}</span>
                      {lesson.preview && (
                        <Badge variant="secondary" className="font-dm-sans text-[10px] font-normal">
                          试听 · Preview
                        </Badge>
                      )}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
