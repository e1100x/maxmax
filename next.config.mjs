/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://hailuoai.com/:path*',
      },
    ];
  },
};

export default nextConfig;
