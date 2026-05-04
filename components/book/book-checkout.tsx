'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Loader2, MapPin } from 'lucide-react'

interface Props {
  bookId:        string
  digitalPrice?: number | null
  physicalPrice?: number | null
  affiliateSlug?: string
}

export function BookCheckout({ bookId, digitalPrice, physicalPrice, affiliateSlug }: Props) {
  const [type,    setType]    = useState<'digital' | 'physical'>('digital')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({ street: '', number: '', city: '', state: '', zip: '' })

  async function handleBuy() {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, type, affiliateSlug, deliveryAddress: type === 'physical' ? address : undefined }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.paymentLink) {
      window.open(data.paymentLink, '_blank')
    }
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-gray-900">Comprar</h3>

      {/* Type selector */}
      <div className="flex gap-3">
        {digitalPrice && (
          <button
            onClick={() => setType('digital')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              type === 'digital'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
            }`}
          >
            Digital — R$ {digitalPrice.toFixed(2).replace('.', ',')}
          </button>
        )}
        {physicalPrice && (
          <button
            onClick={() => setType('physical')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              type === 'physical'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
            }`}
          >
            Físico — R$ {physicalPrice.toFixed(2).replace('.', ',')}
          </button>
        )}
      </div>

      {/* Address fields for physical */}
      {type === 'physical' && (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            Endereço de entrega
          </p>
          {(['street', 'number', 'city', 'state', 'zip'] as const).map(field => (
            <input
              key={field}
              type="text"
              placeholder={{ street: 'Rua', number: 'Número', city: 'Cidade', state: 'UF', zip: 'CEP' }[field]}
              value={address[field]}
              onChange={e => setAddress(prev => ({ ...prev, [field]: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <ShoppingBag className="w-4 h-4" />
        }
        {loading ? 'Processando...' : 'Comprar agora'}
      </button>
    </div>
  )
}
