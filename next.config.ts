import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "facxhzyvbqgfkccwmtxx.supabase.co",
      },
    ],
  },
};

export default nextConfig;
