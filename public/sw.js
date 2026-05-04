/* ══════════════════════════════════════════════════════════════
   Amplia — Service Worker v2
   Estratégias:
   - Static shell  → Cache First
   - API routes    → Network Only  (nunca cacheia dados dinâmicos)
   - Páginas       → Stale While Revalidate
   - Imagens/fonts → Cache First com expiração de 30 dias
   ══════════════════════════════════════════════════════════════ */

const APP_VERSION   = 'amplia-v2'
const STATIC_CACHE  = `${APP_VERSION}-static`
const PAGES_CACHE   = `${APP_VERSION}-pages`
const IMAGES_CACHE  = `${APP_VERSION}-images`

const STATIC_SHELL = [
  '/',
  '/livros',
  '/auth/login',
  '/auth/cadastro',
  '/como-funciona',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html',
]

const NEVER_CACHE = [
  '/api/',
  '/auth/callback',
  '/auth/signout',
  'supabase.co',
  'asaas.com',
  'resend.com',
]

/* ── Instalação ─────────────────────────────────────────────── */
self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(STATIC_CACHE).then(c =>
      c.addAll(STATIC_SHELL).catch(() => {})
    )
  )
})

/* ── Ativação — limpa caches antigos ────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![STATIC_CACHE, PAGES_CACHE, IMAGES_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

/* ── Fetch ──────────────────────────────────────────────────── */
self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Ignora non-GET
  if (request.method !== 'GET') return

  // Ignora rotas que nunca devem ser cacheadas
  if (NEVER_CACHE.some(p => request.url.includes(p))) return

  // Ignora chrome-extension, etc
  if (!['http:', 'https:'].includes(url.protocol)) return

  // Imagens e fontes → Cache First (30 dias)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/')
  ) {
    e.respondWith(cacheFirst(request, IMAGES_CACHE, 30))
    return
  }

  // Arquivos estáticos do Next.js (_next/static)
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(cacheFirst(request, STATIC_CACHE, 365))
    return
  }

  // Páginas → Stale While Revalidate
  if (request.destination === 'document') {
    e.respondWith(staleWhileRevalidate(request, PAGES_CACHE))
    return
  }

  // Demais requests → Network First com fallback
  e.respondWith(networkFirst(request))
})

/* ── Estratégias ────────────────────────────────────────────── */

async function cacheFirst(request, cacheName, maxAgeDays = 7) {
  const cache  = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    const date = cached.headers.get('date')
    if (date) {
      const age = (Date.now() - new Date(date).getTime()) / 86400000
      if (age < maxAgeDays) return cached
    } else {
      return cached
    }
  }

  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    return cached ?? Response.error()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then(res => { if (res.ok) cache.put(request, res.clone()); return res })
    .catch(() => null)

  return cached ?? fetchPromise ?? offlineFallback()
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(PAGES_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    return cached ?? offlineFallback()
  }
}

async function offlineFallback() {
  const cache = await caches.open(STATIC_CACHE)
  return cache.match('/offline.html') ?? new Response(
    '<h1>Sem conexão</h1><p>Verifique sua internet e tente novamente.</p>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

/* ── Push Notifications ─────────────────────────────────────── */
self.addEventListener('push', e => {
  if (!e.data) return
  const data = e.data.json()
  e.waitUntil(
    self.registration.showNotification(data.title ?? 'Amplia', {
      body:    data.body   ?? '',
      icon:    '/icons/icon-192.png',
      badge:   '/icons/icon-96.png',
      image:   data.image  ?? undefined,
      tag:     data.tag    ?? 'amplia-notification',
      renotify:data.renotify ?? false,
      data:    { url: data.url ?? '/dashboard' },
      actions: data.actions ?? [],
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = e.notification.data?.url ?? '/dashboard'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(url))
      if (existing) { existing.focus(); return }
      clients.openWindow(url)
    })
  )
})

/* ── Background Sync (para ações offline) ───────────────────── */
self.addEventListener('sync', e => {
  if (e.tag === 'amplia-sync') {
    e.waitUntil(syncPendingActions())
  }
})

async function syncPendingActions() {
  // Espaço para sincronizar ações feitas offline (ex: likes no feed)
  // Implementar conforme necessidade
}
