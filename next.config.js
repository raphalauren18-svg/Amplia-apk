/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite que o Next.js sirva arquivos de .well-known
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type',                   value: 'application/json' },
          { key: 'Access-Control-Allow-Origin',    value: '*' },
          { key: 'Cache-Control',                  value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type',                   value: 'application/manifest+json' },
          { key: 'Access-Control-Allow-Origin',    value: '*' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type',                   value: 'application/javascript' },
          { key: 'Service-Worker-Allowed',         value: '/' },
          { key: 'Cache-Control',                  value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/offline.html',
        headers: [
          { key: 'Cache-Control',                  value: 'public, max-age=86400' },
        ],
      },
    ]
  },

  // Garante que arquivos em public/.well-known sejam servidos
  async rewrites() {
    return []
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
