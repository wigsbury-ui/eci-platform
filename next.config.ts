import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Bundle office parsers for the server so Vercel resolves the Node build, not browser exports.
  serverExternalPackages: ['mammoth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'resources.finalsite.net' },
      { protocol: 'https', hostname: 'ellesmerecollegeriyadh.com' },
      { protocol: 'https', hostname: 'www.ellesmere.com' },
    ],
  },
}

export default nextConfig
