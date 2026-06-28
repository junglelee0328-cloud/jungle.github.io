import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  topCategory: string;
  excerpt: string;
  readingTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  toc: TocItem[];
}

const postsDirectory = path.join(process.cwd(), "content", "blog");

function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, "-");
}

function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    toc.push({ id, text, level });
  }
  return toc;
}

function parsePost(
  fileContents: string,
  relPath: string
): BlogPost {
  const { data, content } = matter(fileContents);

  const normalizedPath = relPath.replace(/\\/g, "/").replace(/\.md$/, "");
  const slug = normalizedPath.replace(/\//g, "--");
  const topCategory = normalizedPath.split("/")[0] || "未分类";
  const category = data.category || topCategory;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 300));

  const rawExcerpt =
    data.excerpt || content.replace(/^#.*\n/, "").trim().slice(0, 160);

  const dateValue = data.date
    ? data.date instanceof Date
      ? data.date.toISOString().split("T")[0]
      : String(data.date)
    : "";

  return {
    slug,
    title: data.title || slug,
    date: dateValue,
    category,
    topCategory,
    excerpt: rawExcerpt + (rawExcerpt.length >= 160 ? "…" : ""),
    readingTime,
    content,
    toc: extractToc(content),
  };
}

function readMarkdownFiles(
  dir: string,
  relativePath: string = "",
  includeContent: boolean = true
): BlogPost[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const posts: BlogPost[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      posts.push(...readMarkdownFiles(fullPath, relPath, includeContent));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const post = parsePost(fileContents, relPath);
      if (!includeContent) {
        // We still need toc for consistency, but content itself is dropped
        (post as unknown as BlogPostMeta & { toc?: TocItem[] }).toc = undefined;
      }
      posts.push(post);
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return readMarkdownFiles(postsDirectory, "", true);
}

export function getAllPostMetas(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return readMarkdownFiles(postsDirectory, "", false).map(
    ({ slug, title, date, category, topCategory, excerpt, readingTime }) => ({
      slug,
      title,
      date,
      category,
      topCategory,
      excerpt,
      readingTime,
    })
  );
}

export function getCategories(): string[] {
  const posts = getAllPostMetas();
  const categories = new Set(posts.map((post) => post.topCategory));
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.topCategory === category);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPostMetas().map((post) => post.slug);
}
