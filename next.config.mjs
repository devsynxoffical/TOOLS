/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14: externalize packages used by lib/auth → nextauth route
  experimental: {
    serverComponentsExternalPackages: ["zod", "bcrypt"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
