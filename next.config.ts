import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone only when not deployed on Vercel (e.g., Docker container)
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
};

export default nextConfig;