"use client";

import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  fallbackCategory?: string;
}

export default function BackLink({ fallbackCategory }: BackLinkProps) {
  let category = fallbackCategory;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    category = params.get("category") || fallbackCategory;
  }

  const backHref = category
    ? `/?tab=blog&category=${encodeURIComponent(category)}`
    : `/?tab=blog`;

  return (
    <a
      href={backHref}
      className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      返回{category ? `「${category}」` : ""}目录
    </a>
  );
}
