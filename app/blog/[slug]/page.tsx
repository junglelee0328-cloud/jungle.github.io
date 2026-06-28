import { notFound } from "next/navigation";
import { Calendar, Clock, FolderOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/blog";
import BackLink from "@/app/components/BackLink";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "文章未找到" };
  }
  return {
    title: `${post.title} | 李俊的博客`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 py-12 md:py-16">
      <BackLink fallbackCategory={post.topCategory} />

      <div className="flex flex-col gap-10 md:flex-row">
        {/* Main content */}
        <article className="flex-1">
          <header className="mb-10 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4" />
                {post.category}
              </span>
              {post.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} 分钟阅读
              </span>
            </div>
          </header>

          <div className="prose-custom prose-reading">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeHighlight]}
              components={{
                h2: ({ node, children, ...props }) => {
                  const id = props.id;
                  return (
                    <h2 {...props}>
                      {id && (
                        <a href={`#${id}`} className="heading-anchor">
                          #
                        </a>
                      )}
                      {children}
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const id = props.id;
                  return (
                    <h3 {...props}>
                      {id && (
                        <a href={`#${id}`} className="heading-anchor">
                          #
                        </a>
                      )}
                      {children}
                    </h3>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* TOC sidebar */}
        {post.toc.length > 0 && (
          <aside className="shrink-0 md:w-56">
            <div className="sticky top-8 rounded-lg border bg-background p-5 shadow-sm">
              <p className="mb-4 text-sm font-semibold">目录</p>
              <nav className="space-y-2">
                {post.toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`toc-link level-${item.level}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      <footer className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} 李俊 · 个人博客</p>
      </footer>
    </div>
  );
}
