require("dotenv").config({ path: ".env.local" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude native modules from webpack bundling
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "onnxruntime-node": "commonjs onnxruntime-node",
        "chromadb-default-embed": "commonjs chromadb-default-embed",
      });
    }
    return config;
  },
  // Suppress the native module warnings
  experimental: {
    serverComponentsExternalPackages: [
      "chromadb",
      "chromadb-default-embed",
      "onnxruntime-node",
    ],
  },
};

module.exports = nextConfig;
