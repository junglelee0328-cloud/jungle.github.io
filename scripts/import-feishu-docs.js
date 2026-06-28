#!/usr/bin/env node

/**
 * 处理从飞书导出到本地的 Markdown 文件，迁移到 content/blog/。
 *
 * 前置步骤：
 * 1. 使用 feishu2md / xiaoyaosearch-feishu-export-md 等工具把飞书文档导出到
 *    temp/feishu-export/（保持目录结构，例如 temp/feishu-export/技术/xxx.md）
 * 2. 运行 node scripts/import-feishu-docs.js
 *
 * 脚本会：
 * - 读取 temp/feishu-export/ 下的所有 .md 文件
 * - 按一级目录作为分类
 * - 自动添加 frontmatter（title、date、category）
 * - 把引用的本地图片复制到 public/feishu-images/<分类>/ 并修正链接
 * - 写入 content/blog/<分类>/<slug>.md
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "temp", "feishu-export");
const TARGET_DIR = path.join(ROOT, "content", "blog");
const IMAGE_TARGET_DIR = path.join(ROOT, "public", "feishu-images");

function readBasePath() {
  const configPath = path.join(ROOT, "next.config.ts");
  const content = fs.readFileSync(configPath, "utf8");
  const match = content.match(/basePath:\s*"([^"]+)"/);
  return match ? match[1] : "";
}

const BASE_PATH = readBasePath();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .replace(/--+/g, "-");
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function findReferencedImages(content, sourceFileDir) {
  const images = [];
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const alt = match[1];
    const src = match[2];
    if (!src.startsWith("http") && !src.startsWith("data:")) {
      const resolved = path.resolve(sourceFileDir, decodeURIComponent(src));
      if (fs.existsSync(resolved)) {
        images.push({ alt, src, resolved });
      } else {
        console.warn(`⚠️ 图片未找到: ${src}（在 ${sourceFileDir}）`);
      }
    }
  }
  return images;
}

function processMarkdownFile(filePath) {
  const relativePath = path.relative(SOURCE_DIR, filePath);
  const topCategory = relativePath.split(path.sep)[0] || "未分类";
  const categorySlug = slugify(topCategory);

  const rawContent = fs.readFileSync(filePath, "utf8");
  const title = extractTitle(rawContent) || path.basename(filePath, ".md");
  const fileSlug = slugify(path.basename(filePath, ".md"));
  const slug = fileSlug || slugify(title);

  const sourceFileDir = path.dirname(filePath);
  const images = findReferencedImages(rawContent, sourceFileDir);

  let processedContent = rawContent;
  const imageTargetCategoryDir = path.join(IMAGE_TARGET_DIR, categorySlug);
  ensureDir(imageTargetCategoryDir);

  for (const img of images) {
    const ext = path.extname(img.resolved) || ".png";
    const imageName = `${slug}-${path.basename(img.resolved, ext)}${ext}`;
    const targetImagePath = path.join(imageTargetCategoryDir, imageName);
    fs.copyFileSync(img.resolved, targetImagePath);

    const webPath = `${BASE_PATH}/feishu-images/${categorySlug}/${imageName}`;
    processedContent = processedContent.replace(
      new RegExp(
        `!\\[${escapeRegex(img.alt)}\\]\\(${escapeRegex(img.src)}\\)`,
        "g"
      ),
      `![${img.alt}](${webPath})`
    );
  }

  // Remove existing frontmatter if present
  const contentWithoutFrontmatter = processedContent.replace(
    /^---\s*\n[\s\S]*?\n---\s*\n/,
    ""
  );

  const frontmatter = [
    "---",
    `title: ${title}`,
    `date: ${formatDate(fs.statSync(filePath).mtime)}`,
    `category: ${topCategory}`,
    "---",
    "",
  ].join("\n");

  const finalContent = frontmatter + contentWithoutFrontmatter;

  const targetCategoryDir = path.join(TARGET_DIR, categorySlug);
  ensureDir(targetCategoryDir);
  const targetFilePath = path.join(targetCategoryDir, `${slug}.md`);

  fs.writeFileSync(targetFilePath, finalContent, "utf8");
  console.log(`✅ ${relativePath} → content/blog/${categorySlug}/${slug}.md`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ 源目录不存在: ${SOURCE_DIR}`);
    console.error("请先用飞书导出工具把 Markdown 放到该目录。");
    process.exit(1);
  }

  ensureDir(TARGET_DIR);
  ensureDir(IMAGE_TARGET_DIR);

  const files = collectMarkdownFiles(SOURCE_DIR);
  if (files.length === 0) {
    console.warn(`⚠️ 在 ${SOURCE_DIR} 下没有找到 Markdown 文件。`);
    process.exit(0);
  }

  console.log(`📦 发现 ${files.length} 篇 Markdown 文档，开始迁移...\n`);
  files.forEach(processMarkdownFile);
  console.log("\n🎉 迁移完成，请运行 npm run build 查看效果。");
}

main();
