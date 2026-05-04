'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

type Platform = 'android' | 'ios' | 'desktop' | 'standalone'

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone'
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

export function PWAInit() {
  const [platform,  setPlatform]  = useState<Platform>('desktop')
  const [prompt,    setPrompt]    = useState<any>(null)
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [iosGuide,  setIosGuide]  = useState(false)

  useEffect(() => {
    const p = detectPlatform()
    setPlatform(p)

    // Não mostra se já instalado ou já dispensou hoje
    if (p === 'standalone') return
    const last = localStorage.getItem('amplia-pwa-dismissed')
    if (last && Date.now() - Number(last) < 86400000) return // 24h

    // Registrar SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }

    // Android — captura o evento nativo
    const handler = (e: any) => {
      e.preventDefault()
      setPrompt(e)
      setTimeout(() => setVisible(true), 2000) // delay sutil
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS — mostra guia manual depois de 3s
    if (p === 'ios') {
      setTimeout(() => setVisible(true), 3000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async () => {
    if (platform === 'ios') { setIosGuide(true); return }
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setPrompt(null)
  }, [platform, prompt])

  const dismiss = useCallback(() => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem('amplia-pwa-dismissed', String(Date.now()))
  }, [])

  if (platform === 'standalone' || dismissed || !visible) return null

  /* ── Guia iOS ─────────────────────────────────────────────── */
  if (iosGuide) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Instalar Amplia</h3>
            <button onClick={() => { setIosGuide(false); dismiss() }}
              className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 bg-[#0D1B8E] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <p>Toque no ícone de compartilhar <strong>⬆️</strong> na barra inferior do Safari</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 bg-[#0D1B8E] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <p>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 bg-[#0D1B8E] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <p>Confirme tocando em <strong>"Adicionar"</strong> no canto superior direito</p>
            </div>
          </div>
          <div className="mt-5 bg-blue-50 rounded-2xl p-3 text-xs text-[#0D1B8E] text-center">
            O app abre sem barra de endereços, como um app nativo 🚀
          </div>
        </div>
      </div>
    )
  }

  /* ── Banner principal ─────────────────────────────────────── */
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Barra decorativa */}
        <div className="h-1 bg-gradient-to-r from-[#0D1B8E] via-[#4A7AFF] to-[#F97316]" />

        <div className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#0D1B8E] shrink-0 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Instalar Amplia</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {platform === 'ios'
                ? 'Adicione à tela de início para acesso rápido'
                : 'Acesso rápido, funciona offline, notificações'
              }
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={install}
              className="bg-[#F97316] hover:bg-[#FBBF24] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              {platform === 'ios' ? 'Como' : 'Instalar'}
            </button>
            <button onClick={dismiss}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
