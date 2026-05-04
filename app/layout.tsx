import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { PWAInit } from '@/components/pwa/pwa-init'
import './globals.css'

const inter = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

/* ── Viewport separado (Next.js 14+) ─────────────────────────── */
export const viewport: Viewport = {
  themeColor:        '#0D1B8E',
  width:             'device-width',
  initialScale:      1,
  maximumScale:      1,
  userScalable:      false,
  viewportFit:       'cover', // suporte a notch/safe-area no Android
}

/* ── Metadata completa para PWA ──────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  'Amplia — Publique, Venda e Distribua seus Livros',
    template: '%s | Amplia',
  },
  description:
    'Plataforma completa para autores independentes: publique seu livro, conecte-se com gráficas parceiras e venda através de afiliados em todo o Brasil.',
  keywords:  ['livros', 'publicação', 'autores', 'editora', 'impressão sob demanda', 'brasil'],
  authors:   [{ name: 'Amplia' }],
  creator:   'Amplia',
  publisher: 'Amplia',
  category:  'books',

  /* ── Open Graph ─────────────────────────────────────────────── */
  openGraph: {
    title:       'Amplia — Publique, Venda e Distribua seus Livros',
    description: 'Plataforma completa para autores independentes no Brasil.',
    type:        'website',
    locale:      'pt_BR',
    siteName:    'Amplia',
  },

  /* ── PWA / manifest ─────────────────────────────────────────── */
  manifest: '/manifest.json',
  applicationName: 'Amplia',

  /* ── Apple (necessário para comportamento standalone no iOS) ─── */
  appleWebApp: {
    capable:        true,
    statusBarStyle: 'black-translucent',
    title:          'Amplia',
    startupImage: [
      // iPhone 14 Pro Max
      { url: '/splash/splash-1290x2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 14 / 13 / 12
      { url: '/splash/splash-1170x2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone SE
      { url: '/splash/splash-750x1334.png',  media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
    ],
  },

  /* ── Icons ──────────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: '/icons/icon-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192.png',
  },

  /* ── Robots ─────────────────────────────────────────────────── */
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Android Chrome — já coberto pelo manifest, mas garantia */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Safe area para dispositivos com notch */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* MS Tiles (Windows) */}
        <meta name="msapplication-TileColor"  content="#0D1B8E" />
        <meta name="msapplication-TileImage"  content="/icons/icon-144.png" />
        <meta name="msapplication-config"     content="/browserconfig.xml" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <PWAInit />
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
