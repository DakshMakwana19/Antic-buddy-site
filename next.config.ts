import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Antic-buddy-site",
  assetPrefix: "/Antic-buddy-site/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
