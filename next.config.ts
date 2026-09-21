import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/categories", destination: "/catalogue", permanent: true },
      { source: "/admin/temoignages", destination: "/admin/reglages", permanent: true },
      { source: "/admin/hero-banner", destination: "/admin/reglages", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
