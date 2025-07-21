/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
    useLightningcss: true,
    // reactCompiler: true,
  },
};

export default nextConfig;
