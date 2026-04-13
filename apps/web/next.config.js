/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@file-vault/ui"],
  output: "export",
  basePath: "/file-vault",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
