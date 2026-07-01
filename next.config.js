/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
  // NOTE: TypeScript and ESLint errors are ENFORCED.
  // Fix all errors — never suppress them.
  // eslint: { ignoreDuringBuilds: false }   ← REMOVED
  // typescript: { ignoreBuildErrors: false } ← REMOVED
};

module.exports = nextConfig;
