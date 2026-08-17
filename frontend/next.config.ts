import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "rituels.vercel.app", // Ne redirige QUE si l'URL appelée est celle de Vercel
          },
        ],
        destination: "https://rituels.xiao-web.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
