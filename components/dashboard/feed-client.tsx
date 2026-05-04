'use client'

import { Trophy, Star } from 'lucide-react'

interface FeedItem {
  id:         string
  type:       'sale' | 'xp' | 'badge'
  message:    string
  created_at: string
}

interface Props {
  items: FeedItem[]
}

export function FeedClient({ items }: Props) {
  if (!items.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nenhuma atividade ainda. Continue usando a Amplia!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item.id} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Star className="w-4 h-4 text-brand" />
          </div>
          <div>
            <p className="text-sm text-gray-800">{item.message}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
