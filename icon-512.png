import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Edit, Eye, FileText, Layers, DollarSign, TrendingUp, ArrowLeft, ExternalLink } from 'lucide-react'

export default async function DashboardLivroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: author } = await supabase.from('authors').select('id').eq('user_id', user.id).single()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .eq('author_id', author?.id ?? '')
    .single()

  if (!book) notFound()

  const { data: sales } = await supabase
    .from('sales')
    .select('id, type, total, author_share, created_at')
    .eq('book_id', id)
    .in('status', ['paid', 'printing', 'shipped', 'delivered'])
    .order('created_at', { ascending: false })

  const totalReceita = (sales ?? []).reduce((s: number, r: any) => s + Number(r.author_share ?? 0), 0)
  const totalVendas  = (sales ?? []).length
  const vendasDigital  = (sales ?? []).filter((s: any) => s.type === 'digital').length
  const vendasFisico   = (sales ?? []).filter((s: any) => s.type === 'physical').length

  const statusMap: Record<string, { label: string; color: string }> = {
    draft:     { label: 'Rascunho',   color: 'bg-gray-100 text-gray-600'    },
    pending:   { label: 'Em análise', color: 'bg-yellow-100 text-yellow-700' },
    published: { label: 'Publicado',  color: 'bg-green-100 text-green-700'  },
    rejected:  { label: 'Rejeitado',  color: 'bg-red-100 text-red-600'      },
  }
  const status = statusMap[book.status] ?? statusMap.draft

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Voltar */}
        <Link href="/dashboard/livros" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Meus livros
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
          <div className="w-28 aspect-[2/3] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden shadow-md shrink-0 flex items-center justify-center">
            {book.cover_url
              ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
              : <BookOpen className="w-8 h-8 text-[#4A7AFF]" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-display font-bold text-gray-900">{book.title}</h1>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>
            </div>
            {book.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{book.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/livros/${id}/editar`}
                className="flex items-center gap-2 bg-[#0D1B8E] hover:bg-[#4A7AFF] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Edit className="w-4 h-4" /> Editar livro
              </Link>
              {book.status === 'published' && (
                <Link href={`/livros/${id}`} target="_blank"
                  className="flex items-center gap-2 border border-gray-200 hover:border-[#4A7AFF] text-gray-600 hover:text-[#0D1B8E] text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  <ExternalLink className="w-4 h-4" /> Ver na loja
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Receita total',   value: `R$ ${totalReceita.toFixed(2).replace('.', ',')}`, Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50'  },
            { label: 'Total vendas',    value: String(totalVendas),                               Icon: TrendingUp, color: 'text-[#0D1B8E]', bg: 'bg-blue-50'   },
            { label: 'Digital',         value: String(vendasDigital),                             Icon: FileText,   color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Físico',          value: String(vendasFisico),                              Icon: Layers,     color: 'text-[#F97316]',  bg: 'bg-orange-50' },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Detalhes do livro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Informações</h2>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Preço digital',  value: book.digital_price  ? `R$ ${Number(book.digital_price).toFixed(2).replace('.', ',')}` : '—' },
                { label: 'Preço físico',   value: book.physical_price ? `R$ ${Number(book.physical_price).toFixed(2).replace('.', ',')}` : 'Não disponível' },
                { label: 'Páginas',        value: book.pages     ? `${book.pages} pág.`     : '—' },
                { label: 'Lombada',        value: book.spine_mm  ? `${book.spine_mm}mm`      : '—' },
                { label: 'Com orelha',     value: book.has_ear_flap ? 'Sim' : 'Não'             },
                { label: 'ISBN',           value: book.isbn ?? '—'                               },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#4A7AFF]" /> Últimas vendas
            </h2>
            {(!sales || sales.length === 0) ? (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Nenhuma venda ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(sales as any[]).slice(0, 6).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sale.type === 'digital' ? 'bg-blue-50 text-[#0D1B8E]' : 'bg-orange-50 text-[#F97316]'}`}>
                        {sale.type === 'digital' ? 'Digital' : 'Físico'}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className="font-bold text-green-600">+R$ {Number(sale.author_share ?? 0).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
