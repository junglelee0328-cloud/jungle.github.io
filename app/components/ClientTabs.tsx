"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar, Code2, FolderGit2, BookOpen } from "lucide-react";
import { profile } from "@/lib/data";
import { BlogPostMeta } from "@/lib/blog";
import AboutSection from "../sections/AboutSection";
import ProjectsSection from "../sections/ProjectsSection";
import BlogSection from "../sections/BlogSection";

type TabKey = "about" | "projects" | "blog";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "about", label: "个人简介", icon: <Code2 className="h-4 w-4" /> },
  { key: "projects", label: "项目经历", icon: <FolderGit2 className="h-4 w-4" /> },
  { key: "blog", label: "个人博客", icon: <BookOpen className="h-4 w-4" /> },
];

interface ClientTabsProps {
  posts: BlogPostMeta[];
  categories: string[];
}

function getTabFromUrl(): TabKey {
  if (typeof window === "undefined") return "about";
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") as TabKey;
  return tabs.some((t) => t.key === tab) ? tab : "about";
}

function getCategoryFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function updateUrl(params: { tab?: TabKey; category?: string | null }) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (params.tab !== undefined) {
    url.searchParams.set("tab", params.tab);
  }
  if (params.category === null || params.category === "") {
    url.searchParams.delete("category");
  } else if (params.category !== undefined) {
    url.searchParams.set("category", params.category);
  }
  window.history.replaceState({}, "", url.toString());
}

export default function ClientTabs({ posts, categories }: ClientTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(getTabFromUrl());
    setActiveCategory(getCategoryFromUrl());
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    updateUrl({ tab: key });
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    updateUrl({ category });
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 py-12 md:py-16">
      <header className="mb-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {profile.name}
          </h1>
          <p className="text-lg text-muted-foreground">{profile.title}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {profile.birthday}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </span>
          <a
            href={`tel:${profile.phone}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            {profile.phone}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
        </div>
      </header>

      <nav className="mb-10">
        <div className="inline-flex gap-1 rounded-lg border bg-muted/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={activeTab === tab.key ? "page" : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="min-h-[24rem]">
        {activeTab === "about" && <AboutSection />}
        {activeTab === "projects" && <ProjectsSection />}
        {activeTab === "blog" && (
          <BlogSection
            posts={posts}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </main>

      <footer className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name} · 用代码构建简洁而有力的系统
        </p>
      </footer>
    </div>
  );
}
