import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
