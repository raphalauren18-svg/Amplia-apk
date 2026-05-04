import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FeedClient } from '@/components/dashboard/feed-client'
import { Rss, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { data: author }  = await supabase.from('authors').select('id, subscription_active').eq('user_id', user.id).single()

  // Buscar posts com autor e contagens
  const { data: posts } = await supabase
    .from('feed_posts')
    .select(`
      id, content, image_url, likes_count, created_at, book_id,
      authors(id, store_name, user_id, profiles:user_id(full_name, avatar_url)),
      books:book_id(id, title, cover_url)
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  // Buscar likes do usuário atual
  const { data: userLikes } = await supabase
    .from('feed_likes')
    .select('post_id')
    .eq('user_id', user.id)

  const likedIds = new Set((userLikes ?? []).map((l: any) => l.post_id))

  // Enriquecer posts com liked status
  const enrichedPosts = (posts ?? []).map((p: any) => ({
    ...p,
    liked_by_me: likedIds.has(p.id),
  }))

  const isAuthor         = profile?.role === 'author'
  const canPost          = isAuthor && author?.subscription_active
  const authorId         = author?.id ?? null

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Rss className="w-6 h-6 text-[#F97316]" /> Feed Social
        </h1>
        <p className="text-gray-500 mb-8">Novidades e publicações dos autores da Amplia</p>

        {/* Aviso para autores sem assinatura ativa */}
        {isAuthor && !author?.subscription_active && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 text-sm">Publicação no feed requer assinatura ativa</p>
              <p className="text-amber-700 text-xs mt-1">
                Ative sua assinatura para compartilhar atualizações com seus leitores.
              </p>
              <Link href="/dashboard/configuracoes"
                className="inline-block mt-3 text-xs font-medium text-amber-800 underline underline-offset-2">
                Ver planos →
              </Link>
            </div>
          </div>
        )}

        <FeedClient
          authorId={authorId ?? ''}
          userId={user.id}
          initialPosts={enrichedPosts}
        />
      </div>
    </main>
  )
}
