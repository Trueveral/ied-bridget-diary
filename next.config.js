/** @type {import('next').NextConfig} */

const DIFY_API_URL = process.env.DIFY_API_URL || "https://api.dify.ai";
const LORIPSUM_API_URL =
  process.env.LORIPSUM_API_URL || "https://loripsum.net/api";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/dify/:path*",
        destination: `${DIFY_API_URL}/:path*`,
      },
      {
        source: "/api/loripsum/:path*",
        destination: `${LORIPSUM_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
