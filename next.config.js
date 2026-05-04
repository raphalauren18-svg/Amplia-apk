/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // ── manifest.json ─────────────────────────────────────────
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type',                value: 'application/manifest+json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control',               value: 'public, max-age=0, must-revalidate' },
        ],
      },
      // ── service worker ────────────────────────────────────────
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type',       value: 'application/javascript; charset=utf-8' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control',      value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma',             value: 'no-cache' },
        ],
      },
      // ── offline fallback ──────────────────────────────────────
      {
        source: '/offline.html',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // ── .well-known/assetlinks (obrigatório para TWA/Play Store)
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type',                value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control',               value: 'public, max-age=3600' },
        ],
      },
    ]
  },

  // Necessário para servir arquivos de .well-known no Vercel
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/.well-known/:path*',
          destination: '/.well-known/:path*',
        },
      ],
    }
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
