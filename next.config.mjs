/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // For GrapesJS canvas DOM compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.islamic.network',
      },
    ],
  },
  webpack: (config) => {
    // Canvas & Audio SSR safety
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
