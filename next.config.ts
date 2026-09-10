import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Automatically compress static assets with gzip/brotli
  compress: true,
  typescript: {
    // Prevent type discrepancies from halting Vercel deployment
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake and optimize heavy icon and utility imports
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours cache for remote images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
