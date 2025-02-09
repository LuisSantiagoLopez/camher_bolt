/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
};

module.exports = nextConfig;