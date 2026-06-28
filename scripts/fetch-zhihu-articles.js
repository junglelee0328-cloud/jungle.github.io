#!/usr/bin/env node

/**
 * 使用 Playwright + Cookie 抓取知乎专栏文章，转换为 Markdown 并保存到 content/blog/java/。
 *
 * 用法：
 *   1. 在已登录知乎的浏览器中导出 Cookie，保存为 temp/zhihu-cookies.json
 *   2. node scripts/fetch-zhihu-articles.js
 *
 * Cookie 文件格式（Playwright 兼容）：
 *   [
 *     { "name": "z_c0", "value": "...", "domain": ".zhihu.com", "path": "/" },
 *     ...
 *   ]
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const TurndownService = require("turndown");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(ROOT, "content", "blog", "java");
const COOKIES_FILE = path.join(ROOT, "temp", "zhihu-cookies.json");

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

const CONTENT_SELECTOR = "div.Post-RichTextContainer";
const TITLE_SELECTOR = "h1.Post-Title";

const articles = [
  {
    url: "https://zhuanlan.zhihu.com/p/148675596",
    slug: "java-deep-into-jvm-intro",
    title: "深入理解 Java 虚拟机（一）引言",
  },
  {
    url: "https://zhuanlan.zhihu.com/p/149948009",
    slug: "java-deep-into-jvm-memory",
    title: "深入理解 Java 虚拟机（二）Java 内存布局",
  },
  {
    url: "https://zhuanlan.zhihu.com/p/150665569",
    slug: "java-deep-into-jvm-memory-object",
    title: "深入理解 Java 虚拟机（三）Java 内存对象及内存异常",
  },
  {
    url: "https://zhuanlan.zhihu.com/p/159059531",
    slug: "java-deep-into-jvm-gc-theory",
    title: "深入理解 Java 虚拟机（四）垃圾收集器",
  },
  {
    url: "https://zhuanlan.zhihu.com/p/391919786",
    slug: "java-deep-into-jvm-gc-log",
    title: "深入理解 Java 虚拟机（GC 日志分析）",
  },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanMarkdown(markdown) {
  return markdown
    .replace(/!\[\]\(data:image\/[^)]+\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTitleFromHtml(html) {
  const dom = new JSDOM(html);
  const titleEl = dom.window.document.querySelector(TITLE_SELECTOR);
  return titleEl ? titleEl.textContent.trim() : "";
}

async function fetchArticle(page, article) {
  try {
    console.log(`🌐 正在抓取: ${article.url}`);
    await page.goto(article.url, { waitUntil: "networkidle", timeout: 60000 });

    // 如果是验证页，则跳过
    const title = await page.title();
    if (title.includes("安全验证") || title.includes("验证")) {
      console.error(`❌ 仍然触发验证: ${article.url}`);
      return;
    }

    await page.waitForSelector(CONTENT_SELECTOR, { timeout: 15000 });

    const articleTitle =
      extractTitleFromHtml(await page.content()) || article.title;
    const contentHtml = await page.$eval(CONTENT_SELECTOR, (el) => el.innerHTML);

    let markdown = turndownService.turndown(contentHtml);
    markdown = cleanMarkdown(markdown);

    const frontmatter = [
      "---",
      `title: ${articleTitle}`,
      `date: ${new Date().toISOString().split("T")[0]}`,
      `category: java`,
      `source: ${article.url}`,
      "---",
      "",
    ].join("\n");

    const filePath = path.join(TARGET_DIR, `${article.slug}.md`);
    ensureDir(TARGET_DIR);
    fs.writeFileSync(filePath, frontmatter + markdown, "utf8");

    console.log(`✅ 已保存: ${filePath}`);
  } catch (err) {
    console.error(`❌ 抓取失败 ${article.url}: ${err.message}`);
  }
}

async function main() {
  if (!fs.existsSync(COOKIES_FILE)) {
    console.error(`❌ 找不到 Cookie 文件: ${COOKIES_FILE}`);
    console.error("请先从已登录的浏览器导出知乎 Cookie 并保存到该路径。");
    process.exit(1);
  }

  ensureDir(TARGET_DIR);

  const rawCookies = JSON.parse(fs.readFileSync(COOKIES_FILE, "utf8"));

  // 兼容 EditThisCookie 等扩展导出的格式，转换为 Playwright 格式
  const sameSiteMap = {
    strict: "Strict",
    lax: "Lax",
    none: "None",
    no_restriction: "None",
    unspecified: "Lax",
  };
  const cookies = rawCookies
    .filter((c) => c.name && c.value && c.domain && c.path)
    .map((c) => {
      const normalized = {
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        httpOnly: !!c.httpOnly,
        secure: !!c.secure,
      };
      if (c.expirationDate) {
        normalized.expires = Math.floor(c.expirationDate);
      }
      if (c.sameSite) {
        const ss = String(c.sameSite).toLowerCase();
        normalized.sameSite = sameSiteMap[ss] || "Lax";
      }
      return normalized;
    });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
  });
  await context.addCookies(cookies);

  const page = await context.newPage();

  try {
    for (const article of articles) {
      await fetchArticle(page, article);
    }
  } finally {
    await browser.close();
  }
  console.log("\n🎉 全部完成");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
