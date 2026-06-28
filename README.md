# jungle.github.io

个人简历与博客的静态站点。

## 技术栈

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4
- Markdown 渲染：gray-matter、react-markdown、remark-gfm、rehype-highlight、rehype-slug

## 本地开发

```bash
npm install
npm run dev
```

## 构建静态站点

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到 GitHub Pages。

## 项目结构

- `app/`：Next.js 页面与组件
- `app/sections/`：三个 Tab 的内容组件（个人简介、项目经历、个人博客）
- `content/blog/`：博客 Markdown 源文件，支持子目录
- `lib/`：简历数据与博客工具函数
- `public/`：静态资源
