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

## 从飞书导入博客

### 1. 导出飞书文档为 Markdown

推荐使用现有工具导出，例如：

- [feishu2md](https://github.com/Wsine/feishu2md)（Go 编写，支持新版 Docx）
- [xiaoyaosearch-feishu-export-md](https://github.com/dtsola/xiaoyaosearch-feishu-export-md)（Node.js 编写）

以 `feishu2md` 为例：

```bash
# 安装
brew install feishu2md

# 配置凭证（需先在飞书开放平台创建企业自建应用）
feishu2md config --appId <你的 AppID> --appSecret <你的 AppSecret>

# 导出某个文件夹（保持目录结构）
feishu2md folder <folder_token> -o temp/feishu-export
```

> 需要的飞书权限：
> - `docx:document:readonly`
> - `drive:drive:readonly`
> - `drive:file:readonly`

### 2. 迁移到项目

将导出的 Markdown 放到 `temp/feishu-export/` 下，例如：

```
temp/feishu-export/
├── 技术/
│   ├── 文章一.md
│   └── 文章二.md
└── 随笔/
    └── 文章三.md
```

然后运行：

```bash
npm run import:feishu
```

脚本会：

- 按一级目录作为分类（如 `技术`、`随笔`）
- 自动提取标题、添加 frontmatter
- 把本地图片复制到 `public/feishu-images/<分类>/`
- 生成 `content/blog/<分类>/<slug>.md`

### 3. 构建并部署

```bash
npm run build
git add content/blog public/feishu-images
git commit -m "import feishu blogs"
git push origin main
```

然后 GitHub Actions 会自动重新部署。
