/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@file-vault/ui"],
  output: "standalone",
};

module.exports = nextConfig;
