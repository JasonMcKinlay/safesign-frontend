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
  // skipWaiting: true,
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
  //         { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  //       ],
  //     },
  //   ];
  // },
})(nextConfig);
