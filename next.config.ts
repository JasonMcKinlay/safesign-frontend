import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // Force webpack to ensure consistency with next-pwa
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
})(nextConfig);
