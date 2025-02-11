/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  env: {
    // API_URL: 'http://localhost:3001',
    API_URL: 'http://localhost:3001',
    FE_URL: 'http://localhost:3000',
  },
}

export default nextConfig
