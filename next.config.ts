import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, x-tenant-id" },
        ],
      }
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'https://comin.kaveeshagimhana.com'}/api/v1/auth/:path*`,
      },
    ]
  },

  allowedDevOrigins: [
    'comin.kaveeshagimhana.com',
  ],
};

export default nextConfig;
