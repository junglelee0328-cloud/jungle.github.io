import { FolderGit2, ExternalLink } from "lucide-react";
import { projects } from "@/lib/data";

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <article className="group rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <FolderGit2 className="h-5 w-5 text-muted-foreground" />
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.company} · {project.period}
          </p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mb-5 space-y-2">
        {project.contributions.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-2 h-1 w-1 rounded-full bg-foreground" />
            {item}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">项目经历</h2>
        <p className="text-muted-foreground">
          以下项目均来自实际工作，涵盖支付、流程引擎、消息系统与订阅业务等多个领域。
        </p>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
