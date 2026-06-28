import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "李俊 | Java 服务端研发工程师",
  description:
    "李俊的个人简历与博客，专注于 Java 服务端开发、分布式系统与工程实践。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
