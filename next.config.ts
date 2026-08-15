import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Enable compress gzip/brotli
  compress: true,
};

export default nextConfig;
