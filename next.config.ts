import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    typedEnv: true
  },
  typedRoutes: true,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        
      },
      {
        protocol: "https",
        hostname: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        
      },
    ],
  }
};

export default nextConfig;
