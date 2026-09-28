import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the multiple-lockfile warning: anchor Turbopack to the web app
    // directory rather than letting it infer the monorepo root.
    root: __dirname,
  },
};

export default nextConfig;
