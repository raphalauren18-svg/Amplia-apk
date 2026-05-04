'use client'

import { useEffect } from 'react'

export function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(reg => {
          console.log('[PWA] Service Worker registrado:', reg.scope)

          // Verificar atualizações a cada 60 min
          setInterval(() => reg.update(), 60 * 60 * 1000)
        })
        .catch(err => {
          console.warn('[PWA] Erro ao registrar Service Worker:', err)
        })
    }
  }, [])

  return null
}
