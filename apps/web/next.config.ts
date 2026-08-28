import type { NextConfig } from "next";

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@manyhands/data", "@manyhands/domain"],
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
