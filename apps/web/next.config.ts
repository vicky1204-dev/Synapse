import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the multiple-lockfile warning: anchor Turbopack to the web app
    // directory rather than letting it infer the monorepo root.
    root: __dirname,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
