'use client'

import { useState } from 'react'
import { Loader2, Truck, CheckCircle } from 'lucide-react'

interface Props {
  orderId:      string
  currentStatus: string
}

export function OrderActions({ orderId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState(currentStatus)

  async function updateStatus(newStatus: string) {
    setLoading(true)
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setLoading(false)
  }

  if (status === 'delivered') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-green-600">
        <CheckCircle className="w-4 h-4" />
        Entregue
      </span>
    )
  }

  return (
    <button
      onClick={() => updateStatus(status === 'printing' ? 'shipped' : 'delivered')}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm bg-brand text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Truck className="w-3.5 h-3.5" />
      }
      {status === 'printing' ? 'Marcar enviado' : 'Marcar entregue'}
    </button>
  )
}
