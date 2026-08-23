import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', 'mammoth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'resources.finalsite.net' },
      { protocol: 'https', hostname: 'ellesmerecollegeriyadh.com' },
      { protocol: 'https', hostname: 'www.ellesmere.com' },
    ],
  },
}

export default nextConfig
