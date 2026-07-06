/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nullvoid/shared', '@nullvoid/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'cdn.nullvoid.dev' },
    ],
  },
};

export default nextConfig;
