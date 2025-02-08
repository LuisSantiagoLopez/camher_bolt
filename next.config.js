// next.config.js
const withTM = require('next-transpile-modules')([
  'maplibre-gl-js-amplify' // Add any other modules you might need to transpile here
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cxp-camher-dash44052-prod.s3.us-west-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = withTM(nextConfig);
