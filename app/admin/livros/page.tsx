import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sendBookApprovalEmail } from '@/lib/email'
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react'

async function approveBook(formData: FormData) {
  'use server'
  const bookId = formData.get('bookId') as string
  const admin  = createAdminClient()

  // Buscar dados do livro e autor para o e-mail
  const { data: book } = await admin
    .from('books')
    .select('title, authors(user_id, profiles:user_id(full_name, email))')
    .eq('id', bookId)
    .single()

  await admin.from('books').update({ status: 'published', rejection_note: null }).eq('id', bookId)

  // Conceder XP de publicação ao autor (100 XP)
  if ((book as any)?.authors?.user_id) {
    const { data: authorRow } = await admin
      .from('authors')
      .select('id')
      .eq('user_id', (book as any).authors.user_id)
      .single()

    if (authorRow) {
      const { data: xpRow } = await admin
        .from('author_xp')
        .select('total_xp, books_published')
        .eq('author_id', authorRow.id)
        .single()

      if (xpRow) {
        await admin.from('author_xp').update({
          total_xp:       (xpRow.total_xp       ?? 0) + 100,
          books_published:(xpRow.books_published ?? 0) + 1,
          updated_at:     new Date().toISOString(),
        }).eq('author_id', authorRow.id)
      } else {
        await admin.from('author_xp').insert({
          author_id:       authorRow.id,
          total_xp:        100,
          books_published: 1,
        }).catch(() => {})
      }
    }
  }

  // Enviar e-mail de aprovação
  const authorProfile = (book as any)?.authors?.profiles
  if (authorProfile?.email) {
    await sendBookApprovalEmail({
      to:         authorProfile.email,
      authorName: authorProfile.full_name ?? 'Autor',
      bookTitle:  (book as any)?.title ?? 'Livro',
      approved:   true,
    }).catch(() => {})
  }

  revalidatePath('/admin/livros')
}

async function rejectBook(formData: FormData) {
  'use server'
  const bookId = formData.get('bookId') as string
  const note   = formData.get('note')   as string
  const admin  = createAdminClient()

  const { data: book } = await admin
    .from('books')
    .select('title, authors(profiles:user_id(full_name, email))')
    .eq('id', bookId)
    .single()

  await admin.from('books').update({ status: 'rejected', rejection_note: note }).eq('id', bookId)

  // Enviar e-mail de rejeição
  const authorProfile = (book as any)?.authors?.profiles
  if (authorProfile?.email) {
    await sendBookApprovalEmail({
      to:         authorProfile.email,
      authorName: authorProfile.full_name ?? 'Autor',
      bookTitle:  (book as any)?.title ?? 'Livro',
      approved:   false,
      note,
    }).catch(() => {})
  }

  revalidatePath('/admin/livros')
}

export default async function AdminLivrosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')

  const { data: books } = await admin
    .from('books')
    .select(`*, authors(id, user_id, profiles:user_id(full_name, email))`)
    .order('created_at', { ascending: false })

  const pending   = books?.filter(b => b.status === 'pending')   ?? []
  const published = books?.filter(b => b.status === 'published') ?? []
  const rejected  = books?.filter(b => b.status === 'rejected')  ?? []

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Gestão de Livros</h1>
        <div className="flex gap-4 mb-8 text-sm flex-wrap">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">{pending.length} em análise</span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{published.length} publicados</span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">{rejected.length} rejeitados</span>
        </div>

        {pending.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" /> Aguardando análise
            </h2>
            <div className="space-y-4">
              {pending.map((book: any) => (
                <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {book.cover_url
                        ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                        : <BookOpen className="w-6 h-6 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-500">
                        Autor: {book.authors?.profiles?.full_name ?? 'N/D'} · {book.authors?.profiles?.email}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                        <span>R$ {Number(book.price).toFixed(2).replace('.', ',')}</span>
                        {book.pages     && <span>{book.pages} pág.</span>}
                        {book.spine_mm  && <span>Lombada: {book.spine_mm}mm</span>}
                        {book.has_ear_flap && <span>Com orelha</span>}
                      </div>
                      {book.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {/* Aprovar */}
                    <form action={approveBook}>
                      <input type="hidden" name="bookId" value={book.id} />
                      <button type="submit"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <CheckCircle className="w-4 h-4" /> Aprovar
                      </button>
                    </form>
                    {/* Rejeitar */}
                    <form action={rejectBook} className="flex gap-2 flex-1">
                      <input type="hidden" name="bookId" value={book.id} />
                      <input name="note" placeholder="Motivo da rejeição..." required
                        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-red-400 outline-none min-w-0" />
                      <button type="submit"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                        <XCircle className="w-4 h-4" /> Rejeitar
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {pending.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-8">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-medium text-green-700">Nenhum livro aguardando análise</p>
          </div>
        )}

        {/* Publicados */}
        {published.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Publicados ({published.length})
            </h2>
            <div className="space-y-3">
              {published.map((book: any) => (
                <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex gap-3 items-center">
                  <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                      : <BookOpen className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 truncate">{book.authors?.profiles?.full_name ?? 'N/D'}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 shrink-0">
                    {new Date(book.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rejeitados */}
        {rejected.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" /> Rejeitados ({rejected.length})
            </h2>
            <div className="space-y-3">
              {rejected.map((book: any) => (
                <div key={book.id} className="bg-white rounded-2xl border border-red-100 shadow-card p-4 flex gap-3 items-start">
                  <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                      : <BookOpen className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 truncate">{book.authors?.profiles?.full_name ?? 'N/D'}</p>
                    {book.rejection_note && (
                      <p className="text-xs text-red-600 mt-1">Motivo: {book.rejection_note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
