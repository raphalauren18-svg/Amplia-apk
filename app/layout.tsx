import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { PWAInit } from '@/components/pwa/pwa-init'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

export const viewport: Viewport = {
  themeColor:   '#0D1B8E',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit:  'cover',
}

export const metadata: Metadata = {
  title: {
    default:  'Amplia — Publique, Venda e Distribua seus Livros',
    template: '%s | Amplia',
  },
  description:
    'Plataforma completa para autores independentes: publique seu livro, conecte-se com gráficas parceiras e venda através de afiliados em todo o Brasil.',
  keywords: ['livros', 'publicação', 'autores', 'editora', 'impressão sob demanda', 'brasil'],
  authors:  [{ name: 'Amplia' }],
  manifest: '/manifest.json',           // ← Next.js injeta o <link rel="manifest"> aqui
  applicationName: 'Amplia',
  appleWebApp: {
    capable:        true,
    title:          'Amplia',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title:       'Amplia — Publique, Venda e Distribua seus Livros',
    description: 'Plataforma completa para autores independentes no Brasil.',
    type:        'website',
    locale:      'pt_BR',
    siteName:    'Amplia',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/*
          IMPORTANTE: estas tags são redundantes com o metadata acima
          mas garantem que o PWABuilder encontre o manifest mesmo
          em versões antigas do crawler.
        */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color"                    content="#0D1B8E" />
        <meta name="mobile-web-app-capable"         content="yes" />
        <meta name="apple-mobile-web-app-capable"   content="yes" />
        <meta name="apple-mobile-web-app-title"     content="Amplia" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon"                href="/icons/apple-icon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
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
