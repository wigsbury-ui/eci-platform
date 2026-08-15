import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'resources.finalsite.net' },
      { protocol: 'https', hostname: 'ellesmerecollegeriyadh.com' },
      { protocol: 'https', hostname: 'www.ellesmere.com' },
    ],
  },
}

export default nextConfig
