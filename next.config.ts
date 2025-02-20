import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL}/api/v1/auth/:path*`,
      },
    ]
  },
};

export default nextConfig;
