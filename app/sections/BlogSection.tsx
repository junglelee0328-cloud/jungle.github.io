import { BookOpen, Calendar, Clock, FolderOpen } from "lucide-react";
import { BlogPostMeta } from "@/lib/blog";

interface BlogSectionProps {
  posts: BlogPostMeta[];
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function BlogSection({
  posts,
  categories,
  activeCategory,
  onCategoryChange,
}: BlogSectionProps) {
  const selectedCategory = activeCategory || categories[0] || null;
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.topCategory === selectedCategory)
    : posts;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">个人博客</h2>
        <p className="text-muted-foreground">
          按左侧目录浏览文章，内容会自动遍历{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">content/blog</code>{" "}
          下的一级目录及其子目录中的所有 Markdown 文件。
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 md:w-48">
          <nav className="sticky top-8 space-y-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              分类
            </p>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无分类</p>
            ) : (
              categories.map((category) => {
                const count = posts.filter(
                  (post) => post.topCategory === category
                ).length;
                const isActive = category === selectedCategory;
                return (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      {category}
                    </span>
                    <span
                      className={`text-xs tabular-nums ${
                        isActive ? "text-background/70" : "text-muted-foreground/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </nav>
        </aside>

        {/* Post list */}
        <div className="flex-1">
          {filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">该分类下暂无文章</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}/?category=${encodeURIComponent(
                    post.topCategory
                  )}`}
                  className="group block rounded-lg border bg-background p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FolderOpen className="h-3.5 w-3.5" />
                      {post.category}
                    </span>
                    {post.date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime} 分钟阅读
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
