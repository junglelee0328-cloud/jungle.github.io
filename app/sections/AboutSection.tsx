import { GraduationCap, Award, Cpu, Wrench, Languages, User } from "lucide-react";
import { education, skills, experiences, selfEvaluation } from "@/lib/data";

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

export default function AboutSection() {
  return (
    <div className="space-y-8">
      <SectionCard icon={<User className="h-5 w-5" />} title="自我评价">
        <p className="leading-relaxed text-muted-foreground">{selfEvaluation}</p>
      </SectionCard>

      <SectionCard icon={<GraduationCap className="h-5 w-5" />} title="教育背景">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{education.school}</p>
              <p className="text-sm text-muted-foreground">
                {education.major} · {education.degree}
              </p>
            </div>
            <span className="text-sm tabular-nums text-muted-foreground">
              {education.period}
            </span>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">主修课程</p>
            <div className="flex flex-wrap gap-2">
              {education.courses.map((course) => (
                <SkillTag key={course}>{course}</SkillTag>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Cpu className="h-5 w-5" />} title="专业技能">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">核心技术栈</p>
            <ul className="space-y-2">
              {skills.core.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-2 h-1 w-1 rounded-full bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">AI 与现代工程</p>
            <div className="flex flex-wrap gap-2">
              {skills.modern.map((item) => (
                <SkillTag key={item}>{item}</SkillTag>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Award className="h-5 w-5" />} title="技能证书">
        <div className="flex flex-wrap gap-2">
          {skills.certificates.map((cert) => (
            <SkillTag key={cert}>{cert}</SkillTag>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={<Wrench className="h-5 w-5" />} title="工具使用">
        <div className="flex flex-wrap gap-2">
          {skills.tools.map((tool) => (
            <SkillTag key={tool}>{tool}</SkillTag>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={<Languages className="h-5 w-5" />} title="工作经历">
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.company} className="relative pl-4">
              <div className="absolute left-0 top-2 h-full w-px bg-border" />
              <div className="absolute left-[-3px] top-2 h-1.5 w-1.5 rounded-full bg-foreground" />
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-1.5">
                {exp.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 rounded-full bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
