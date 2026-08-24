import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Damage photos are posted through a server action, so the default 1MB
    // action body limit is far too small.
    serverActions: { bodySizeLimit: "30mb" },
  },
  webpack: (config) => {
    // webpack's default xxhash64 WASM hasher crashes on Node 22+ during build.
    config.output.hashFunction = "sha256";
    return config;
  },
};

export default nextConfig;
