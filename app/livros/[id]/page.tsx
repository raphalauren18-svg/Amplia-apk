import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { BookCheckout } from '@/components/book/book-checkout'
import { BookOpen, User, Calendar, FileText, Layers, Star } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: book } = await supabase
    .from('books')
    .select('title, description, cover_url, authors(store_name, profiles:user_id(full_name))')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!book) return { title: 'Livro não encontrado — Amplia' }

  const author = (book.authors as any)?.store_name ?? (book.authors as any)?.profiles?.full_name ?? 'Autor'
  return {
    title: `${book.title} — ${author} | Amplia`,
    description: book.description ?? `Compre "${book.title}" de ${author} na Amplia`,
    openGraph: {
      title: book.title,
      description: book.description ?? '',
      images: book.cover_url ? [{ url: book.cover_url }] : [],
    },
  }
}

export default async function LivroDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { id }  = await params
  const { ref } = await searchParams

  const supabase = await createClient()

  const [
    { data: book },
    { data: reviews },
  ] = await Promise.all([
    supabase
      .from('books')
      .select('*, authors(store_name, bio, profiles:user_id(full_name, avatar_url))')
      .eq('id', id)
      .eq('status', 'published')
      .single(),
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at, profiles:user_id(full_name, avatar_url)')
      .eq('book_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  if (!book) notFound()

  const authorName = (book.authors as any)?.store_name ?? (book.authors as any)?.profiles?.full_name ?? 'Autor'
  const hasPhysical = !!book.physical_price

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  function Stars({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Navbar forceDark />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Capa */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xs aspect-[2/3] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
              {book.cover_url
                ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                : <BookOpen className="w-16 h-16 text-[#4A7AFF]" />
              }
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm text-gray-400">
              {book.pages && (
                <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {book.pages} páginas</span>
              )}
              {book.spine_mm && (
                <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> Lombada: {book.spine_mm}mm</span>
              )}
            </div>
            {avgRating && (
              <div className="flex items-center gap-2 mt-3">
                <Stars rating={Math.round(Number(avgRating))} />
                <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                <span className="text-sm text-gray-400">({reviews?.length} avaliações)</span>
              </div>
            )}
          </div>

          {/* Info + Checkout */}
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{book.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <User className="w-4 h-4" />
              <span>{authorName}</span>
              {book.created_at && (
                <>
                  <span>·</span>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(book.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                </>
              )}
            </div>
            {book.isbn && <p className="text-xs text-gray-400 mb-3">ISBN: {book.isbn}</p>}

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-blue-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Digital (PDF)</p>
                <p className="text-xl font-bold text-[#0D1B8E]">
                  R$ {Number(book.digital_price ?? book.price).toFixed(2).replace('.', ',')}
                </p>
              </div>
              {hasPhysical && (
                <div className="bg-orange-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 mb-0.5">Físico impresso</p>
                  <p className="text-xl font-bold text-[#F97316]">
                    R$ {Number(book.physical_price).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              )}
            </div>

            {book.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{book.description}</p>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <BookCheckout bookId={id} affiliateSlug={ref ?? null} hasPhysical={hasPhysical} />
            </div>
          </div>
        </div>

        {/* Bio do autor */}
        {(book.authors as any)?.bio && (
          <div className="mt-14 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#4A7AFF]" /> Sobre o autor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#4A7AFF] to-[#0D1B8E] shrink-0 flex items-center justify-center">
                {(book.authors as any)?.profiles?.avatar_url
                  ? <img src={(book.authors as any).profiles.avatar_url} alt={authorName} className="w-full h-full object-cover" />
                  : <span className="text-white font-bold text-xl">{authorName[0].toUpperCase()}</span>
                }
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{authorName}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{(book.authors as any).bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Avaliações dos leitores
              <span className="text-sm font-normal text-gray-400 ml-1">({reviews.length})</span>
            </h2>
            <div className="space-y-5">
              {(reviews as any[]).map((review: any) => (
                <div key={review.id} className="flex gap-4 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A7AFF] to-[#0D1B8E] shrink-0 flex items-center justify-center overflow-hidden">
                    {review.profiles?.avatar_url
                      ? <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white text-sm font-bold">
                          {(review.profiles?.full_name || 'L')[0].toUpperCase()}
                        </span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {review.profiles?.full_name ?? 'Leitor'}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Stars rating={review.rating} />
                    {review.comment && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
